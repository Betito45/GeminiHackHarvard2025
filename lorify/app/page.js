"use client"

import { useState, useEffect, useRef } from "react"
import Title from "@/components/Title"

export default function LorifyPage() {
  const [activeMode, setActiveMode] = useState("savage")
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState("")
  const [isRevealing, setIsRevealing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("")
          setQuestion(transcript)
        }

        recognitionRef.current.onend = () => {
          setIsRecording(false)
        }
      }
    }
  }, [])

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser.")
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  const modes = [
    { id: "savage", emoji: "😈", label: "Savage" },
    { id: "storytelling", emoji: "📖", label: "Storytelling" },
    { id: "therapy", emoji: "🛋️", label: "Therapy" },
  ]

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
      responseBox: "from-red-900/60 to-orange-900/60 border-red-400/30 shadow-red-500/20",
      responseText: "text-red-100",
      micButton:
        "bg-red-800/50 hover:bg-red-700/50 text-red-100 hover:shadow-red-500/30",
    },
    storytelling: {
      background: "bg-gradient-to-br from-sky-400 via-yellow-300 to-green-400",
      card: "bg-gradient-to-br from-yellow-100/95 to-sky-100/95 border-yellow-400/40 shadow-yellow-500/20",
      avatar: "bg-gradient-to-br from-yellow-400 to-sky-400 shadow-yellow-500/60",
      avatarIcon: "📖",
      avatarGlow: "bg-yellow-400/40",
      button: "from-yellow-500 to-sky-500 shadow-yellow-500/40 border-yellow-400",
      buttonHover: "hover:shadow-yellow-500/60",
      input:
        "bg-white/80 border-yellow-400/40 text-gray-800 placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-400/30",
      responseBox: "from-yellow-50/80 to-sky-50/80 border-yellow-400/40 shadow-yellow-500/10",
      responseText: "text-gray-800",
      micButton:
        "bg-yellow-400/50 hover:bg-yellow-500/60 text-gray-800 hover:shadow-yellow-500/30",
    },
    therapy: {
      background: "bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900",
      card: "bg-gradient-to-br from-slate-800/95 to-blue-900/95 border-blue-400/20 shadow-blue-500/10",
      avatar: "bg-gradient-to-br from-blue-600 to-slate-600 shadow-blue-500/40",
      avatarIcon: "🧠",
      avatarGlow: "bg-blue-500/30",
      button: "from-blue-600 to-slate-600 shadow-blue-500/30 border-blue-400",
      buttonHover: "hover:shadow-blue-500/50",
      input:
        "bg-slate-900/50 border-blue-500/20 text-blue-100 placeholder-blue-400/40 focus:border-blue-400 focus:ring-blue-500/20",
      responseBox: "from-slate-800/60 to-blue-900/60 border-blue-400/20 shadow-blue-500/10",
      responseText: "text-blue-100",
      micButton:
        "bg-slate-700/50 hover:bg-slate-600/50 text-blue-100 hover:shadow-blue-500/20",
    },
  }

  const currentTheme = themes[activeMode]

  const handleReveal = () => {
    setIsRevealing(true)
    setTimeout(() => {
      const responses = {
        savage:
          "Listen up! The universe doesn't owe you anything. Get out there and take what's yours! 🔥",
        storytelling:
          "Once upon a time, in a land not so far away, your dreams began to sparkle with possibility... ✨",
        therapy:
          "I hear you. Let's explore what's really going on beneath the surface. Take a deep breath. 🧠",
      }
      setResponse(responses[activeMode])
      setIsRevealing(false)
    }, 1500)
  }

  return (
    <div
      className={`min-h-screen ${currentTheme.background} flex items-center justify-center p-4 transition-all duration-700`}
    >
      <div
        className={`w-full max-w-2xl ${currentTheme.card} backdrop-blur-xl rounded-2xl shadow-2xl p-8 border transition-all duration-700`}
      >
        <Title />

        {/* Mode Switcher */}
        <div className="mb-8">
          <div className="flex gap-3 justify-center">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveMode(mode.id)
                  setResponse("")
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
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div
              className={`w-32 h-32 rounded-full ${currentTheme.avatar} flex items-center justify-center text-6xl shadow-lg transition-all duration-700`}
            >
              {currentTheme.avatarIcon}
            </div>
            <div className={`absolute inset-0 rounded-full ${currentTheme.avatarGlow} animate-ping`} />
          </div>
        </div>

        {/* Response Box */}
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

        {/* Input + Buttons */}
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

            {/* Microphone Button */}
            <button
              onClick={toggleRecording}
              className={`${currentTheme.micButton} font-medium py-4 px-6 rounded-full transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 ${
                isRecording ? "animate-pulse-mic" : ""
              }`}
            >
              🎤
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
