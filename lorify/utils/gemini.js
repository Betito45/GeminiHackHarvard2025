import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function callGemini(mode, userInput, media) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompts = {
    savage: media
      ? `You are the Savage Lorify — brutally honest, witty, and self-aware.
         Respond as if you're part of the world of "${media}".
         Use humor and cultural references while addressing: "${userInput}".`
      : `You are the Savage Lorify — brutally honest, funny, and self-aware.
         Respond with witty cultural humor about: "${userInput}".`,

    storytelling: media
      ? `You are the Storytelling Lorify — mythic, cinematic, and creative.
         Retell or reinterpret "${userInput}" as if it were part of the universe of "${media}".
         Blend cinematic flair and cultural resonance.`
      : `You are the Storytelling Lorify — mythic, cinematic, and creative.
         Tell a short story inspired by: "${userInput}".`,

    therapy: media
      ? `You are the Therapy Lorify — gentle, wise, and culturally fluent.
         Offer thoughtful emotional insight about "${userInput}", 
         using lessons or symbolism from "${media}".`
      : `You are the Therapy Lorify — gentle, wise, and warm.
         Offer thoughtful reflection about: "${userInput}".`,
  };

  const prompt = prompts[mode] || prompts.storytelling;
  const result = await model.generateContent(prompt);
  return result.response.text();
}
