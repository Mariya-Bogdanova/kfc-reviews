import express from "express";
import mongoose from "mongoose";
import FeedbackModel from "./db.js";
import { updateDB } from "./updateDBFunction.js";

mongoose.connect("mongodb://localhost:27017/feedback", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.get("/", async (req, res) => {
  updateDB();
  const {
    limit = 10,
    offset = 0,
    date,
    rating,
    dateStart = "1970-01-01",
    dateEnd = "2050-01-01",
    filtrByRating,
  } = req.query;

  let reqSort;
  if (date) {
    reqSort = { date };
  } else if (rating) {
    reqSort = { rating };
  } else {
    reqSort = { date: -1 };
  }

  const data = await FeedbackModel.find(
    {
      $and: [
        {
          reting: filtrByRating || { $in: [1, 5] },
        },
        {
          date: { $gte: new Date(dateStart), $lte: new Date(dateEnd) },
        },
      ],
    },
    { _id: 0, id: 0, __v: 0 }
  )
    .sort(reqSort)
    .skip(offset)
    .limit(limit)
    .exec();

  res.json(data);
});

app.listen(process.env.PORT ?? 3000);
