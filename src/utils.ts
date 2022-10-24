import axios from "axios";
import FeedbackModel from './db';

interface ReceivedFeedbacks {
    answers:any[], 
    author:string,
    body:string,
    icon:string, 
    rated:string,
    orderHash:string, 
    products:any,
}
export const path = (limit: number, offset: string) =>
  `https://api.delivery-club.ru/api1.2/reviews?chainId=48274&limit=${limit}&offset=${offset}`;

export async function updateDB() {
  const lastFeedback = await FeedbackModel.findOne().sort({
    date: -1,
  });

  if (lastFeedback) {
    let reqIncudesLast = false;
    const newFeedbacks = [];
  
    for (let i = 0; ; i++) {
      const {
        data: { reviews },
      } = await axios(path(10, `${i}0`));

      reqIncudesLast = reviews.some(({ orderHash }: {orderHash: string}) => orderHash === lastFeedback.id);
        
      const filterFeedbacks = reviews.filter(
        ({ rated }:{rated: string}) => new Date(rated) > lastFeedback.date
      );
      newFeedbacks.push(...changeParams(filterFeedbacks));
  
      if (reqIncudesLast) break;
    }
    await FeedbackModel.insertMany(newFeedbacks);
  }
  
}

export function changeParams(arr:ReceivedFeedbacks[]){
    return arr.map(({ answers, author, body, icon, rated, orderHash }) => ({
      answer: answers[0]?.answer?.trim() || "",
      author: author || "incognito",
      text: body.trim() || "",
      reting: icon.charCodeAt(1).toString(16) === "de0a" ? 5 : 1,
      date: new Date(rated),
      id: orderHash,
    }));
  }
  