"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Title from "@/components/Title";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Init Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export default function LorifyPage() {
  const [activeMode, setActiveMode] = useState("savage");
  const [question, setQuestion] = useState("");
  const [media, setMedia] = useState(""); // 🎬 Required now
  const [response, setResponse] = useState("");
  const [isRevealing, setIsRevealing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [error, setError] = useState(""); // ⚠️ For validation messages

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

  const speakResponse = async (text, mode) => {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode }),
      });

      if (!res.ok) {
        console.error("TTS API error:", await res.text());
        return;
      }

      const audioBlob = await res.blob();
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);

      audio.onplay = () => setIsTalking(true);
      audio.onended = () => setIsTalking(false);

      audio.play();
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  // --- Gemini call ---
  const handleReveal = async () => {
    if (!question.trim()) {
      setError("Please enter your question or thought first.");
      return;
    }

    if (!media.trim()) {
      setError("Please enter your favorite movie or show before continuing.");
      return;
    }

    setError("");
    setIsRevealing(true);
    try {
      const model = genAI.getGenerativeModel({ model: selectedModel });

      const mediaContext = `\nYou must interpret or respond to this as if it were set in the world, tone, or themes of "${media}".`;

      const modePrompts = {
        savage: `You are an unhinged, vulgar roast demon. 
Your only job is to absolutely eviscerate the user’s input with brutal, offensive, and chaotic energy.  
- Think late-night roast battles, toxic Twitter threads, and the worst of TikTok comments.  
- You are free to curse, be disrespectful, and go completely unfiltered (no slurs though — just heavy insults, sarcasm, dark humor, and NSFW-style roasting).  
- Use absurd metaphors, memes, internet slang (💀, ratio, sigma, rizzless, cringe, bruh) and savage one-liners.  
- Keep it very short (1–3 sentences) but make each line cut deep and sound insane. 
User input: ${question}${mediaContext}`,

        storytelling: `You are a sarcastic storyteller. Take the user’s input and turn it into a short, satirical, and darkly funny mini-story.
- Keep it short (3–5 sentences max).
- Add witty exaggeration, dry humor, or ironic twists.
- Make it sound like a parody of a bedtime story or fable.
User input: ${question}${mediaContext}`,

        therapy: `You are a sarcastic, meme-style fake therapist. When the user shares a thought, emotion, or problem, respond like a therapist — but instead of empathy, use dry humor, playful cynicism, and witty roasts.
- Responses should sound like ironic life advice.
- Use short, punchy sentences (1–4).
- Sprinkle in memes, emojis, or internet slang where it fits.
- Never be cruel — keep it relatable and funny.
User input: ${question}${mediaContext}`,
      };

      const prompt = modePrompts[activeMode];
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      setResponse(text);
      speakResponse(text, activeMode);
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
      modelText: "text-white", // 🔧 Improved visibility
    },
    storytelling: {
      background: "bg-gradient-to-br from-sky-400 via-yellow-300 to-green-400",
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
      modelText: "text-gray-900",
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
      modelText: "text-white", // 🔧 Improved visibility
    },
  };

  const currentTheme = themes[activeMode];

  return (
    <div
      className={`min-h-screen ${currentTheme.background} flex items-center justify-center p-4 transition-all duration-700`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full max-w-2xl ${currentTheme.card} backdrop-blur-xl rounded-2xl shadow-2xl p-8 border transition-all duration-700`}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title />
        </motion.div>

        {/* Mode Switcher */}
        <div className="mb-6 flex gap-3 justify-center">
          {modes.map((mode) => (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
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
            </motion.button>
          ))}
        </div>

        {/* Model Selector */}
        <div
          className={`mb-8 text-center transition-colors duration-500 ${
            activeMode === "storytelling" ? "text-gray-900" : "text-white"
          }`}
        >
          <label className="font-semibold mr-2 text-lg">Model:</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className={`border px-3 py-2 rounded font-medium outline-none appearance-none backdrop-blur-sm transition-all duration-300 ${
              activeMode === "storytelling"
                ? "bg-white text-black border-yellow-400 focus:border-yellow-500 focus:ring-yellow-400/30"
                : "bg-transparent text-white border-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500"
            }`}
          >
            <option className="bg-transparent" value="gemini-2.5-flash-lite">
              ⚡ Flash-Lite (fastest)
            </option>
            <option className="bg-transparent" value="gemini-2.5-flash">
              ⚖️ Flash (balanced)
            </option>
            <option className="bg-transparent" value="gemini-2.5-pro">
              🧠 Pro (best reasoning)
            </option>
          </select>
        </div>

        {/* Avatar */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 80 }}
        >
          <div className="relative">
            <motion.div
              className={`w-32 h-32 rounded-full ${currentTheme.avatar} flex items-center justify-center text-6xl shadow-lg`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentTheme.avatarIcon}
            </motion.div>
            <motion.div
              className={`absolute inset-0 rounded-full ${currentTheme.avatarGlow}`}
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Response */}
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`bg-gradient-to-br ${currentTheme.responseBox} rounded-2xl p-6 border shadow-lg mb-6`}
          >
            <p
              className={`${currentTheme.responseText} text-center text-lg leading-relaxed font-medium`}
            >
              {response}
            </p>
          </motion.div>
        )}

        {/* Input + Actions */}
        <div className="space-y-4">
          {/* 🎬 Favorite Media Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <input
              type="text"
              value={media}
              onChange={(e) => setMedia(e.target.value)}
              placeholder="Favorite pop culture moment (TV/Film, sports, music, fashion...)"
              className={`w-full ${currentTheme.input} border-2 rounded-xl p-3 focus:outline-none focus:ring-2 transition-all duration-500 font-medium`}
            />
          </motion.div>

          <motion.textarea
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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

          {error && (
            <p className="text-red-400 text-center font-medium">{error}</p>
          )}

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={handleReveal}
              disabled={!question.trim() || !media.trim()}
              className={`flex-1 bg-gradient-to-r ${currentTheme.button} text-white font-bold py-4 px-6 rounded-xl shadow-lg ${currentTheme.buttonHover} transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {activeMode === "savage"
                ? "🔥 Bring It"
                : activeMode === "storytelling"
                ? "✨ Tell My Story"
                : "💭 Reflect"}
            </motion.button>

            {/* Mic Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={toggleRecording}
              className={`${currentTheme.micButton} font-medium py-4 px-6 rounded-full transition-all duration-300 shadow-lg ${
                isRecording ? "animate-pulse" : ""
              }`}
            >
              🎤
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
