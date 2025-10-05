"use client";

import { useState } from "react";
import { callGemini } from "../utils/gemini";

export default function LorifyOraclePage() {
  const [input, setInput] = useState("");
  const [media, setMedia] = useState("");
  const [mode, setMode] = useState("storytelling");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askOracle = async () => {
    setLoading(true);
    setResponse("");
    try {
      const text = await callGemini(mode, input, media);
      setResponse(text);
    } catch (err) {
      console.error("Gemini error:", err);
      setResponse("⚠️ Something went wrong. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-8">
      <h1 className="text-3xl font-bold mb-6">🔮 Lorify: The Living Oracle</h1>

      {/* MODE SELECTOR */}
      <div className="mb-4 w-full max-w-md">
        <label className="block mb-1 font-medium text-gray-300">Oracle Mode</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700"
        >
          <option value="savage">Savage</option>
          <option value="storytelling">Storytelling</option>
          <option value="therapy">Therapy</option>
        </select>
      </div>

      {/* FAVORITE MEDIA INPUT */}
      <div className="mb-4 w-full max-w-md">
        <label className="block mb-1 font-medium text-gray-300">
          Favorite Movie or Show (optional)
        </label>
        <input
          type="text"
          value={media}
          onChange={(e) => setMedia(e.target.value)}
          placeholder='e.g., "Black Panther" or "The Office"'
          className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700"
        />
      </div>

      {/* MAIN INPUT */}
      <div className="mb-4 w-full max-w-md">
        <label className="block mb-1 font-medium text-gray-300">Ask the Oracle</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question or idea..."
          className="w-full bg-gray-900 text-white p-3 rounded border border-gray-700"
          rows={4}
        />
      </div>

      {/* BUTTON */}
      <button
        onClick={askOracle}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 transition-colors px-6 py-2 rounded-lg font-semibold"
      >
        {loading ? "Consulting the Oracle..." : "Reveal Prophecy"}
      </button>

      {/* RESPONSE */}
      {response && (
        <div className="mt-6 max-w-2xl bg-gray-800 p-4 rounded shadow-lg whitespace-pre-wrap">
          {response}
        </div>
      )}
    </main>
  );
}
