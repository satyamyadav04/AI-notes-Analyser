import api from "./api";

const generateSummary = (documentId) => api.post("/ai/summary", { documentId });
const generateKeypoints = (documentId) => api.post("/ai/keypoints", { documentId });
const generateMcqs = (documentId, count) => api.post("/ai/mcq", { documentId, count });
const generateFlashcards = (documentId) => api.post("/ai/flashcards", { documentId });
const generateInterview = (documentId) => api.post("/ai/interview", { documentId });
const generateDifficulty = (documentId) => api.post("/ai/difficulty", { documentId });
const chatWithNotes = (documentId, question) => api.post("/ai/chat", { documentId, question });

export {
  generateSummary,
  generateKeypoints,
  generateMcqs,
  generateFlashcards,
  generateInterview,
  generateDifficulty,
  chatWithNotes,
};
