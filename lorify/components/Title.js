"use client"

import { useState } from "react"

export default function Title() {
  const [particles, setParticles] = useState([])

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Create 20 particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: centerX,
      y: centerY,
      angle: (Math.PI * 2 * i) / 20,
      velocity: 2 + Math.random() * 2,
    }))

    setParticles(newParticles)

    // Remove particles after animation
    setTimeout(() => {
      setParticles([])
    }, 1000)
  }

  return (
    <div className="relative mb-8">
      <h1
        onClick={handleClick}
        className="text-7xl font-black text-center cursor-pointer select-none
          bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent
          hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500
          transition-all duration-500 hover:scale-105 active:scale-95
          animate-shimmer bg-[length:200%_100%]"
      >
        LORIFY
      </h1>

      {/* Particle explosion */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-particle-explode pointer-events-none"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            "--particle-angle": `${particle.angle}rad`,
            "--particle-velocity": particle.velocity,
          }}
        />
      ))}
    </div>
  )
}
