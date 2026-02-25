import { fetchCommitDiff } from "../services/github.diff.service.js";
import { reviewCode } from "../services/ai.review.service.js";
import Review from "../models/review.model.js";

export const getAiReview = async (req, res) => {
    const { owner, repo, sha } = req.query;
    try {
        const authHeader = req.headers.authorization;
        

        // 1️⃣ CHECK CACHE FIRST
        const existing = await Review.findOne({ owner, repo, sha });

        if (existing) {
            console.log("Returned from cache");
            return res.json(existing.review);
        }

        const accessToken = authHeader.split(" ")[1];

        const files = await fetchCommitDiff(accessToken, owner, repo, sha);

        const fullDiff = files
            .filter(f => f.patch)
            .map(f => `File: ${f.filename}\n${f.patch}`)
            .join("\n\n");

        const review = await reviewCode(fullDiff);

        // 2️⃣ SAVE RESULT
        await Review.create({ owner, repo, sha, review });

        res.json(review);

    } 
    catch (err) {

        // If AI quota exceeded
        if (err.status === 429 || err.code === "rate_limit_exceeded") {

            const fallback = {
                summary: "AI review temporarily unavailable due to API limit. Cached placeholder created.",
                issues: [
                    {
                        type: "Info",
                        severity: "Low",
                        file: "system",
                        message: "Rate limit reached — review deferred",
                        suggestion: "Retry later. System prevented repeated API usage."
                    }
                ]
            };

            // save fallback so next request won't call AI again
            await Review.create({ owner, repo, sha, review: fallback });

            return res.json(fallback);
        }

        console.error(err);
        res.status(500).json({ error: "AI review failed" });
    }

};
