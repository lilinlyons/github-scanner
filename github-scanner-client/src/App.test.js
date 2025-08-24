import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { gql } from "@apollo/client";
import App from "./App";

// === Queries (same as in App.js) ===
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

// === Mocks ===
const mocks = [
  {
    request: { query: REPOS_QUERY },
    result: {
      data: {
        listRepositories: {
          nodes: [
            { name: "repoC", size: 29936, owner: "lilinlyons" },
            { name: "repoB", size: 29936, owner: "lilinlyons" },
            { name: "repoA", size: 29936, owner: "lilinlyons" },
          ],
        },
      },
    },
  },
  {
    request: {
      query: REPO_DETAILS_QUERY,
      variables: { owner: "lilinlyons", name: "repoA" },
    },
    result: {
      data: {
        repoDetails: {
          name: "repoA",
          size: 29936,
          owner: "lilinlyons",
          isPrivate: false,
          fileCount: 823,
          yamlContent: `name: "CodeQL"`,
          webhooks: [
            {
              id: "565159020",
              url: "https://webhook.site/54709b5b-9191-4e4d-b702-b8b6b938f18e",
              active: true,
            },
          ],
        },
      },
    },
  },
];

// === Tests ===
test("renders repositories and loads details on click", async () => {
  render(
      <MockedProvider mocks={mocks} >
        <App />
      </MockedProvider>
  );

  // Repo list loads
  expect(await screen.findByText("repoA")).toBeInTheDocument();
  expect(screen.getByText("repoB")).toBeInTheDocument();
  expect(screen.getByText("repoC")).toBeInTheDocument();

  // Click repoA to load details
  fireEvent.click(screen.getByText("repoA"));

  // Verify details render, including File Count
  await waitFor(() => {
    expect(
        screen.getByText("File Count:", { exact: false }).parentElement
    ).toHaveTextContent("823");
  });


  // Verify YAML content shows up (from your mock)
  expect(await screen.findByText(/name:\s*"CodeQL"/)).toBeInTheDocument();

  // Verify webhook shows up
  expect(
      await screen.findByText(
          "https://webhook.site/54709b5b-9191-4e4d-b702-b8b6b938f18e",
          { exact: false }
      )
  ).toBeInTheDocument();

});


test("shows loading state initially", () => {
  render(
      <MockedProvider mocks={mocks}>
        <App />
      </MockedProvider>
  );
  expect(screen.getByText(/Loading repositories/i)).toBeInTheDocument();
});

test("handles GraphQL error", async () => {
  const errorMocks = [
    {
      request: { query: REPOS_QUERY },
      error: new Error("Something went wrong"),
    },
  ];

  render(
      <MockedProvider mocks={errorMocks}>
        <App />
      </MockedProvider>
  );

  expect(await screen.findByText(/Error:/i)).toBeInTheDocument();
});
