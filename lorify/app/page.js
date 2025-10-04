"use client";

import { useState, useEffect } from "react";

export default function LorifyPage() {
  const [activeMode, setActiveMode] = useState("savage");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isRevealing, setIsRevealing] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const modes = [
    { id: "savage", emoji: "😈", label: "Savage" },
    { id: "storytelling", emoji: "📖", label: "Storytelling" },
    { id: "therapy", emoji: "🛋️", label: "Therapy" },
  ];

  // 🗣️ Text-to-Speech whenever response changes
  useEffect(() => {
    if (response) {
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.lang = "en-US";
      utterance.rate = 1; // speed (1 = normal)
      utterance.pitch = 1.1; // slightly mystical tone
      window.speechSynthesis.speak(utterance);
    }
  }, [response]);

  const handleReveal = () => {
    setIsRevealing(true);

    // 👉 Placeholder: here’s where Gemini will go later
    // For now, do nothing (no fake demo response)
    // Example future use:
    // fetch("/api/generate", { method: "POST", body: JSON.stringify({ question, mode: activeMode }) })

    setTimeout(() => {
      setIsRevealing(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support voice input 😢");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gradient-to-br from-purple-950/80 to-indigo-950/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-purple-500/30 p-8 border border-purple-500/20">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            🔮 Lorify
          </h1>
          <p className="text-purple-300/80 text-lg">Your mystical AI companion</p>
        </div>

        {/* Character Box */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-6xl shadow-lg shadow-purple-500/50">
                🔮
              </div>
              <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
            </div>
          </div>

          {response && (
            <div className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 rounded-2xl p-6 border border-purple-400/30 shadow-lg shadow-purple-500/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-purple-100 text-center text-lg leading-relaxed">
                {response}
              </p>
            </div>
          )}

          {isRevealing && (
            <div className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 rounded-2xl p-6 border border-purple-400/30 shadow-lg shadow-purple-500/20">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        {/* Mode Selector */}
        <div className="mb-6">
          <div className="flex gap-3 justify-center">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeMode === mode.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 border-2 border-purple-400"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 border-2 border-transparent"
                }`}
              >
                <span className="text-xl">{mode.emoji}</span>
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User Input Area */}
        <div className="space-y-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask Lorify anything... What does the future hold?"
            className="w-full h-32 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl p-4 text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 resize-none transition-all"
          />

          <div className="flex gap-3">
            <button
              onClick={handleReveal}
              disabled={!question.trim()}
              className="flex-1 bg-gradient-to-r from-black to-violet-900 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              ✨ Reveal My Fortune
            </button>

            <button
              onClick={handleVoiceInput}
              className={`px-6 py-4 rounded-full transition-all duration-300 ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-purple-800/50 hover:bg-purple-700/50 text-purple-100"
              }`}
            >
              🎤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
