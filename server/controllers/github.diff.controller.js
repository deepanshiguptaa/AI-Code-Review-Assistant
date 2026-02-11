import { fetchCommitDiff } from "../services/github.diff.service.js";

export const getCommitDiff = async (req, res) => {
    try{
        const authHeader = req.headers.authorization;
        const {owner, repo, sha} = req.query;
        if(!authHeader){
            return res.status(401).json({error:"Access token missing"});
        }
        if(!owner || !repo || !sha){
            return res.status(400).json({error:"Owner, repo and sha are required"});
        }
        const accessToken = authHeader.split(" ")[1];
        const files = await fetchCommitDiff(accessToken, owner, repo, sha);
        const formatted = files
            .filter((file) => file.patch)
            .map((file) => ({
                filename : file.filename,
                changes: file.patch
            }))
            res.json(formatted);
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Failed to fetch commit diff"});
    }
}
