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
        const allowedExtensions = [
            ".js", ".ts", ".jsx", ".tsx",
            ".py", ".java", ".cpp", ".c", ".cs", ".go"
        ];
           
        const ignoredPaths = [
            "node_modules",
            "package-lock.json",
            "yarn.lock",
            "dist/",
            "build/",
            ".env"
        ];

        const formatted = files
            .filter(file => file.patch)
            .filter(file => {
                if (ignoredPaths.some(path => file.filename.includes(path))) return false;
                return allowedExtensions.some(ext => file.filename.endsWith(ext));
            })
            .map(file => ({
                filename: file.filename,
                changes: file.patch
            }));
            res.json(formatted);
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Failed to fetch commit diff"});
    }
}
