import express from 'express';
import { getCommitDiff } from '../controllers/github.diff.controller.js';

const router = express.Router();

router.get('/commit-diff', getCommitDiff);

export default router;