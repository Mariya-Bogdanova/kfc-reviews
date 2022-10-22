import express from "express";
import axios from "axios";

const app = express();

async function getAllFeedbacks() {
  const {
    data: { total },
  } = await axios(
    "https://api.delivery-club.ru/api1.2/reviews?chainId=48274&limit=1&offset=0"
  );
  const count = Math.ceil(total / 1000);

  for (let i = 0; i < 3; i++) {
    const {
      data: { reviews },
    } = await axios(
      `https://api.delivery-club.ru/api1.2/reviews?chainId=48274&limit=1000&offset=${i}000`
    );

    const feedbacks = reviews.map(
      ({ answers, author, body, icon, rated, orderHash }) => ({
        answers,
        author,
        text: body,
        icon,
        date: rated,
        id: orderHash,
      })
    );
  }
}

getAllFeedbacks();

// app.get("/", async(req, res) => {
// const info = await parse();
//   return res.json(info);;
// });

app.listen(process.env.PORT ?? 3000);
