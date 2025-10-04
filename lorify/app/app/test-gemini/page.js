"use client";

import { useState } from "react";
import { callGemini } from "../utils/gemini"; 
  

export default function TestGeminiPage() {
  console.log("Gemini Key Loaded:", process.env.NEXT_PUBLIC_GEMINI_API_KEY); // ✅ Add here

  // 🧠 Added: Oracle modes
  const modes = ["savage", "storytelling", "therapy"];
  const [mode, setMode] = useState("storytelling");

  const askGemini = async () => {
    try {
      setLoading(true);
      setResponse("");

      // ⚡ Use the shared Gemini helper
      const text = await callGemini(mode, "Introduce yourself super quickly!");

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
      {/* 🔮 Keep your original UI text */}
      <h1 className="text-2xl font-bold mb-4">Gemini 2.5 Flash-Lite Test</h1>

      {/* 🧭 Add an optional Oracle mode selector */}
      <div className="mb-3">
        <label className="mr-2 font-medium">Oracle Mode:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="bg-gray-800 text-white p-1 rounded"
        >
          {modes.map((m) => (
            <option key={m} value={m}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </option>
          ))}
        </select>
      </div>

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
