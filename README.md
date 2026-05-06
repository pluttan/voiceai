# voiceai

AI колл-центр для русского рынка. Лендинг + интерактивное демо звонка с пошаговым показом pipeline (VAD → STT → LLM → TTS).

## Stack

- **frontend** — React 19 + Vite 6 + GSAP, WebRTC/WebSocket для аудио
- **backend** — FastAPI + WebSocket, оркестрация duplex-разговора
- **STT** — Yandex SpeechKit v3 (streaming)
- **LLM** — DeepSeek V4 (через прокси)
- **TTS** — OmniVoice (k2-fsa, self-host на GPU) / Yandex SpeechKit (fallback)
- **VAD** — Silero на клиенте

## Layout

```
voiceai/
├── frontend/      # Vite + React + TS + GSAP
├── backend/       # FastAPI + python3.12
└── docs/          # архитектура, заметки
```

## Quickstart

```sh
make install        # backend venv + frontend npm
make dev-back       # uvicorn :8787
make dev-front      # vite :5173
```

## Author

pluttan <pluttan@ya.ru>
