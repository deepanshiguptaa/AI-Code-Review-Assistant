import express from "express";
import axios from "axios";
import { reviewCode } from "../services/ai.review.service.js";

const router = express.Router();

router.post("/webhook", async (req, res) => {

    const event = req.headers["x-github-event"];
    console.log("Event received:", event);

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

<<<<<<< HEAD
        /* ---------------- FETCH PR FILES ---------------- */
=======
        /* ---------- FETCH PR FILES ---------- */
>>>>>>> 467dda32c02ec7928dfa0fc1fd8cfb9d68a84064

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
<<<<<<< HEAD
        let fileList = [];
=======
        const fileList = [];
>>>>>>> 467dda32c02ec7928dfa0fc1fd8cfb9d68a84064

        files.forEach(file => {

            fileList.push(file.filename);

            if (file.patch) {
                diff += `\nFile: ${file.filename}\n${file.patch}\n`;
            }

        });

        console.log("Files analyzed:", fileList);

        if (!diff) {
<<<<<<< HEAD
            return res.status(200).send("No code diff");
        }

        /* ---------------- RUN AI REVIEW ---------------- */

        const aiResult = await reviewCode(diff);
=======
            return res.status(200).send("No diff to review");
        }

        /* ---------- RUN AI REVIEW ---------- */

        let aiResult;

        try {
            aiResult = await reviewCode(diff);
        } catch (err) {

            console.log("AI review failed, using fallback");

            aiResult = JSON.stringify({
                summary: "AI review temporarily unavailable.",
                issues: []
            });

        }
>>>>>>> 467dda32c02ec7928dfa0fc1fd8cfb9d68a84064

        let parsed;

        try {
            parsed = JSON.parse(aiResult);
        } catch {
<<<<<<< HEAD
=======

>>>>>>> 467dda32c02ec7928dfa0fc1fd8cfb9d68a84064
            parsed = {
                summary: aiResult,
                issues: []
            };
<<<<<<< HEAD
        }

        /* ---------------- CALCULATE RISK ---------------- */
=======

        }

        /* ---------- CALCULATE RISK ---------- */
>>>>>>> 467dda32c02ec7928dfa0fc1fd8cfb9d68a84064

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
<<<<<<< HEAD
        }
        else if (riskScore > 40) {
=======
        } else if (riskScore > 40) {
>>>>>>> 467dda32c02ec7928dfa0fc1fd8cfb9d68a84064
            riskEmoji = "🟠";
            riskLabel = "Medium Risk";
        }

<<<<<<< HEAD
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
=======
        /* ---------- FORMAT ISSUES ---------- */

        let issuesFormatted = "✅ No major issues detected.";

        if (parsed.issues.length > 0) {

            issuesFormatted = parsed.issues.map(issue => {

                const icon =
                    issue.severity === "High" ? "🔴" :
                    issue.severity === "Medium" ? "🟠" :
                    "🟢";

                return `
${icon} **${issue.type}** (${issue.severity})

📄 File: \`${issue.file}\`

⚠️ ${issue.message}

💡 Suggestion: ${issue.suggestion}
`;

            }).join("\n");

        }

        /* ---------- BUILD COMMENT ---------- */

        const comment = `
# 🤖 AI Code Review Report
>>>>>>> 467dda32c02ec7928dfa0fc1fd8cfb9d68a84064

### ${riskEmoji} Risk Score: **${riskScore}% — ${riskLabel}**

---

## 📂 Files Analyzed

${fileList.map(f => `• ${f}`).join("\n")}

---

## 🧠 AI Summary

<<<<<<< HEAD
${parsed.summary}
=======
${summary}
>>>>>>> 467dda32c02ec7928dfa0fc1fd8cfb9d68a84064

---

## ⚠️ Issues Detected

<<<<<<< HEAD
${issuesFormatted || "✅ No major issues detected."}
=======
${issuesFormatted}
>>>>>>> 467dda32c02ec7928dfa0fc1fd8cfb9d68a84064

---

## 📊 Issue Breakdown

| Severity | Count |
<<<<<<< HEAD
|--------|--------|
=======
|----------|-------|
>>>>>>> 467dda32c02ec7928dfa0fc1fd8cfb9d68a84064
| 🔴 High | ${high} |
| 🟠 Medium | ${medium} |
| 🟢 Low | ${low} |

---

<<<<<<< HEAD
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
=======
## 💡 Recommendation

${riskScore > 60
        ? "⚠️ Review carefully before merging."
        : "✅ Safe to merge with minor improvements."}

---

*Generated automatically by **AI Code Review Assistant***
`;

        /* ---------- POST COMMENT ---------- */

        await axios.post(
        `https://api.github.com/repos/${owner}/${repo}/statuses/${req.body.pull_request.head.sha}`,
        {
            state: riskScore > 60 ? "failure" : "success",
            context: "AI Code Review",
            description: `Risk score ${riskScore}%`,
        },
        {
            headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            },
        }
>>>>>>> 467dda32c02ec7928dfa0fc1fd8cfb9d68a84064
        );

        console.log("✅ AI review posted to PR");

    } catch (error) {

        console.error(
<<<<<<< HEAD
            "Webhook error:",
=======
            "❌ Webhook error:",
>>>>>>> 467dda32c02ec7928dfa0fc1fd8cfb9d68a84064
            error.response?.data || error.message
        );

    }

    res.status(200).send("Webhook processed");
<<<<<<< HEAD
=======

>>>>>>> 467dda32c02ec7928dfa0fc1fd8cfb9d68a84064
});

export default router;