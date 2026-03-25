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

                // 1️⃣ Get changed files
                const filesResponse = await axios.get(
                    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                            Accept: "application/vnd.github+json"
                        }
                    }
                );

                const files = filesResponse.data;

                console.log("Changed Files:");

                let fileList = "";

                files.forEach(file => {
                    console.log("File:", file.filename);
                    fileList += `• ${file.filename}\n`;
                });

                // 2️⃣ Fake AI review for now
                const aiReview = `
🤖 **AI Code Review**

Files changed:
${fileList}

Potential checks:
• Code quality  
• Security issues  
• Performance problems  

Recommendation:
Review the changes before merging.
`;

                // 3️⃣ Post comment on PR
                await axios.post(
                    `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`,
                    {
                        body: aiReview
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                            Accept: "application/vnd.github+json"
                        }
                    }
                );

                console.log("✅ Review posted to GitHub PR");

            } catch (error) {

                console.error(
                    "Webhook error:",
                    error.response?.data || error.message
                );
            }
        }
    }

    res.status(200).send("Webhook received");
});

export default router;