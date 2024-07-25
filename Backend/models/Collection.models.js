import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },
    rawNotes: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    url: {
      type: String,
    },
    rewrittenNotes: {
      type: String,
    },
    summary: {
      type: String,
    },
    faq: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Collection", collectionSchema);
