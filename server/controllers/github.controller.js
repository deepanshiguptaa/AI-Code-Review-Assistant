import { getGithubAccessToken } from '../services/github.service.js';

export const githubLogin = (req, res) =>{
    const githubAuthUrl = 
        `https://github.com/login/oauth/authorize?`+
        `client_id=${process.env.GITHUB_CLIENT_ID}`+
        `&scope=repo`;
    res.redirect(githubAuthUrl);
};

export const githubCallback = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).send("Code not found");
        }

        const accessToken = await getGithubAccessToken(code);
        const FRONTEND_URL = process.env.FRONTEND_URL;

        // redirect to frontend with token
        res.redirect(`${FRONTEND_URL}/repos?token=${accessToken}`);

    } catch (error) {
        console.error("GitHub login error:", error);
        res.status(500).send("OAuth failed");
    }
};
