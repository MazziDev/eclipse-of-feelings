import { Canvas } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Scene from './components/Scene'
import TextOverlay from './components/TextOverlay'
import './App.css'

const PHASES = [
  {
    id: 'lua-nova',
    title: 'Lua Nova',
    tagline: 'Quando o primeiro respiro encontra eco.',
    poem: [
      'No silêncio da órbita,',
      'duas marés aguardam fôlego,',
      'promessa de encontro lento,',
      'constelações guardam o segredo.',
    ].join('\n'),
    leftPosition: [-8, 1.4, -6],
    rightPosition: [8, -1.4, -6],
    background: '#050316',
    accent: '#2d3f9d',
    lightIntensity: 0.8,
    ambientIntensity: 0.28,
    glow: 0.8,
    halo: 0.38,
    starSpeed: 0.04,
    bloom: 0.6,
  },
  {
    id: 'crescente',
    title: 'Crescente',
    tagline: 'Órbitas se alinham ao compasso do pulso.',
    poem: [
      'Traços de prata despertam,',
      'marés em voz baixa sussurram,',
      'o vazio já não assusta,',
      'o horizonte aprende teu nome.',
    ].join('\n'),
    leftPosition: [-5.6, 1, -5.2],
    rightPosition: [5.6, -1, -5.2],
    background: '#060720',
    accent: '#3d4fcb',
    lightIntensity: 1.1,
    ambientIntensity: 0.38,
    glow: 0.95,
    halo: 0.46,
    starSpeed: 0.06,
    bloom: 0.74,
  },
  {
    id: 'quarto',
    title: 'Quarto Crescente',
    tagline: 'Metade luz, metade promessa.',
    poem: [
      'Metade luz, metade mistério,',
      'linha orbital escrita em verso,',
      'cada passo um cometa discreto,',
      'a noite curva para sentir.',
    ].join('\n'),
    leftPosition: [-3.3, 0.7, -4.4],
    rightPosition: [3.3, -0.7, -4.4],
    background: '#07092b',
    accent: '#5144d8',
    lightIntensity: 1.4,
    ambientIntensity: 0.48,
    glow: 1.18,
    halo: 0.6,
    starSpeed: 0.08,
    bloom: 0.88,
  },
  {
    id: 'gibosa',
    title: 'Gibosa',
    tagline: 'Quase toque, quase aurora.',
    poem: [
      'A luz goteja devagar,',
      'teus contornos orbitam a pele,',
      'vento solar penteia o vazio,',
      'prelúdio de eclipse no olhar.',
    ].join('\n'),
    leftPosition: [-1.6, 0.35, -3.6],
    rightPosition: [1.6, -0.35, -3.6],
    background: '#090b33',
    accent: '#6b4bd1',
    lightIntensity: 1.6,
    ambientIntensity: 0.58,
    glow: 1.48,
    halo: 0.74,
    starSpeed: 0.1,
    bloom: 1.08,
  },
  {
    id: 'eclipse',
    title: 'Eclipse Total',
    tagline: 'Dois brilhos na mesma órbita.',
    poem: [
      'O encontro risca o infinito,',
      'um só halo respira no escuro,',
      'partículas dançam teu nome,',
      'amor é sombra que ilumina.',
    ].join('\n'),
    leftPosition: [-0.4, 0.18, -3.1],
    rightPosition: [0.4, -0.18, -3.1],
    background: '#0a0b3b',
    accent: '#9b7bff',
    lightIntensity: 1.9,
    ambientIntensity: 0.7,
    glow: 1.9,
    halo: 0.9,
    starSpeed: 0.12,
    bloom: 1.32,
  },
]

const buildAmbientBuffer = (duration = 10, sampleRate = 44100) => {
  const length = duration * sampleRate
  const samples = new Float32Array(length)

  for (let i = 0; i < length; i += 1) {
    const t = i / sampleRate
    const lowPulse = Math.sin(2 * Math.PI * 0.12 * t) * 0.3
    const shimmer = Math.sin(2 * Math.PI * (110 + Math.sin(t * 0.27) * 6) * t) * 0.35
    const overtone = Math.sin(2 * Math.PI * (220 + Math.sin(t * 0.15) * 12) * t + Math.sin(t * 0.1)) * 0.14
    const breath = Math.sin(2 * Math.PI * 0.05 * t) * 0.2 + 0.4
    samples[i] = (lowPulse + shimmer + overtone) * breath * 0.45
  }

  const buffer = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(buffer)
  let offset = 0

  const writeString = (text) => {
    for (let i = 0; i < text.length; i += 1) {
      view.setUint8(offset + i, text.charCodeAt(i))
    }
    offset += text.length
  }

  writeString('RIFF')
  view.setUint32(offset, 36 + samples.length * 2, true)
  offset += 4
  writeString('WAVE')
  writeString('fmt ')
  view.setUint32(offset, 16, true)
  offset += 4
  view.setUint16(offset, 1, true)
  offset += 2
  view.setUint16(offset, 1, true)
  offset += 2
  view.setUint32(offset, sampleRate, true)
  offset += 4
  view.setUint32(offset, sampleRate * 2, true)
  offset += 4
  view.setUint16(offset, 2, true)
  offset += 2
  view.setUint16(offset, 16, true)
  offset += 2
  writeString('data')
  view.setUint32(offset, samples.length * 2, true)
  offset += 4

  for (let i = 0; i < samples.length; i += 1) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    offset += 2
  }

  return buffer
}

const createAmbientAudio = () => {
  const wavBuffer = buildAmbientBuffer()
  const blob = new Blob([wavBuffer], { type: 'audio/wav' })
  const url = URL.createObjectURL(blob)
  const audio = new Audio(url)
  audio.loop = true
  audio.volume = 0.2
  audio.preload = 'auto'
  return { audio, url }
}

function App() {
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const audioRef = useRef(null)
  const scrollLockRef = useRef(false)

  const phases = useMemo(() => PHASES, [])
  const currentPhase = phases[phaseIndex]

  useEffect(() => {
    const ambient = createAmbientAudio()
    audioRef.current = ambient

    return () => {
      if (ambient.audio) {
        ambient.audio.pause()
      }
      if (ambient.url) {
        URL.revokeObjectURL(ambient.url)
      }
    }
  }, [])

  const goToPhase = useCallback((direction) => {
    setPhaseIndex((prev) => {
      const next = prev + direction
      if (next < 0 || next >= phases.length) {
        return prev
      }
      return next
    })
  }, [phases.length])

  const handleNext = useCallback(() => {
    goToPhase(1)
  }, [goToPhase])

  const handlePrev = useCallback(() => {
    goToPhase(-1)
  }, [goToPhase])

  const toggleAudio = useCallback(() => {
    const ambient = audioRef.current
    if (!ambient?.audio) {
      return
    }

    setIsAudioPlaying((playing) => {
      if (playing) {
        gsap.to(ambient.audio, {
          volume: 0,
          duration: 1.6,
          ease: 'sine.inOut',
          onComplete: () => ambient.audio.pause(),
        })
        return false
      }

      ambient.audio.volume = 0
      ambient.audio.play().catch(() => {})
      gsap.to(ambient.audio, {
        volume: Math.min(0.75, 0.24 + phaseIndex * 0.12),
        duration: 2.1,
        ease: 'sine.inOut',
      })
      return true
    })
  }, [phaseIndex])

  useEffect(() => {
    if (!isAudioPlaying || !audioRef.current?.audio) {
      return
    }
    const targetVolume = Math.min(0.75, 0.24 + phaseIndex * 0.12)
    gsap.to(audioRef.current.audio, {
      volume: targetVolume,
      duration: 2.2,
      ease: 'sine.inOut',
    })
  }, [phaseIndex, isAudioPlaying])

  useEffect(() => {
    const onWheel = (event) => {
      if (Math.abs(event.deltaY) < 20) {
        return
      }
      if (scrollLockRef.current) {
        return
      }
      scrollLockRef.current = true
      if (event.deltaY > 0) {
        handleNext()
      } else {
        handlePrev()
      }
      setTimeout(() => {
        scrollLockRef.current = false
      }, 1300)
    }

    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        handleNext()
      }
      if (event.key === 'ArrowLeft') {
        handlePrev()
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [handleNext, handlePrev])

  const canPrev = phaseIndex > 0
  const canNext = phaseIndex < phases.length - 1

  return (
    <div className="relative h-full w-full overflow-hidden bg-night">
      <Canvas
        shadows
        camera={{ position: [0, 0, 12], fov: 44 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Scene phase={currentPhase} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      <TextOverlay
        phase={currentPhase}
        index={phaseIndex}
        total={phases.length}
        onNext={handleNext}
        onPrev={handlePrev}
        canNext={canNext}
        canPrev={canPrev}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={toggleAudio}
      />
    </div>
  )
}

export default App
