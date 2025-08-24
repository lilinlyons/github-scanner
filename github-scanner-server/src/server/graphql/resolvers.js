import  resolveToken  from "../utils/resolveToken.js";
import { listRepositories, repoDetails } from "../services/githubService.js";
import { scanRepo } from "../utils/scanRepo.js";


const resolvers = {
    Query: {
        listRepositories: async (_, args, ctx) => {
            const { owner, first, after, token: tokenArg } = args;
            const token = resolveToken(tokenArg, ctx.req, ctx.token);
            return listRepositories(owner, first, after, token, scanRepo);
        },
        repoDetails: async (_, { owner, name, token: tokenArg }, ctx) => {
            const token = resolveToken(tokenArg, ctx.req, ctx.token);
            return repoDetails(owner, name, token);
        }
    }
};
export default resolvers;
