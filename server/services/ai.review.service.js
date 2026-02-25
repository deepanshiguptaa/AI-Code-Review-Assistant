import Groq from "groq-sdk";
import { splitDiffIntoChunks } from "../utils/chunkDiff.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const reviewCode = async (diff) => {

    const chunks = splitDiffIntoChunks(diff);

    let allIssues = [];
    let summaries = [];

    for (const chunk of chunks) {

        const prompt = `
You are an automated code review system.

Analyze the following git diff and return STRICT JSON.

Format:
{
  "summary": "short overall review",
  "issues": [
    {
      "type": "Bug | Security | Performance | Style",
      "severity": "Low | Medium | High",
      "file": "filename",
      "message": "what is wrong",
      "suggestion": "how to fix"
    }
  ]
}

Rules:
- Output ONLY JSON
- No explanations
- No markdown
- No extra text

Diff:
${chunk}
`;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a strict JSON code reviewer." },
                { role: "user", content: prompt }
            ],
            temperature: 0.1,
        });

        let parsed;

        try {
            parsed = JSON.parse(response.choices[0].message.content);
            if (parsed.summary) summaries.push(parsed.summary);
            if (parsed.issues) allIssues.push(...parsed.issues);
        } catch (err) {
            console.log("JSON parse failed for chunk");
            continue;
        }
    }

    return {
        summary: summaries.join(" "),
        issues: allIssues
    };
};
