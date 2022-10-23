import FeedbackModel from "./db.js";
import axios from "axios";

export async function updateDB() {
  const { id: idLast, date: dateLast } = await FeedbackModel.findOne().sort({
    date: -1,
  });
  let reqIncudesLast = false;
  const newFeedbacks = [];

  for (let i = 0; ; i++) {
    const {
      data: { reviews },
    } = await axios(
      `https://api.delivery-club.ru/api1.2/reviews?chainId=48274&limit=10&offset=${i}0`
    );
    reqIncudesLast = reviews.some(({ orderHash }) => orderHash === idLast);
    newFeedbacks.push(
      ...reviews
        .filter(({ rated }) => new Date(rated) > dateLast)
        .map(({ answers, author, body, icon, rated, orderHash }) => ({
          answer: answers[0]?.answer?.trim() || "",
          author: author || "incognito",
          text: body.trim() || "",
          reting: icon.charCodeAt(1).toString(16) === "de0a" ? 5 : 1,
          date: new Date(rated),
          id: orderHash,
        }))
    );
    if (reqIncudesLast) break;
  }
  await FeedbackModel.insertMany(newFeedbacks);
}
