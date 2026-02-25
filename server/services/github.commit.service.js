import axios from "axios";

export const fetchCommits = async (accessToken, owner, repo) => {
    const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/commits`,
        {
            headers:{
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github+json"
            }
        }
    );
    return response.data;
};

