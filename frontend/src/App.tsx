import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './App.css'

type Stage = 'mic' | 'vad' | 'stt' | 'llm' | 'tts' | 'audio'

const STAGES: { id: Stage; label: string; sub: string }[] = [
  { id: 'mic', label: 'Микрофон', sub: 'захват аудио' },
  { id: 'vad', label: 'VAD', sub: 'детект речи' },
  { id: 'stt', label: 'STT', sub: 'распознавание' },
  { id: 'llm', label: 'LLM', sub: 'DeepSeek V4' },
  { id: 'tts', label: 'TTS', sub: 'OmniVoice' },
  { id: 'audio', label: 'Динамик', sub: 'воспроизведение' },
]

function App() {
  const [active, setActive] = useState<Stage | null>(null)
  const [calling, setCalling] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const stagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero h1', { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out' })
      gsap.from('.hero p', { y: 16, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power3.out' })
      gsap.from('.hero .cta', { y: 16, opacity: 0, duration: 0.6, delay: 0.3, ease: 'power3.out' })
      gsap.from('.stage', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        delay: 0.4,
        stagger: 0.08,
        ease: 'power2.out',
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!active) return
    const el = stagesRef.current?.querySelector(`[data-stage="${active}"]`)
    if (!el) return
    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    tl.to(el, { scale: 1.04, duration: 0.6, ease: 'sine.inOut' })
    return () => {
      tl.kill()
      gsap.set(el, { scale: 1 })
    }
  }, [active])

  const startDemo = () => {
    setCalling(true)
    let i = 0
    setActive(STAGES[0].id)
    const timer = setInterval(() => {
      i += 1
      if (i >= STAGES.length) {
        clearInterval(timer)
        setActive(null)
        setCalling(false)
        return
      }
      setActive(STAGES[i].id)
    }, 900)
  }

  return (
    <div ref={heroRef} className="root">
      <header className="topbar">
        <div className="brand">voiceai</div>
        <nav className="nav">
          <a href="#demo">Демо</a>
          <a href="#how">Как работает</a>
          <a href="#pricing">Цены</a>
        </nav>
      </header>

      <section className="hero">
        <h1>
          AI колл-центр,<br />
          который звучит как человек
        </h1>
        <p>
          Голосовой агент на DeepSeek V4 принимает звонки, ведёт диалог и
          закрывает заявки 24/7. Без скриптов из 90-х.
        </p>
        <button className="cta" disabled={calling} onClick={startDemo}>
          {calling ? 'звонок идёт...' : 'позвонить демо'}
        </button>
      </section>

      <section id="demo" className="demo">
        <h2>Что происходит во время звонка</h2>
        <div ref={stagesRef} className="pipeline">
          {STAGES.map((s) => (
            <div
              key={s.id}
              data-stage={s.id}
              className={`stage ${active === s.id ? 'active' : ''}`}
            >
              <div className="stage-label">{s.label}</div>
              <div className="stage-sub">{s.sub}</div>
            </div>
          ))}
        </div>
        <div className="transcript">
          <div className="transcript-line muted">
            {calling ? 'идёт обработка...' : 'нажми «позвонить демо», чтобы запустить пайплайн'}
          </div>
        </div>
      </section>

      <footer className="foot">
        <span>pluttan, 2026</span>
        <span>Россия</span>
      </footer>
    </div>
  )
}

export default App
