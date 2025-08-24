import fetch from "node-fetch";
import pLimit from "p-limit";

const GITHUB_API = "https://api.github.com/graphql";

// Graphql endpoint allows requesting of exact fields
export async function githubGQL(query, variables, token) {
    const res = await fetch(GITHUB_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ query, variables }),
    });
    const data = await res.json();
    if (data.errors) throw new Error(JSON.stringify(data.errors));
    return data.data;
}

// call the githubREST API to get some of the features like webhooks, file contents
export async function githubREST(endpoint, token) {
    const res = await fetch(`https://api.github.com${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`GitHub REST error: ${res.status}`);
    return res.json();
}


//      Fetches a list of repositories for a given owner (user/org)
//     Optionally paginates using `after` cursor
//     Scans each repo using the provided `scanRepo` function (with concurrency limit)
export async function listRepositories(owner, first = 3, after, token, scanRepo) {
    const query = `
    query ListRepos($owner: String!, $first: Int!, $after: String) {
      repositoryOwner(login: $owner) {
        repositories(
          first: $first
          after: $after
          orderBy: { field: UPDATED_AT, direction: DESC }
        ) {
          pageInfo { hasNextPage endCursor }
          nodes {
            id
            name
            diskUsage
            owner { login }
            isPrivate
          }
        }
      }
    }
  `;

    const data = await githubGQL(query, { owner, first, after }, token);
    const conn = data.repositoryOwner?.repositories;
    if (!conn) return { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };

    // scan details for each repo (limit 2 in parallel)
    const limit = pLimit(2);
    const nodes = await Promise.all(
        conn.nodes.map(r =>
            limit(() => scanRepo({ owner: r.owner.login, name: r.name, token }))
        )
    );

    return { nodes, pageInfo: conn.pageInfo };
}


//     Fetches detailed information about a single repository
//     Includes repo metadata, file count, YAML file content, and webhooks
export async function repoDetails(owner, name, token) {
    const gqlQuery = `
    query RepoDetails($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        id
        name
        diskUsage
        owner { login }
        isPrivate
      }
    }
  `;


    const data = await githubGQL(gqlQuery, { owner, name }, token);
    const repo = data.repository;


    // fetch hooks via REST
    const hooks = await githubREST(`/repos/${owner}/${name}/hooks`, token);
    const yaml_res = await fetch(
        `https://api.github.com/repos/${owner}/${name}/git/trees/HEAD?recursive=1`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    const tree = await yaml_res.json();
    const fileCount = tree.tree.filter(f => f.type === "blob").length;
    const yamlFile = tree.tree.find(f => f.path.endsWith(".yml") || f.path.endsWith(".yaml"));
    const fileRes = await fetch(
        `https://api.github.com/repos/${owner}/${name}/contents/${yamlFile.path}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.raw" } }
    );
    const yamlContent = await fileRes.text();


    return {
        id: repo.id,
        name: repo.name,
        size: repo.diskUsage,
        owner: repo.owner.login,
        isPrivate: repo.isPrivate,
        fileCount,
        yamlContent,
        webhooks: hooks.map(h => ({
            id: h.id,
            name: h.name,
            active: h.active,
            url: h.config.url
        }))
    };
}
