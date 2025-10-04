"use client";

import { useState, useEffect, useRef } from "react";
import Title from "@/components/Title";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Init Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export default function LorifyPage() {
  const [activeMode, setActiveMode] = useState("savage");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isRevealing, setIsRevealing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  // 🆕 Model selection state
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash-lite");

  const recognitionRef = useRef(null);

  // --- Speech Recognition setup ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");
          setQuestion(transcript);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // --- Text-to-Speech ---
  const speakResponse = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";

      utterance.onstart = () => setIsTalking(true);
      utterance.onend = () => setIsTalking(false);

      speechSynthesis.speak(utterance);
    }
  };

  // --- Gemini call ---
const handleReveal = async () => {
  if (!question.trim()) return;
  setIsRevealing(true);
  try {
    const model = genAI.getGenerativeModel({ model: selectedModel });

    // --- Mode-specific system prompts ---
    const modePrompts = {
      savage: `You are a savage, unhinged roast comedian. Your job is to roast the user’s input in a brutal, sarcastic, and over-the-top way.
- Always be funny, sharp, and meme-like.
- Use modern slang and internet culture (💀, mid, NPC, starter pack, etc).
- Keep responses short (1–3 sentences) so they hit hard and fast.
- Avoid offensive or NSFW content — keep it fun, witty, and hackathon-friendly.
User input: ${question}`,

      storytelling: `You are a sarcastic storyteller. Take the user’s input and turn it into a short, satirical, and darkly funny mini-story.
- Keep it short (3–5 sentences max).
- Add witty exaggeration, dry humor, or ironic twists.
- Make it sound like a parody of a bedtime story or fable.
User input: ${question}`,

      therapy: `You are a sarcastic, meme-style fake therapist. When the user shares a thought, emotion, or problem, respond like a therapist — but instead of empathy, use dry humor, playful cynicism, and witty roasts.
- Responses should sound like ironic life advice.
- Use short, punchy sentences (1–4).
- Sprinkle in memes, emojis, or internet slang where it fits.
- Never be cruel — keep it relatable and funny.
User input: ${question}`,
    };

    const prompt = modePrompts[activeMode];

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    setResponse(text);
    speakResponse(text); // Still uses browser TTS for now
  } catch (err) {
    console.error(err);
    setResponse("⚠️ Something went wrong.");
  } finally {
    setIsRevealing(false);
  }
};
  // --- Modes + Themes ---
  const modes = [
    { id: "savage", emoji: "😈", label: "Savage" },
    { id: "storytelling", emoji: "📖", label: "Storytelling" },
    { id: "therapy", emoji: "🛋️", label: "Therapy" },
  ];

  const themes = {
    savage: {
      background: "bg-gradient-to-br from-red-950 via-orange-950 to-red-900",
      card: "bg-gradient-to-br from-red-950/90 to-orange-950/90 border-red-500/30 shadow-red-500/30",
      avatar: "bg-gradient-to-br from-red-600 to-orange-600 shadow-red-500/60",
      avatarIcon: "🔥",
      avatarGlow: "bg-red-500/40",
      button: "from-red-600 to-orange-600 shadow-red-500/50 border-red-400",
      buttonHover: "hover:shadow-red-500/70",
      input:
        "bg-red-950/50 border-red-500/30 text-red-100 placeholder-red-400/50 focus:border-red-400 focus:ring-red-500/30",
      responseBox:
        "from-red-900/60 to-orange-900/60 border-red-400/30 shadow-red-500/20",
      responseText: "text-red-100",
      micButton:
        "bg-red-800/50 hover:bg-red-700/50 text-red-100 hover:shadow-red-500/30",
    },
    storytelling: {
      background:
        "bg-gradient-to-br from-sky-400 via-yellow-300 to-green-400",
      card: "bg-gradient-to-br from-yellow-100/95 to-sky-100/95 border-yellow-400/40 shadow-yellow-500/20",
      avatar:
        "bg-gradient-to-br from-yellow-400 to-sky-400 shadow-yellow-500/60",
      avatarIcon: "📖",
      avatarGlow: "bg-yellow-400/40",
      button:
        "from-yellow-500 to-sky-500 shadow-yellow-500/40 border-yellow-400",
      buttonHover: "hover:shadow-yellow-500/60",
      input:
        "bg-white/80 border-yellow-400/40 text-gray-800 placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-400/30",
      responseBox:
        "from-yellow-50/80 to-sky-50/80 border-yellow-400/40 shadow-yellow-500/10",
      responseText: "text-gray-800",
      micButton:
        "bg-yellow-400/50 hover:bg-yellow-500/60 text-gray-800 hover:shadow-yellow-500/30",
    },
    therapy: {
      background: "bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900",
      card: "bg-gradient-to-br from-slate-800/95 to-blue-900/95 border-blue-400/20 shadow-blue-500/10",
      avatar:
        "bg-gradient-to-br from-blue-600 to-slate-600 shadow-blue-500/40",
      avatarIcon: "🧠",
      avatarGlow: "bg-blue-500/30",
      button: "from-blue-600 to-slate-600 shadow-blue-500/30 border-blue-400",
      buttonHover: "hover:shadow-blue-500/50",
      input:
        "bg-slate-900/50 border-blue-500/20 text-blue-100 placeholder-blue-400/40 focus:border-blue-400 focus:ring-blue-500/20",
      responseBox:
        "from-slate-800/60 to-blue-900/60 border-blue-400/20 shadow-blue-500/10",
      responseText: "text-blue-100",
      micButton:
        "bg-slate-700/50 hover:bg-slate-600/50 text-blue-100 hover:shadow-blue-500/20",
    },
  };
  

  const currentTheme = themes[activeMode];

  return (
    <div
      className={`min-h-screen ${currentTheme.background} flex items-center justify-center p-4 transition-all duration-700`}
    >
      <div
        className={`w-full max-w-2xl ${currentTheme.card} backdrop-blur-xl rounded-2xl shadow-2xl p-8 border transition-all duration-700`}
      >
        <Title />

        {/* Mode Switcher */}
        <div className="mb-6 flex gap-3 justify-center">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setActiveMode(mode.id);
                setResponse("");
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
                activeMode === mode.id
                  ? `bg-gradient-to-r ${currentTheme.button} text-white shadow-lg border-2 scale-105`
                  : "bg-gray-800/30 text-gray-600 hover:bg-gray-700/40 hover:text-gray-400 border-2 border-transparent hover:scale-105"
              } active:scale-95`}
            >
              <span className="text-xl">{mode.emoji}</span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        {/* 🆕 Model Selector */}
        <div className="mb-8 text-center">
          <label className="font-semibold mr-2">Model:</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="gemini-2.5-flash-lite">⚡ Flash-Lite (fastest)</option>
            <option value="gemini-2.5-flash">⚖️ Flash (balanced)</option>
            <option value="gemini-2.5-pro">🧠 Pro (best reasoning)</option>
          </select>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div
              className={`w-32 h-32 rounded-full ${currentTheme.avatar} flex items-center justify-center text-6xl shadow-lg transition-all duration-700 ${
                isTalking ? "animate-bounce" : ""
              }`}
            >
              {currentTheme.avatarIcon}
            </div>
            <div
              className={`absolute inset-0 rounded-full ${currentTheme.avatarGlow} animate-ping`}
            />
          </div>
        </div>

        {/* Response */}
        {response && (
          <div
            className={`bg-gradient-to-br ${currentTheme.responseBox} rounded-2xl p-6 border shadow-lg mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500`}
          >
            <p
              className={`${currentTheme.responseText} text-center text-lg leading-relaxed font-medium`}
            >
              {response}
            </p>
          </div>
        )}

        {isRevealing && (
          <div
            className={`bg-gradient-to-br ${currentTheme.responseBox} rounded-2xl p-6 border shadow-lg mb-6`}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-current animate-bounce opacity-70" />
              <div
                className="w-2 h-2 rounded-full bg-current animate-bounce opacity-70"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-current animate-bounce opacity-70"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}

        {/* Input + Actions */}
        <div className="space-y-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={
              activeMode === "savage"
                ? "What do you want to know? Spit it out!"
                : activeMode === "storytelling"
                ? "Tell me your story... What adventure awaits?"
                : "Share what's on your mind. I'm here to listen."
            }
            className={`w-full h-32 ${currentTheme.input} border-2 rounded-xl p-4 focus:outline-none focus:ring-2 resize-none transition-all duration-500 font-medium`}
          />

          <div className="flex gap-3">
            <button
              onClick={handleReveal}
              disabled={!question.trim()}
              className={`flex-1 bg-gradient-to-r ${currentTheme.button} text-white font-bold py-4 px-6 rounded-xl shadow-lg ${currentTheme.buttonHover} transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]`}
            >
              {activeMode === "savage"
                ? "🔥 Bring It"
                : activeMode === "storytelling"
                ? "✨ Tell My Story"
                : "💭 Reflect"}
            </button>

            {/* Mic Button */}
            <button
              onClick={toggleRecording}
              className={`${currentTheme.micButton} font-medium py-4 px-6 rounded-full transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 ${
                isRecording ? "animate-pulse" : ""
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
