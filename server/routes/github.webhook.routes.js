import express from "express";
import axios from "axios";
import { reviewCode } from "../services/ai.review.service.js";

const router = express.Router();

router.post("/webhook", async (req, res) => {

  const event = req.headers["x-github-event"];
  console.log("GitHub Event:", event);

  try {

    if (event !== "pull_request") {
      return res.status(200).send("Not a PR event");
    }

    const action = req.body.action;

    if (!["opened", "synchronize"].includes(action)) {
      return res.status(200).send("Ignored action");
    }

    const prNumber = req.body.pull_request.number;
    const repo = req.body.repository.name;
    const owner = req.body.repository.owner.login;

    console.log(`🚀 Reviewing PR #${prNumber} in ${owner}/${repo}`);

    /* ---------------- FETCH CHANGED FILES ---------------- */

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

    let combinedDiff = "";

    files.forEach(file => {

      console.log("File:", file.filename);

      if (file.patch) {
        combinedDiff += `\nFile: ${file.filename}\n${file.patch}\n`;
      }

    });

    /* ---------------- RUN AI REVIEW ---------------- */

    const aiReview = await reviewCode(combinedDiff);

    console.log("AI Review Generated");

    /* ---------------- POST COMMENT ON PR ---------------- */

    await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`,
      {
        body: `🤖 **AI Code Review**

${aiReview}`
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

    console.error("Webhook error:", error.response?.data || error.message);

  }

  res.status(200).send("Webhook received");
  console.log("testing webhook");
});

export default router;