import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/webhook", async (req, res) => {
    const event = req.headers["x-github-event"];

    if (event === "pull_request") {
        const action = req.body.action;

        if (action === "opened" || action === "synchronize") {

            const prNumber = req.body.pull_request.number;
            const repo = req.body.repository.name;
            const owner = req.body.repository.owner.login;

            console.log("🚀 Reviewing PR:", prNumber);

            try {
                const filesResponse = await axios.get(
                    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
                        }
                    }
                );

                const files = filesResponse.data;

                console.log("Changed Files:");
                files.forEach(file => {
                    console.log("File:", file.filename);
                });

            } catch (error) {
                console.error("Error fetching PR files:", error.message);
            }
        }
    }

    res.status(200).send("OK");
});

export default router;