
export default function resolveToken(tokenArg, req) {
    return tokenArg || req.headers["x-github-token"] || process.env.GITHUB_TOKEN;
}
