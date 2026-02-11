import express from 'express';
import { getUserRepo } from '../controllers/github.repo.controller.js';

const router = express.Router();

router.get('/repos', getUserRepo);

export default router;  