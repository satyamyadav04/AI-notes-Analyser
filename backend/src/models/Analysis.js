import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "summary",
        "keypoints",
        "mcq",
        "flashcards",
        "interview",
        "difficulty",
      ],
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;
