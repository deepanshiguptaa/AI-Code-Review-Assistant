import axios from "axios";

export const fetchUserRepos = async (accessToken) => {
    const response = await axios.get("https://api.github.com/user/repos", {
        headers : {
            Authorization : `Bearer ${accessToken}`,
            Accept : "application/vnd.github.v3+json"
        }
    });

    return response.data;
};