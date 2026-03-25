import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/webhook", async (req, res) => {

  const event = req.headers["x-github-event"];
  console.log("GitHub Event:", event);

  try {

    /* ---------------- PUSH EVENT ---------------- */

    if (event === "push") {

      const repo = req.body.repository.name;
      const owner = req.body.repository.owner.name || req.body.repository.owner.login;

      console.log(`Push detected in ${owner}/${repo}`);

      const commits = req.body.commits || [];

      commits.forEach(commit => {
        console.log("Commit:", commit.message);
      });

    }

    /* ---------------- PULL REQUEST EVENT ---------------- */

    if (event === "pull_request") {

      const action = req.body.action;
      console.log("PR Action:", action);

      if (action === "opened" || action === "synchronize") {

        const prNumber = req.body.pull_request.number;
        const repo = req.body.repository.name;
        const owner = req.body.repository.owner.login;

        console.log("🚀 Reviewing PR:", prNumber);

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

        files.forEach(file => {
          console.log("File:", file.filename);
        });

      }

    }

  } catch (error) {

    console.error("Webhook error:", error.message);

  }

  res.status(200).send("Webhook received");

});

export default router;