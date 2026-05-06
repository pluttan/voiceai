from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware


# ==========================
# === Lifecycle           ===
# ==========================

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title="voiceai-backend", lifespan=lifespan)

# Dev-only: tighten before prod.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================
# === Health              ===
# ==========================

@app.get("/health")
async def health():
    return {"status": "ok"}


# ==========================
# === Voice WS (stub)     ===
# ==========================

# Will host the duplex audio pipeline:
#   client mic -> VAD -> STT (Yandex SpeechKit v3) ->
#   LLM (DeepSeek V4) -> TTS (OmniVoice / Yandex) -> client speaker.
# For now: echoes JSON control frames so the frontend can wire its UI.

@app.websocket("/ws/call")
async def ws_call(ws: WebSocket):
    await ws.accept()
    await ws.send_json({"event": "ready"})
    try:
        while True:
            msg = await ws.receive_json()
            await ws.send_json({"event": "echo", "payload": msg})
    except WebSocketDisconnect:
        return
