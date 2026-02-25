import './config/env.js';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import express from 'express';
import cors from 'cors';

import { connectDB } from './config/db.js';
import githubRoutes from './routes/github.routes.js';
import githubRepoRoutes from './routes/github.repo.routes.js';
import githubCommitRoutes from './routes/github.commit.routes.js';
import githubDiffRoutes from './routes/github.diff.routes.js';
import aiReviewRoutes from './routes/ai.review.routes.js';

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// OAuth
app.use('/auth/github', githubRoutes);

// All GitHub APIs grouped
app.use('/github', githubRepoRoutes);
app.use('/github', githubCommitRoutes);
app.use('/github', githubDiffRoutes);
app.use('/ai', aiReviewRoutes);

app.get("/", (req, res) => {
    res.send("AI Code Review Server is Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
