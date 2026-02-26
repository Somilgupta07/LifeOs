import express from 'express';
import {
  chatWithAI,
  getProductivityInsights,
  parseNaturalLanguage
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/chat', protect, chatWithAI);
router.post('/insights', protect, getProductivityInsights);
router.post('/parse', protect, parseNaturalLanguage);

export default router;
