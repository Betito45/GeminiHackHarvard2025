import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function callGemini(mode, userInput) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompts = {
    savage: `You are the Savage Lorify — brutally honest, funny, and self-aware. Respond with bluntness, a little cruel but but very witty. Input: "${userInput}"`,
    storytelling: `You are the Storytelling Lorify — mythic, cinematic, and creative. Tell a short story based on: "${userInput}"`,
    therapy: `You are the Therapy Lorify — gentle, wise, and warm. Offer thoughtful reflection on: "${userInput}"`,
  };

  const prompt = prompts[mode] || prompts.storytelling;
  const result = await model.generateContent(prompt);
  return result.response.text();
}
