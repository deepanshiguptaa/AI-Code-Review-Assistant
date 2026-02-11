import express from 'express';
import { getCommits } from '../controllers/github.commit.controller.js';

const router = express.Router();
router.get("/commits", getCommits);

export default router;
