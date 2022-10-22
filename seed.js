import mongoose from "mongoose";
import FeedbackModel from "./db.js";
import axios from "axios";

mongoose.connect("mongodb://localhost:27017/feedback", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function getAllFeedbacks() {
  const {
    data: { total },
  } = await axios(
    "https://api.delivery-club.ru/api1.2/reviews?chainId=48274&limit=1&offset=0"
  );
  const count = Math.ceil(total / 1000);

  for (let i = 0; i < count; i++) {
    const {
      data: { reviews },
    } = await axios(
      `https://api.delivery-club.ru/api1.2/reviews?chainId=48274&limit=1000&offset=${i}000`
    );

    const feedbacks = reviews.map(
      ({ answers, author, body, icon, rated, orderHash }) => ({
        answer: answers[0]?.answer?.trim() || "",
        author: author || "incognito",
        text: body.trim() || "",
        icon,
        date: rated,
        id: orderHash,
      })
    );
    await FeedbackModel.insertMany(feedbacks);
  }
}

getAllFeedbacks();
