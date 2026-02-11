import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import githubRoutes from './routes/github.routes.js';
import githubRepoRoutes from './routes/github.repo.routes.js';
import githubCOmmitRoutes from './routes/github.commit.routes.js';
import githubDiffRoutes from './routes/github.diff.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth/github', githubRoutes);
app.use('/github', githubRepoRoutes);
app.use('/commit', githubCOmmitRoutes);
app.use('/diff', githubDiffRoutes);
app.get("/", (req, res) => {
    res.send("AI Code Review Server is Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

