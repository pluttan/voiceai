<div align="center">

# voiceai

**Full-duplex AI call center with live browser demo**


</div>

AI-powered call center platform for the Russian market. Features a landing page with an interactive full-duplex voice call demo that visualizes the entire pipeline step by step: VAD, STT, LLM, TTS. The browser captures microphone audio via Web Audio, streams raw PCM16 over a WebSocket, processes speech in real time, and plays back synthesized responses.

## ■ Features

- ❖ **Full-duplex voice** — simultaneous listen + speak via WebSocket audio streaming
- ❖ **Pipeline visualization** — interactive demo showing each stage (VAD -> STT -> LLM -> TTS)
- ❖ **Client-side VAD** — in-browser RMS energy detector gates speech (threshold 0.012)
- ❖ **Streaming STT** — server-side faster-whisper-large-v3 (GPU) for real-time Russian recognition
- ❖ **LLM reasoning** — DeepSeek (`deepseek-chat`) with tool calling generates contextual responses
- ❖ **Tool calling + DB** — find_flights / book_ticket / transfer_to_human / end_call against PostgreSQL bookings
- ❖ **Neural TTS** — OmniVoice (k2-fsa, self-hosted on GPU) with browser SpeechSynthesis fallback
- ❖ **GPU voice server** — separate Docker container (`pluttanru/voiceai-tts`) with STT + TTS on NVIDIA GPU
- ❖ **GSAP animations** — smooth landing page transitions and pipeline step highlighting

## ■ Stack

<div align="center">

| Component | Technology |
|-----------|------------|
| Frontend | React 19 + TypeScript + Vite 8 + GSAP |
| Backend | FastAPI + WebSocket (Python 3.12) |
| VAD | RMS energy detector (client-side) |
| STT | faster-whisper-large-v3 (GPU, streaming) |
| LLM | DeepSeek (`deepseek-chat`, OpenAI-compatible API) |
| TTS | OmniVoice (k2-fsa, GPU) / browser SpeechSynthesis (fallback) |
| Database | PostgreSQL (asyncpg) — flights + bookings |
| GPU server | faster-whisper + OmniVoice in Docker (NVIDIA) |
| Audio | Web Audio / WebSocket (PCM16, 16 kHz mono) |

</div>

## ■ How It Works

```
1. Browser captures microphone audio via Web Audio API (PCM16, 16 kHz mono).
2. Client-side RMS energy detector (VAD, threshold 0.012) gates speech and streams audio chunks over WebSocket to the FastAPI backend.
3. Backend forwards audio to the GPU voice server where faster-whisper-large-v3 performs streaming STT and returns a Russian transcript.
4. Transcript is passed to DeepSeek (deepseek-chat); the LLM generates a response and may invoke tool calls (find_flights, book_ticket, transfer_to_human, end_call) against the PostgreSQL bookings database.
5. The LLM response text is sent to OmniVoice (k2-fsa, GPU) for neural TTS synthesis; the audio is streamed back to the browser for playback.
6. The landing page pipeline visualization highlights each active stage (VAD → STT → LLM → TTS) in real time via GSAP animations.
```

## ■ Screenshots

<div align="center">

![Screenshot](screenshots/main.png)

*Landing page with interactive full-duplex voice call demo and pipeline visualization*

</div>

## ■ Usage

```bash
# Install everything (backend venv + frontend deps)
make install

# Run backend (port 8787)
make dev-back

# Run frontend (port 5173)
make dev-front
```

The backend talks to the GPU voice server over HTTP `/synth` and WS `/stt/stream`
(`TTS_URL` / `STT_WS_URL`); DeepSeek via `DEEPSEEK_API_KEY`; flights DB via `DATABASE_URL`.
For the TTS/STT GPU server, see `tts-server/README.md`.

## ■ Layout

```
frontend/       React + Vite + TypeScript + GSAP landing page
backend/        FastAPI + WebSocket orchestration (LLM, tools, DB, TTS relay)
tts-server/     GPU Docker container (faster-whisper STT + OmniVoice TTS)
```

## ■ License

MIT © [pluttan](https://github.com/pluttan)
