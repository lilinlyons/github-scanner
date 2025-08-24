import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";

// Query 1: list all repositories
const REPOS_QUERY = gql`
  query {
    listRepositories(owner: "lilinlyons") {
      nodes {
        name
        size
        owner
      }
    }
  }
`;

// Query 2: details for a specific repository
const REPO_DETAILS_QUERY = gql`
  query RepoDetails($owner: String!, $name: String!) {
    repoDetails(owner: $owner, name: $name) {
      name
      size
      owner
      isPrivate
      fileCount
      yamlContent
      webhooks {
        id
        url
        active
      }
    }
  }
`;

function App() {
    const [selectedRepo, setSelectedRepo] = useState(null);

    // First query: get all repos
    const { loading, error, data } = useQuery(REPOS_QUERY);

    // Second query: only run when a repo is clicked
    const {
        loading: detailsLoading,
        error: detailsError,
        data: detailsData,
    } = useQuery(REPO_DETAILS_QUERY, {
        variables: selectedRepo
            ? { owner: "lilinlyons", name: selectedRepo }
            : null,
        skip: !selectedRepo,
    });

    if (loading) return <p>Loading repositories...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div style={{ padding: "20px", fontFamily: "Arial", position: "relative" }}>
            <h1
                style={{
                    color: "deeppink",
                    fontSize: "3rem",
                    fontWeight: "bold",
                    textShadow: "2px 2px 8px pink",
                    marginBottom: "20px",
                }}
            >
                 Lili Lyons Home Project
            </h1>

            {/* Top-right corner image from public folder */}
            <img
                src="/ox.png" // <-- put logo.png (or your image) inside /public
                alt="Project logo"
                style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    border: "3px solid deeppink",
                    boxShadow: "0 0 10px pink",
                    objectFit: "cover",
                }}
            />

            <h2>GitHub Repositories</h2>
            <ul>
                {data.listRepositories.nodes.map((repo) => (
                    <li
                        key={repo.name}
                        onClick={() => setSelectedRepo(repo.name)}
                        style={{
                            cursor: "pointer",
                            margin: "8px 0",
                            padding: "10px",
                            background: selectedRepo === repo.name ? "#eef" : "#fff",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                        }}
                    >
                        <strong>{repo.name}</strong> ({repo.size} KB) — Owner: {repo.owner}
                    </li>
                ))}
            </ul>

            {selectedRepo && (
                <div style={{ marginTop: "20px" }}>
                    <h2>Repository Details: {selectedRepo}</h2>
                    {detailsLoading && <p>Loading details...</p>}
                    {detailsError && <p>Error: {detailsError.message}</p>}
                    {detailsData && (
                        <div
                            style={{
                                padding: "15px",
                                background: "#fafafa",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                            }}
                        >
                            <p>
                                <strong>Name:</strong> {detailsData.repoDetails.name}
                            </p>
                            <p>
                                <strong>Owner:</strong> {detailsData.repoDetails.owner}
                            </p>
                            <p>
                                <strong>Size:</strong> {detailsData.repoDetails.size} KB
                            </p>
                            <p>
                                <strong>Private:</strong>{" "}
                                {detailsData.repoDetails.isPrivate ? "Yes" : "No"}
                            </p>
                            <p>
                                <strong>File Count:</strong>{" "}
                                {detailsData.repoDetails.fileCount}
                            </p>
                            <h3>Webhooks</h3>
                            <ul>
                                {detailsData.repoDetails.webhooks.map((wh) => (
                                    <li key={wh.id}>
                                        {wh.url} — {wh.active ? "Active" : "Inactive"}
                                    </li>
                                ))}
                            </ul>
                            {detailsData.repoDetails.yamlContent && (
                                <>
                                    <h3>YAML Content</h3>
                                    <pre
                                        style={{
                                            background: "#222",
                                            color: "#0f0",
                                            padding: "10px",
                                            borderRadius: "5px",
                                            overflowX: "auto",
                                        }}
                                    >
                    {detailsData.repoDetails.yamlContent}
                  </pre>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
export { REPOS_QUERY, REPO_DETAILS_QUERY };
