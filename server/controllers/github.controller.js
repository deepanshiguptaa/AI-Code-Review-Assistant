import { getGithubAccessToken } from '../services/github.service.js';

export const githubLogin = (req, res) =>{
    const githubAuthUrl = 
        `https://github.com/login/oauth/authorize?`+
        `client_id=${process.env.GITHUB_CLIENT_ID}`+
        `&scope=repo`;
    res.redirect(githubAuthUrl);
};

export const githubCallback = async (req, res) => {
    try{
        const { code } = req.query;
        if(!code){
            return res.status(400).json({ message: "Code not found" });
        }
        const accessToken = await getGithubAccessToken(code);
        res.json({
            message: "GitHub login successful",
            accessToken
        });
    } 
    catch (error) {
        console.error("GitHub login error:", error);
        res.status(500).json({ message: "OAuth failed" });
    }
};