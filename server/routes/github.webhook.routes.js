import express from "express";
import axios from "axios";
import { reviewCode } from "../services/ai.review.service.js";

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

                // 1️⃣ Fetch PR files
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

                // 2️⃣ Collect DIFF
                let fullDiff = "";

                files.forEach(file => {

                    console.log("File:", file.filename);

                    if (file.patch) {
                        fullDiff += `\nFile: ${file.filename}\n${file.patch}\n`;
                    }

                });

                if (!fullDiff) {
                    console.log("No diff found");
                    return res.status(200).send("No diff");
                }

                // 3️⃣ Send diff to AI
                console.log("Sending diff to AI...");

                const aiReview = await reviewCode(fullDiff);

                console.log("AI Review Generated");

                // 4️⃣ Post AI comment to PR
                await axios.post(
                    `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`,
                    {
                        body: `## 🤖 AI Code Review\n\n${aiReview}`
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