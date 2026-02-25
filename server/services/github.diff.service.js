import axios from "axios";

export const fetchCommitDiff = async (accessToken, owner, repo, commitSha) => {
  const response = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json"
      }
    }
  );

  return response.data.files;
};
