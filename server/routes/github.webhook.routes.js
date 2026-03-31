import express from "express";
import axios from "axios";
import { reviewCode } from "../services/ai.review.service.js";

const router = express.Router();

import express from "express";
import axios from "axios";
import { reviewCode } from "../services/ai.review.service.js";

const router = express.Router();

router.post("/webhook", async (req, res) => {

    const event = req.headers["x-github-event"];

    if (event !== "pull_request") {
        return res.status(200).send("Ignored");
    }

    const action = req.body.action;

    if (action !== "opened" && action !== "synchronize") {
        return res.status(200).send("Not required");
    }

    const prNumber = req.body.pull_request.number;
    const repo = req.body.repository.name;
    const owner = req.body.repository.owner.login;

    console.log(`🚀 AI reviewing PR #${prNumber}`);

    try {

        /* ---------------- FETCH PR FILES ---------------- */

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

        let diff = "";
        let fileList = [];

        files.forEach(file => {

            fileList.push(file.filename);

            if (file.patch) {
                diff += `\nFile: ${file.filename}\n${file.patch}\n`;
            }

        });

        console.log("Files analyzed:", fileList);

        if (!diff) {
            return res.status(200).send("No code diff");
        }

        /* ---------------- RUN AI REVIEW ---------------- */

        const aiResult = await reviewCode(diff);

        let parsed;

        try {
            parsed = JSON.parse(aiResult);
        } catch {
            parsed = {
                summary: aiResult,
                issues: []
            };
        }

        /* ---------------- CALCULATE RISK ---------------- */

        const high = parsed.issues.filter(i => i.severity === "High").length;
        const medium = parsed.issues.filter(i => i.severity === "Medium").length;
        const low = parsed.issues.filter(i => i.severity === "Low").length;

        const riskScore = Math.min(
            100,
            Math.round((high * 5 + medium * 3 + low) * 4)
        );

        let riskEmoji = "🟢";
        let riskLabel = "Low Risk";

        if (riskScore > 70) {
            riskEmoji = "🔴";
            riskLabel = "High Risk";
        }
        else if (riskScore > 40) {
            riskEmoji = "🟠";
            riskLabel = "Medium Risk";
        }

        /* ---------------- BUILD COMMENT ---------------- */

        const issuesFormatted = parsed.issues.map(issue => {

            const icon =
                issue.severity === "High" ? "🔴" :
                issue.severity === "Medium" ? "🟠" :
                "🟢";

            return `
${icon} **${issue.type}** (${issue.severity})

File: \`${issue.file}\`

${issue.message}

Suggestion: ${issue.suggestion}
`;
        }).join("\n");

        const comment = `
# 🤖 AI Code Review

### ${riskEmoji} Risk Score: **${riskScore}% — ${riskLabel}**

---

## 📂 Files Analyzed

${fileList.map(f => `• ${f}`).join("\n")}

---

## 🧠 AI Summary

${parsed.summary}

---

## ⚠️ Issues Detected

${issuesFormatted || "✅ No major issues detected."}

---

## 📊 Issue Breakdown

| Severity | Count |
|--------|--------|
| 🔴 High | ${high} |
| 🟠 Medium | ${medium} |
| 🟢 Low | ${low} |

---

### 💡 Recommendation

${riskScore > 60
    ? "Review carefully before merging."
    : "Safe to merge with minor improvements."}

---

*Generated automatically by **AI Code Review Assistant***  
`;

        /* ---------------- POST COMMENT ---------------- */

        await axios.post(
            `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`,
            {
                body: comment
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json"
                }
            }
        );

        console.log("✅ AI review posted to PR");

    } catch (error) {

        console.error(
            "Webhook error:",
            error.response?.data || error.message
        );

    }

    res.status(200).send("Webhook processed");
});

export default router;