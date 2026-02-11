import { fetchCommits } from "../services/github.commit.service.js";

export const getCommits = async (req,res) => {
    try{
        const authHeader = req.headers.authorization;
        const {owner, repo} = req.query;
        if(!authHeader){
            return res.status(401).json({error:"Access token missing"});
        }
        if(!owner || !repo){
            return res.status(400).json({error:"Owner and repo are required"});
        }
        const accessToken = authHeader.split(" ")[1];
        const commits = await fetchCommits(accessToken, owner, repo);
        const formattedCommits = commits.map((commit) => ({
            sha: commit.sha,
            message: commit.commit.message,
            author: commit.commit.author?.name,
            date: commit.commit.author?.date
        }));
        res.json(formattedCommits);
    } catch(error){
        console.error(error);
        res.status(500).json({error:"Failed to fetch commits"});
    }
};