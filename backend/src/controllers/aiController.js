import asyncHandler from "express-async-handler";

import Analysis from "../models/Analysis.js";
import Chat from "../models/Chat.js";
import Document from "../models/Document.js";
import { generateStructuredContent } from "../services/geminiService.js";
import { answerQuestionFromNotes } from "../services/ragService.js";

const getOwnedDocument = async (userId, documentId) => {
  const documentRecord = await Document.findOne({ _id: documentId, userId });
  if (!documentRecord) {
    const error = new Error("Document not found.");
    error.statusCode = 404;
    throw error;
  }

  return documentRecord;
};

const saveAnalysis = async ({ userId, documentId, type, payload }) =>
  Analysis.create({ userId, documentId, type, payload });

const updateAnalytics = async (documentId, changes) => {
  await Document.findByIdAndUpdate(documentId, { $inc: changes });
};

const generateSummary = asyncHandler(async (req, res) => {
  const { documentId } = req.body;
  const documentRecord = await getOwnedDocument(req.user._id, documentId);

  const summary = await generateStructuredContent({
    task: "Create a short summary, detailed summary, and chapter-wise summary.",
    notesContent: documentRecord.extractedText,
    outputSpec: `Return valid JSON with keys:
{
  "shortSummary": "string",
  "detailedSummary": "string",
  "chapterWiseSummary": [{"chapter":"string","summary":"string"}]
}`,
  });

  const analysis = await saveAnalysis({
    userId: req.user._id,
    documentId,
    type: "summary",
    payload: summary,
  });

  await updateAnalytics(documentId, { "analytics.summariesGenerated": 1 });
  res.json({ analysis });
});

const generateKeyPoints = asyncHandler(async (req, res) => {
  const { documentId } = req.body;
  const documentRecord = await getOwnedDocument(req.user._id, documentId);

  const keypoints = await generateStructuredContent({
    task: "Extract top important points, definitions, and formulas from the notes.",
    notesContent: documentRecord.extractedText,
    outputSpec: `Return valid JSON with keys:
{
  "topPoints": ["string"],
  "definitions": [{"term":"string","meaning":"string"}],
  "formulas": [{"name":"string","formula":"string","explanation":"string"}]
}`,
  });

  const analysis = await saveAnalysis({
    userId: req.user._id,
    documentId,
    type: "keypoints",
    payload: keypoints,
  });

  res.json({ analysis });
});

const generateMcqs = asyncHandler(async (req, res) => {
  const { documentId, count = 10 } = req.body;
  const documentRecord = await getOwnedDocument(req.user._id, documentId);

  const mcqs = await generateStructuredContent({
    task: `Generate ${count} MCQs with answers and explanations.`,
    notesContent: documentRecord.extractedText,
    outputSpec: `Return valid JSON:
{
  "mcqs": [
    {
      "question":"string",
      "options":["A","B","C","D"],
      "answer":"string",
      "explanation":"string"
    }
  ]
}`,
  });

  const analysis = await saveAnalysis({
    userId: req.user._id,
    documentId,
    type: "mcq",
    payload: mcqs,
  });

  await updateAnalytics(documentId, { "analytics.mcqsGenerated": 1 });
  res.json({ analysis });
});

const generateFlashcards = asyncHandler(async (req, res) => {
  const { documentId } = req.body;
  const documentRecord = await getOwnedDocument(req.user._id, documentId);

  const flashcards = await generateStructuredContent({
    task: "Generate concise flashcards from the notes.",
    notesContent: documentRecord.extractedText,
    outputSpec: `Return valid JSON:
{
  "flashcards": [
    {
      "question":"string",
      "answer":"string"
    }
  ]
}`,
  });

  const analysis = await saveAnalysis({
    userId: req.user._id,
    documentId,
    type: "flashcards",
    payload: flashcards,
  });

  await updateAnalytics(documentId, { "analytics.flashcardsGenerated": 1 });
  res.json({ analysis });
});

const generateInterviewQuestions = asyncHandler(async (req, res) => {
  const { documentId } = req.body;
  const documentRecord = await getOwnedDocument(req.user._id, documentId);

  const interview = await generateStructuredContent({
    task: "Generate beginner, intermediate, and advanced interview questions with answers.",
    notesContent: documentRecord.extractedText,
    outputSpec: `Return valid JSON:
{
  "beginner": [{"question":"string","answer":"string"}],
  "intermediate": [{"question":"string","answer":"string"}],
  "advanced": [{"question":"string","answer":"string"}]
}`,
  });

  const analysis = await saveAnalysis({
    userId: req.user._id,
    documentId,
    type: "interview",
    payload: interview,
  });

  res.json({ analysis });
});

const generateDifficultyAnalysis = asyncHandler(async (req, res) => {
  const { documentId } = req.body;
  const documentRecord = await getOwnedDocument(req.user._id, documentId);

  const difficulty = await generateStructuredContent({
    task: "Categorize the major topics into beginner, intermediate, and advanced difficulty.",
    notesContent: documentRecord.extractedText,
    outputSpec: `Return valid JSON:
{
  "beginner":["string"],
  "intermediate":["string"],
  "advanced":["string"]
}`,
  });

  const analysis = await saveAnalysis({
    userId: req.user._id,
    documentId,
    type: "difficulty",
    payload: difficulty,
  });

  res.json({ analysis });
});

const chatWithNotes = asyncHandler(async (req, res) => {
  const { documentId, question } = req.body;
  const documentRecord = await getOwnedDocument(req.user._id, documentId);
  const result = await answerQuestionFromNotes({ documentRecord, question });

  const chat = await Chat.create({
    userId: req.user._id,
    documentId,
    question,
    answer: result.answer,
    citations: result.citations,
  });

  await updateAnalytics(documentId, { "analytics.chatsCount": 1 });
  res.json({ chat });
});

export {
  generateSummary,
  generateKeyPoints,
  generateMcqs,
  generateFlashcards,
  generateInterviewQuestions,
  generateDifficultyAnalysis,
  chatWithNotes,
};
