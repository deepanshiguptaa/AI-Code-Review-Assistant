import express from 'express';
import { getAiReview } from '../controllers/ai.review.controller.js';

const router = express.Router();

router.get('/review', getAiReview);

export default router;