import { fetchUserRepos } from "../services/github.repo.service.js";

export const getUserRepo = async (req, res) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({ message: "Authorization token missing" });
        }
        const accessToken = authHeader.split(" ")[1];
        const repos = await fetchUserRepos(accessToken);

        const formattedRepos = repos.map((repo) => ({
            id : repo.id,
            name : repo.name,
            full_name : repo.full_name,
            private : repo.private,
            owner : repo.owner.login
        }));
        res.json(formattedRepos);
    } catch(error){
        console.error(error);
        res.status(500).json({ message: "Error fetching user repositories" });
    } 
};