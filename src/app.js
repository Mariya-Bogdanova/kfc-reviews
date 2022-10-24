import express from "express";
import mongoose from "mongoose";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import FeedbackModel from "./db.js";
import { updateDB } from "./utils.js";
import { DATESTART, DATEEND, LIMIT, OFFSET } from "./consts.js";

mongoose.connect("mongodb://localhost:27017/feedback", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Feedbacks API",
      description: "Feedbacks API Information",
      contact: {
        name: "Mariya Bogdanova",
      },
      servers: ["https://localhost:3000"],
    },
  },
  apis: ["src/app.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
/**
 * @swagger
 * /feedbacks?limit=10:
 *  get:
 *    description: Use to request feedbacks
 *    responses:
 *      '200':
 *        description: A successful response
 *    parameters:
 *      -  in : query
 *         name: offset
 *         type: integer
 *         description: The number of items to skip before starting to collect the result set.
 *         example: 10
 *      -  in : query
 *         name: limit
 *         type: integer
 *         description: Number of elements in the response.
 *         example: 10
 *      -  in : query
 *         name: date
 *         type: integer
 *         description: Sort by date. Not applicable with other active sorting
 *         example: 1/-1
 *      -  in : query
 *         name: rating
 *         type: integer
 *         description: Sort by rating. Not applicable with other active sorting
 *         example: 1/-1
 *      -  in : query
 *         name: dateStart
 *         type: string
 *         description: Filter by dateStart. Not applicable when filtering by rating
 *         example: "2022-09-01"
 *      -  in : query
 *         name: dateEnd
 *         type: string
 *         description: Filter by dateEnd. Not applicable when filtering by rating
 *         example: "2022-09-02"
 *      -  in : query
 *         name: filtrByRating
 *         type: integer
 *         description: Filter by rating. Not applicable with other active filtering
 *         example: 1/5
 */
app.get("/feedbacks", async (req, res) => {
  updateDB();
  const {
    limit = LIMIT, // 10
    offset = OFFSET, // 10
    date, // 1/-1
    rating, // 1/-1
    dateStart = DATESTART, // "2022-09-01"
    dateEnd = DATEEND, // "2022-09-02"
    filtrByRating, // 1/5
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
