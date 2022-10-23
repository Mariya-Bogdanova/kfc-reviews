import express from "express";
import mongoose, { ConnectOptions, SortOrder } from "mongoose";
import FeedbackModel from "./db";
import { updateDB } from "./utils";
import { DATESTART, DATEEND, LIMIT, OFFSET } from "./consts";

mongoose.connect("mongodb://localhost:27017/feedback", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions);

const app = express();

app.get("/", async (req, res) => {
  updateDB();
  const {
    limit = LIMIT,
    offset = OFFSET,
    date,
    rating,
    dateStart = DATESTART,
    dateEnd = DATEEND,
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
          date: { $gte: new Date(dateStart as string), $lte: new Date(dateEnd as string ) },
        },
      ],
    },
    { _id: 0, id: 0, __v: 0 }
  )
    .sort(reqSort as any)
    .skip(offset as number)
    .limit(limit as number)
    .exec();

  res.json(data);
});

app.listen(process.env.PORT ?? 3000);
