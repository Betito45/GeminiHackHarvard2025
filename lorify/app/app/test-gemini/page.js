"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function TestGeminiPage() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askGemini = async () => {
    try {
      setLoading(true);
      setResponse("");

      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

      // 🚀 Fastest model: Gemini 2.5 Flash-Lite
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

      const result = await model.generateContent("Introduce yourself super quickly!");
      const text = result.response.text();

      setResponse(text);
    } catch (err) {
      console.error("Gemini error:", err);
      setResponse("⚠️ Something went wrong. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gemini 2.5 Flash-Lite Test</h1>
      <button
        onClick={askGemini}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {loading ? "Asking Gemini..." : "Ask Gemini (Flash-Lite)"}
      </button>
      <div className="mt-4 whitespace-pre-wrap">{response}</div>
    </div>
  );
}
