import mongoose from "mongoose";
mongoose.pluralize(null);

const FeedbackSchema = new mongoose.Schema({
  answer: String,
  author: String,
  text: String,
  reting: Number,
  date: { type: Date, required: true },
  id: { type: String, required: true },
});

export default mongoose.model("Feedback", FeedbackSchema);