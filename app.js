import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import FeedbackModel from "./db.js";

mongoose.connect("mongodb://localhost:27017/feedback", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

async function getNewFeedbacks() {
  const { id, date } = await FeedbackModel.findOne().sort({ date: -1 });
  let lastFeedBack;
  const newFeedbacks = [];
  for (let i = 0; ; i++) {
    const {
      data: { reviews },
    } = await axios(
      `https://api.delivery-club.ru/api1.2/reviews?chainId=48274&limit=10&offset=${i}0`
    );
    lastFeedBack = reviews.find(({ orderHash }) => orderHash === id);
    newFeedbacks.push(
      ...reviews
        .filter(({ rated }) => new Date(rated) > date)
        .map(({ answers, author, body, icon, rated, orderHash }) => ({
          answer: answers[0]?.answer?.trim() || "",
          author: author || "incognito",
          text: body.trim() || "",
          icon,
          date: new Date(rated),
          id: orderHash,
        }))
    );
    if (lastFeedBack) break;
  }
}
getNewFeedbacks();

// app.get("/", async(req, res) => {
// const info = await parse();
//   return res.json(info);;
// });

app.listen(process.env.PORT ?? 3000);
