import mongoose from "mongoose";
import axios from "axios";
import FeedbackModel from "./db.js";
import { changeParams } from "./utils.js";
import { path } from "./utils.js";

mongoose.connect("mongodb://localhost:27017/feedback", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function getAllFeedbacks() {
  const {
    data: { total },
  } = await axios(path(1, 0));
  const count = Math.ceil(total / 1000);

  for (let i = 0; i < count; i++) {
    const {
      data: { reviews },
    } = await axios(path(1000, `${i}000`));

    const feedbacks = changeParams(reviews);
    await FeedbackModel.insertMany(feedbacks);
  }
}

getAllFeedbacks();
