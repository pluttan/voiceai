<div align="center">

# voiceai

**Полнодуплексный AI-колл-центр с живым демо в браузере**


</div>

AI-платформа колл-центра для российского рынка. Включает лендинг с интерактивным демо полнодуплексного голосового звонка, которое визуализирует весь пайплайн шаг за шагом: VAD, STT, LLM, TTS. Браузер захватывает аудио с микрофона через Web Audio, передаёт сырой PCM16 по WebSocket, обрабатывает речь в реальном времени и воспроизводит синтезированные ответы.

## ■ Возможности

- ❖ **Полнодуплексный голос** — одновременный приём и передача через WebSocket audio streaming
- ❖ **Визуализация пайплайна** — интерактивное демо с отображением каждого этапа (VAD -> STT -> LLM -> TTS)
- ❖ **VAD на стороне клиента** — детектор энергии RMS в браузере управляет захватом речи (порог 0.012)
- ❖ **Потоковый STT** — faster-whisper-large-v3 на сервере (GPU) для распознавания русской речи в реальном времени
- ❖ **Рассуждения LLM** — DeepSeek (`deepseek-chat`) с вызовом инструментов генерирует контекстные ответы
- ❖ **Вызов инструментов + БД** — find_flights / book_ticket / transfer_to_human / end_call поверх PostgreSQL bookings
- ❖ **Нейронный TTS** — OmniVoice (k2-fsa, self-hosted на GPU) с браузерным SpeechSynthesis в качестве fallback
- ❖ **GPU-сервер голоса** — отдельный Docker-контейнер (`pluttanru/voiceai-tts`) с STT + TTS на NVIDIA GPU
- ❖ **GSAP-анимации** — плавные переходы лендинга и подсветка шагов пайплайна

## ■ Стек

<div align="center">

| Компонент | Технология |
|-----------|------------|
| Frontend | React 19 + TypeScript + Vite 8 + GSAP |
| Backend | FastAPI + WebSocket (Python 3.12) |
| VAD | RMS energy detector (client-side) |
| STT | faster-whisper-large-v3 (GPU, streaming) |
| LLM | DeepSeek (`deepseek-chat`, OpenAI-compatible API) |
| TTS | OmniVoice (k2-fsa, GPU) / browser SpeechSynthesis (fallback) |
| База данных | PostgreSQL (asyncpg) — flights + bookings |
| GPU-сервер | faster-whisper + OmniVoice in Docker (NVIDIA) |
| Аудио | Web Audio / WebSocket (PCM16, 16 kHz mono) |

</div>

## ■ Как это работает

```
1. Браузер захватывает аудио с микрофона через Web Audio API (PCM16, 16 кГц моно).
2. Клиентский детектор энергии RMS (VAD, порог 0.012) управляет захватом речи и передаёт аудио-чанки по WebSocket на бэкенд FastAPI.
3. Бэкенд пересылает аудио на GPU-сервер голоса, где faster-whisper-large-v3 выполняет потоковый STT и возвращает транскрипт на русском.
4. Транскрипт передаётся в DeepSeek (deepseek-chat); LLM генерирует ответ и может вызывать инструменты (find_flights, book_ticket, transfer_to_human, end_call) к PostgreSQL-базе данных бронирований.
5. Текст ответа LLM отправляется в OmniVoice (k2-fsa, GPU) для нейронного синтеза речи; аудио передаётся обратно в браузер для воспроизведения.
6. Визуализация пайплайна на лендинге подсвечивает каждый активный этап (VAD → STT → LLM → TTS) в реальном времени через GSAP-анимации.
```

## ■ Скриншоты

<div align="center">

![Screenshot](screenshots/main.png)

*Лендинг с интерактивным демо полнодуплексного голосового звонка и визуализацией пайплайна*

</div>

## ■ Использование

```bash
# Установить всё (venv бэкенда + зависимости фронтенда)
make install

# Запустить бэкенд (порт 8787)
make dev-back

# Запустить фронтенд (порт 5173)
make dev-front
```

Бэкенд обращается к GPU-серверу голоса по HTTP `/synth` и WS `/stt/stream`
(`TTS_URL` / `STT_WS_URL`); к DeepSeek через `DEEPSEEK_API_KEY`; к БД рейсов через `DATABASE_URL`.
Для TTS/STT GPU-сервера см. `tts-server/README.md`.

## ■ Структура

```
frontend/       React + Vite + TypeScript + GSAP landing page
backend/        FastAPI + WebSocket orchestration (LLM, tools, DB, TTS relay)
tts-server/     GPU Docker container (faster-whisper STT + OmniVoice TTS)
```

## ■ Лицензия

MIT © [pluttan](https://github.com/pluttan)
