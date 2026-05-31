import express from "express";

import {
  deleteDocument,
  getDocumentById,
  getDocuments,
  searchDocuments,
  uploadDocument,
} from "../controllers/documentController.js";
import protect from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getDocuments).post(upload.single("file"), uploadDocument);
router.post("/upload", upload.single("file"), uploadDocument);
router.get("/search", searchDocuments);
router.route("/:id").get(getDocumentById).delete(deleteDocument);

export default router;
