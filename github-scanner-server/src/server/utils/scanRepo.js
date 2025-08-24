
import { repoDetails } from "../services/githubService.js";

let active = 0; // track concurrent scans

export async function scanRepo({ owner, name, token }) {
    active++;
    console.log(`[${new Date().toISOString()}] START scan ${owner}/${name} → active=${active}`);

    try {
        // call your service, not resolver
        const repo = await repoDetails(owner, name, token);
        return repo;
    } finally {
        active--;
        console.log(`[${new Date().toISOString()}] END   scan ${owner}/${name} → active=${active}`);
    }
}
