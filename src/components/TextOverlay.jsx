import { AnimatePresence, motion } from 'framer-motion'

const arrowVariants = {
  initial: (direction) => ({ opacity: 0, x: direction === 'left' ? -12 : 12 }),
  animate: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction === 'left' ? -12 : 12 }),
}

const poemVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
}

const TextOverlay = ({
  phase,
  index,
  total,
  onNext,
  onPrev,
  canNext,
  canPrev,
  isAudioPlaying,
  onToggleAudio,
}) => {
  const progress = ((index + 1) / total) * 100

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="pointer-events-none absolute inset-0 glass-gradient" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-night/10 to-black/70" />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-5xl items-center justify-between text-xs uppercase tracking-[0.45em] text-white/60">
          <AnimatePresence mode="wait">
            <motion.span
              key={phase.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 0.82, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="font-light"
            >
              {String(index + 1).padStart(2, '0')} · {String(total).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>

          <button
            type="button"
            onClick={onToggleAudio}
            className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/25 bg-white/5 px-5 py-2 text-[0.6rem] font-medium tracking-[0.4em] text-white/80 transition duration-300 hover:border-white/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-pressed={isAudioPlaying}
            aria-label={isAudioPlaying ? 'Silenciar ambiência' : 'Ativar ambiência'}
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              {isAudioPlaying ? (
                <span className="relative flex h-full w-full items-center justify-center">
                  <span className="absolute h-1 w-3 rounded-full bg-white/70" />
                  <span className="absolute h-1.5 w-1 rounded-full bg-white/80" />
                  <span className="absolute h-4 w-4 rounded-full border border-white/50" />
                </span>
              ) : (
                <span className="relative flex h-full w-full items-center justify-center">
                  <span className="absolute h-1 w-3 -translate-x-1 rounded-full bg-white/60" />
                  <span className="absolute h-3 w-[1px] translate-x-1.5 bg-white/70" />
                  <span className="absolute h-3 w-[1px] -translate-x-1.5 rotate-45 bg-white/70" />
                </span>
              )}
            </span>
            {isAudioPlaying ? 'SOM' : 'SILÊNCIO'}
          </button>
        </div>

        <div className="relative mt-12 flex w-full max-w-5xl items-center justify-between">
          <AnimatePresence initial={false} custom="left">
            {canPrev && (
              <motion.button
                key="prev"
                type="button"
                onClick={onPrev}
                custom="left"
                variants={arrowVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/20 backdrop-blur-sm transition duration-300 hover:border-white/40 hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-label="Fase anterior"
              >
                <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.5 1.5L2.5 5.75L8.5 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 5.75H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          <div className="pointer-events-none flex-1 px-6 text-center md:px-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase.id}
                variants={poemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="space-y-6"
              >
                <motion.p
                  className="text-xs uppercase tracking-[0.6em] text-white/50"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                >
                  {phase.tagline}
                </motion.p>
                <motion.h1
                  className="bg-gradient-to-r from-white via-white to-[var(--accent-color)] bg-clip-text text-4xl font-serif uppercase tracking-[0.2em] text-transparent drop-shadow-md md:text-6xl"
                  style={{ '--accent-color': phase.accent }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                >
                  {phase.title}
                </motion.h1>
                <motion.p
                  className="mx-auto max-w-2xl whitespace-pre-line text-sm font-light leading-relaxed text-white/80 md:text-lg"
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                >
                  {phase.poem}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence initial={false} custom="right">
            {canNext && (
              <motion.button
                key="next"
                type="button"
                onClick={onNext}
                custom="right"
                variants={arrowVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/20 backdrop-blur-sm transition duration-300 hover:border-white/40 hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-label="Próxima fase"
              >
                <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.5 1.5L19.5 5.75L13.5 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 5.75H2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-14 w-full max-w-5xl">
          <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.5em] text-white/50">
            <span className="pulse-soft">Scroll ou use as setas</span>
            <span className="text-white/60">Fase {index + 1}</span>
          </div>
          <div className="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-white via-white to-[var(--accent-color)]"
              style={{ width: `${progress}%`, '--accent-color': phase.accent }}
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextOverlay
