"use client";
import { useState } from "react";

export default function CharacterUI() {
  const [mode, setMode] = useState("savage");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    // Fake responses for now
    const fakeResponses = {
      savage: "This is giving unpaid intern starter pack 💀.",
      storytelling: "Once upon a time, someone made a mid decision. The end.",
      therapy: "Oh, you’re stressed? Congrats, you’re human.",
    };
    setOutput(fakeResponses[mode]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        AI Character Demo
      </h1>

      {/* Mode Selector */}
      <div className="flex justify-center gap-4 mb-4">
        {["savage", "storytelling", "therapy"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg ${
              mode === m ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Input */}
      <textarea
        placeholder="Enter a prompt..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border rounded p-3 mb-4"
        rows="3"
      />

      {/* Button */}
      <button
        onClick={handleGenerate}
        className="w-full bg-black text-white py-2 rounded-lg hover:opacity-80"
      >
        Generate
      </button>

      {/* Output */}
      {output && (
        <div className="mt-6 p-4 border rounded bg-gray-100 text-lg">
          {output}
        </div>
      )}
    </div>
  );
}
