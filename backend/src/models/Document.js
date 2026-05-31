import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema(
  {
    chunkId: { type: String, required: true },
    content: { type: String, required: true },
    index: { type: Number, required: true },
  },
  { _id: false },
);

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      enum: ["pdf", "txt", "docx"],
    },
    fileSize: {
      type: Number,
      required: true,
    },
    extractedText: {
      type: String,
      required: true,
    },
    chunkCount: {
      type: Number,
      default: 0,
    },
    chunks: {
      type: [chunkSchema],
      default: [],
    },
    analytics: {
      summariesGenerated: { type: Number, default: 0 },
      chatsCount: { type: Number, default: 0 },
      flashcardsGenerated: { type: Number, default: 0 },
      mcqsGenerated: { type: Number, default: 0 },
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
