import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";


const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  let { prompt } = await req.json();
  console.log("promt===",prompt)
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: 
          "You are an AI writing assistant that continues existing text based on context from prior text. " +
          "Give more weight/priority to the later characters than the beginning ones. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  });

  // Convert the response into a friendly text-stream
  
  const stream = OpenAIStream(response);
  //console.log(JSON.stringify(new StreamingTextResponse(stream)));
  
 // console.log(stream)
 return new StreamingTextResponse(stream, prompt);
//return OpenAIStream(stream)
}
