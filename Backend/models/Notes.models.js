import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    
    title: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
    GenAiTag: {
      type: String,
    },
    AllSummary: {
      type: String,
    },    
    
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Note", noteSchema);
