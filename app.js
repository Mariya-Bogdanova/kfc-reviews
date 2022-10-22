import express from "express";
import axios from "axios";
import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/feedback", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

// app.get("/", async(req, res) => {
// const info = await parse();
//   return res.json(info);;
// });

app.listen(process.env.PORT ?? 3000);
