import fs from "fs/promises";
import path from "path";

import asyncHandler from "express-async-handler";

import Analysis from "../models/Analysis.js";
import Chat from "../models/Chat.js";
import Document from "../models/Document.js";
import { deleteDocumentVectors, indexDocumentChunks, semanticSearch } from "../services/ragService.js";
import chunkText from "../utils/chunkText.js";
import { extractTextFromFile } from "../utils/extractText.js";
import pdfParse from "pdf-parse";
const buildFileUrl = (filename) => `/${process.env.UPLOAD_DIR || "uploads"}/${filename}`;

const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("A file upload is required.");
  }

  const extension = path.extname(req.file.originalname).replace(".", "").toLowerCase();
  let extractedText;

  if (extension === "pdf") {
    const pdfData = await pdfParse(await fs.readFile(req.file.path));
    extractedText = pdfData.text;
  } else {
    extractedText = await extractTextFromFile(req.file.path, extension);
  }

  if (!extractedText) {
    res.status(400);
    throw new Error("No readable text could be extracted from the file.");
  }

  const chunks = chunkText(extractedText, 1000, 200);
  const documentRecord = await Document.create({
    userId: req.user._id,
    title: req.body.title || req.file.originalname.replace(path.extname(req.file.originalname), ""),
    originalFileName: req.file.originalname,
    fileUrl: buildFileUrl(req.file.filename),
    fileType: extension,
    fileSize: req.file.size,
    extractedText,
    chunks,
    chunkCount: chunks.length,
  });

  await indexDocumentChunks(documentRecord);

  res.status(201).json({
    message: "Document uploaded and indexed successfully.",
    document: documentRecord,
  });
});

const getDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({ userId: req.user._id }).sort({ uploadedAt: -1 });
  res.json({ documents });
});

const getDocumentById = asyncHandler(async (req, res) => {
  const documentRecord = await Document.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!documentRecord) {
    res.status(404);
    throw new Error("Document not found.");
  }

  const [analyses, chats] = await Promise.all([
    Analysis.find({ userId: req.user._id, documentId: req.params.id }).sort({ createdAt: -1 }).limit(20),
    Chat.find({ userId: req.user._id, documentId: req.params.id }).sort({ timestamp: -1 }).limit(20),
  ]);

  res.json({
    document: documentRecord,
    analyses,
    chats,
  });
});

const deleteDocument = asyncHandler(async (req, res) => {
  const documentRecord = await Document.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!documentRecord) {
    res.status(404);
    throw new Error("Document not found.");
  }

  await Promise.all([
    deleteDocumentVectors(documentRecord),
    Analysis.deleteMany({ documentId: documentRecord._id }),
    Chat.deleteMany({ documentId: documentRecord._id }),
    fs.unlink(path.resolve(process.cwd(), documentRecord.fileUrl.replace(/^\//, ""))).catch(() => null),
    documentRecord.deleteOne(),
  ]);

  res.json({ message: "Document deleted successfully." });
});

const searchDocuments = asyncHandler(async (req, res) => {
  const { q = "", documentId } = req.query;

  if (!q.trim()) {
    res.status(400);
    throw new Error("Search query is required.");
  }

  const filters = { userId: req.user._id };
  if (documentId) {
    filters._id = documentId;
  }

  const documents = await Document.find(filters).select("title extractedText chunks");

  const keywordResults = documents
    .filter((doc) => doc.extractedText.toLowerCase().includes(q.toLowerCase()))
    .map((doc) => ({
      documentId: doc._id,
      title: doc.title,
      type: "keyword",
      excerpt: doc.extractedText.slice(
        Math.max(0, doc.extractedText.toLowerCase().indexOf(q.toLowerCase()) - 120),
        Math.max(400, doc.extractedText.toLowerCase().indexOf(q.toLowerCase()) + 280),
      ),
    }));

  let semanticResults = [];
  if (documentId) {
    semanticResults = await semanticSearch({
      documentId: documentId.toString(),
      query: q,
      limit: 5,
    });
  }

  res.json({
    keywordResults,
    semanticResults,
  });
});

export { uploadDocument, getDocuments, getDocumentById, deleteDocument, searchDocuments };


//new one 

// import fs from "fs/promises";
// import path from "path";

// import asyncHandler from "express-async-handler";

// import Analysis from "../models/Analysis.js";
// import Chat from "../models/Chat.js";
// import Document from "../models/Document.js";
// import { deleteDocumentVectors, indexDocumentChunks, semanticSearch } from "../services/ragService.js";
// import chunkText from "../utils/chunkText.js";
// import { extractTextFromFile } from "../utils/extractText.js";

// // ❌ REMOVED: import pdfParse from "pdf-parse"; -> This was causing the ENOENT startup crash!

// const buildFileUrl = (filename) => `/${process.env.UPLOAD_DIR || "uploads"}/${filename}`;

// const uploadDocument = asyncHandler(async (req, res) => {
//   if (!req.file) {
//     res.status(400);
//     throw new Error("A file upload is required.");
//   }

//   const extension = path.extname(req.file.originalname).replace(".", "").toLowerCase();
//   let extractedText;

//   if (extension === "pdf") {
//     // ✅ FIX: Dynamically import the core script directly to skip the buggy test suite execution
//     const { default: pdfParse } = await import("pdf-parse/lib/pdf-parse.js");
    
//     const fileBuffer = await fs.readFile(req.file.path);
//     const pdfData = await pdfParse(fileBuffer);
//     extractedText = pdfData.text;
//   } else {
//     extractedText = await extractTextFromFile(req.file.path, extension);
//   }

//   if (!extractedText) {
//     res.status(400);
//     throw new Error("No readable text could be extracted from the file.");
//   }

//   const chunks = chunkText(extractedText, 1000, 200);
//   const documentRecord = await Document.create({
//     userId: req.user._id,
//     title: req.body.title || req.file.originalname.replace(path.extname(req.file.originalname), ""),
//     originalFileName: req.file.originalname,
//     fileUrl: buildFileUrl(req.file.filename),
//     fileType: extension,
//     fileSize: req.file.size,
//     extractedText,
//     chunks,
//     chunkCount: chunks.length,
//   });

//   await indexDocumentChunks(documentRecord);

//   res.status(201).json({
//     message: "Document uploaded and indexed successfully.",
//     document: documentRecord,
//   });
// });

// const getDocuments = asyncHandler(async (req, res) => {
//   const documents = await Document.find({ userId: req.user._id }).sort({ uploadedAt: -1 });
//   res.json({ documents });
// });

// const getDocumentById = asyncHandler(async (req, res) => {
//   const documentRecord = await Document.findOne({
//     _id: req.params.id,
//     userId: req.user._id,
//   });

//   if (!documentRecord) {
//     res.status(404);
//     throw new Error("Document not found.");
//   }

//   const [analyses, chats] = await Promise.all([
//     Analysis.find({ userId: req.user._id, documentId: req.params.id }).sort({ createdAt: -1 }).limit(20),
//     Chat.find({ userId: req.user._id, documentId: req.params.id }).sort({ timestamp: -1 }).limit(20),
//   ]);

//   res.json({
//     document: documentRecord,
//     analyses,
//     chats,
//   });
// });

// const deleteDocument = asyncHandler(async (req, res) => {
//   const documentRecord = await Document.findOne({
//     _id: req.params.id,
//     userId: req.user._id,
//   });

//   if (!documentRecord) {
//     res.status(404);
//     throw new Error("Document not found.");
//   }

//   await Promise.all([
//     deleteDocumentVectors(documentRecord),
//     Analysis.deleteMany({ documentId: documentRecord._id }),
//     Chat.deleteMany({ documentId: documentRecord._id }),
//     fs.unlink(path.resolve(process.cwd(), documentRecord.fileUrl.replace(/^\//, ""))).catch(() => null),
//     documentRecord.deleteOne(),
//   ]);

//   res.json({ message: "Document deleted successfully." });
// });

// const searchDocuments = asyncHandler(async (req, res) => {
//   const { q = "", documentId } = req.query;

//   if (!q.trim()) {
//     res.status(400);
//     throw new Error("Search query is required.");
//   }

//   const filters = { userId: req.user._id };
//   if (documentId) {
//     filters._id = documentId;
//   }

//   const documents = await Document.find(filters).select("title extractedText chunks");

//   const keywordResults = documents
//     .filter((doc) => doc.extractedText.toLowerCase().includes(q.toLowerCase()))
//     .map((doc) => ({
//       documentId: doc._id,
//       title: doc.title,
//       type: "keyword",
//       excerpt: doc.extractedText.slice(
//         Math.max(0, doc.extractedText.toLowerCase().indexOf(q.toLowerCase()) - 120),
//         Math.max(400, doc.extractedText.toLowerCase().indexOf(q.toLowerCase()) + 280),
//       ),
//     }));

//   let semanticResults = [];
//   if (documentId) {
//     semanticResults = await semanticSearch({
//       documentId: documentId.toString(),
//       query: q,
//       limit: 5,
//     });
//   }

//   res.json({
//     keywordResults,
//     semanticResults,
//   });
// });

// export { uploadDocument, getDocuments, getDocumentById, deleteDocument, searchDocuments };