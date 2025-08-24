# GitHub Scanner

GitHub Scanner is a simple full-stack application built with:
- **Backend**: Apollo GraphQL Server (Node.js)
- **Frontend**: React + Apollo Client
- **Testing**: Jest + React Testing Library

The app lists GitHub repositories for a given user and lets you view details (size, owner, privacy, file count, webhooks, YAML config).

---

##  Project Structure

```
github-scanner/
│
├── github-scanner-server/   # Backend (GraphQL server)
│   ├── src/
│   ├── package.json
│
├── github-scanner-client/   # Frontend (React app)
│   ├── src/
│   ├── public/
│   ├── package.json
│
└── README.md
```

##   Running the App

You do **not** need Git to run this project.  
Just unzip the folder, open a terminal in each part (server & client), install dependencies, and run.
I added a limiter so only maximum 2 repos could be scanned in parallel.

---

### 1. Start the Backend (GraphQL Server)

```bash
cd github-scanner-server
npm install
npm start

```
This starts the Apollo Server at [http://localhost:4000/graphql](http://localhost:4000/graphql)

---

### 2. Start the Frontend (React Client)

Open a new terminal:

```bash
cd github-scanner-client
npm install
npm start
```

This starts the React app at http://localhost:3000


The frontend talks to the backend at http://localhost:4000/graphql


## Running Tests

Both the frontend and backend include tests.

Backend Tests
cd github-scanner-server
npm test

Frontend Tests
cd github-scanner-client
npm test


Tests use Jest and @testing-library/react with Apollo’s MockedProvider.
They check that repositories are listed and repository details load on click.

## Scripts

Each project (server and client) has its own package.json with these scripts:

Backend (github-scanner-server/package.json)

```bash

npm start → start Apollo GraphQL server
npm test → run backend tests
```

Frontend (github-scanner-client/package.json)

```bash
npm start → start React dev server

npm test → run frontend tests (watch mode)

npm run build → build for production
```

## Notes

Requires Node.js 18+ and npm installed.

Do not include node_modules when sharing the project — the recipient will recreate them with npm install.

If you want to distribute, just zip the folder with:

github-scanner-server/

github-scanner-c