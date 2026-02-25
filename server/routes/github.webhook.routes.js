import express from "express";

const router = express.Router();

router.post("/webhook", (req, res) => {
    console.log("📩 Webhook received!");
    console.log("Event:", req.headers["x-github-event"]);
    console.log("Action:", req.body.action);
    console.log("Repository:", req.body.repository?.full_name);

    res.status(200).json({ message: "Webhook received successfully" });
});

export default router;