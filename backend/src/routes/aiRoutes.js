import express from "express";

import protect from "../middleware/authMiddleware.js";
import {
  chatWithNotes,
  generateDifficultyAnalysis,
  generateFlashcards,
  generateInterviewQuestions,
  generateKeyPoints,
  generateMcqs,
  generateSummary,
} from "../controllers/aiController.js";

const router = express.Router();

router.use(protect);
router.post("/summary", generateSummary);
router.post("/keypoints", generateKeyPoints);
router.post("/mcq", generateMcqs);
router.post("/flashcards", generateFlashcards);
router.post("/interview", generateInterviewQuestions);
router.post("/difficulty", generateDifficultyAnalysis);
router.post("/chat", chatWithNotes);

export default router;
