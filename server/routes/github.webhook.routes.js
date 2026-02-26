import express from "express";

const router = express.Router();

router.post("/webhook", async (req, res) => {
    const event = req.headers["x-github-event"];

    if (event === "pull_request") {
        const action = req.body.action;
        const prNumber = req.body.pull_request?.number;
        const repo = req.body.repository?.name;
        const owner = req.body.repository?.owner?.login;

        console.log("🚀 PR Event Detected");
        console.log("Action:", action);
        console.log("Repo:", repo);
        console.log("PR Number:", prNumber);

        if (action === "opened" || action === "synchronize") {
            console.log("🔥 Ready to review this PR");
        }
    }

    res.status(200).send("OK");
});

export default router;