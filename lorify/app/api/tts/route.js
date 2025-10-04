import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export async function POST(req) {
  try {
    const { text, mode } = await req.json();

    if (!text) {
      return new Response("Missing text", { status: 400 });
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      console.error("❌ ELEVENLABS_API_KEY missing");
      return new Response("Server misconfiguration: Missing API key", { status: 500 });
    }

    const client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });

    // 🎭 Pick voices per mode (replace with voices you like!)
    const voicesByMode = {
      savage: "Ybqj6CIlqb6M85s9Bl4n", // Urban
      storytelling: "KTPVrSVAEUSJRClDzBw7", // Cowboy
      therapy: "EXAVITQu4vr4xnSDxMaL", // Calm, soft female
    };

    // Default fallback
    const voiceId = voicesByMode[mode?.toLowerCase()] || voicesByMode.savage;

    console.log(`🎙 Using voice for mode: ${mode || "default"} → ${voiceId}`);

    const response = await client.textToSpeech.convert(voiceId, {
      model_id: "eleven_turbo_v2",
      text,
    });

    // Stream → buffer
    const chunks = [];
    for await (const chunk of response) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    return new Response(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (err) {
    console.error("❌ TTS Error:", err);
    return new Response(`Error generating speech: ${err.message}`, { status: 500 });
  }
}
