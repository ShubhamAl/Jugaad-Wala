import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Play, RotateCcw, Zap, Wrench, Volume2, VolumeX, HelpCircle, X } from 'lucide-react'
import './App.css'
import { audioManager } from './utils/audioManager'

type GamePhase = 'TITLE' | 'COUNTER_DIALOGUE' | 'WORKSHOP_LOADING' | 'WORKSHOP_PUZZLE' | 'TESTING' | 'VERDICT'
type DrawerId = 'toolbox' | 'consumables' | 'jugaad' | null
type HeldTool = 'screwdriver' | 'tape' | 'comb' | null
type TestResult = 'success' | 'shortCircuit' | 'bladeMissile' | 'rattle' | null

interface RepairState {
  removedClips: ('top' | 'left' | 'right')[]
  screwsRemoved: boolean
  grilleDetached: boolean
  combsAttached: number
  hubTaped: boolean
  wireTaped: boolean
  grilleReattached: boolean
}

const ASSETS = {
  counter: '/background/counter_bg.png.png',
  workshop: '/workshop/workshop_bg.png.png',
  toolbox: '/workshop/toolbox_closed.png.png',
  consumables: '/workshop/consumables_tray.png.png',
  jugaadBox: '/workshop/jugaad_box.png.png',
  fanBody: '/fan/fan_body_naked.png.png',
  fanGrille: '/fan/fan_front_grille.png.png',
  grilleScrews: '/fan/grille_screws.png.png',
  comb: '/fan/comb_blade.png',
  wireTape: '/fan/tape_patch_wire.png.png',
  hubTape: '/fan/tape_center_hub.png.png',
  rahulDistressed: '/rahul/rahul_distressed.png.png',
  rahulPleading: '/rahul/rahul_pleading.png.png',
  rahulHappy: '/rahul/rahul_happy.png.png',
  rahulAngry: '/rahul/rahul_angry.png.png',
} as const

const makeRepairState = (): RepairState => ({
  removedClips: [],
  screwsRemoved: false,
  grilleDetached: false,
  combsAttached: 0,
  hubTaped: false,
  wireTaped: false,
  grilleReattached: false,
})

const dialogue = [
  {
    text: 'Bhaiya, yeh fan kal tak toh full hawa deta tha. Ab wire bhi kat gaya aur pankha bilkul nakhre kar raha hai!',
    caption: 'RAHUL ARRIVES WITH A FAN THAT HAS SEEN BETTER DAYS.',
  },
  {
    text: 'Original blade mat lagana please. Budget tight hai… kuch solid jugaad karo na!',
    caption: 'A MODEST REQUEST. A GLORIOUS OPPORTUNITY.',
  },
]

const MAIN_MENU_TRACK = encodeURI('/music/main menu.mp3')

const WORKBENCH_TRACKS = [
  {
    id: 1,
    name: 'Lohe Ka Sunehra Saaz',
    src: '/music/workplace/Lohe_Ka_Sunehra_Saaz.mp3',
  },
  {
    id: 2,
    name: 'Aala Re Aala Jugaad Aala',
    src: encodeURI('/music/workplace/आला_रे_आला_जुगाड_आला.mp3'),
  },
]

const MUSIC_NOTES = ['♪', '♫', '♬', '♩']

// Animated Music Note Component
function FloatingNotes() {
  return (
    <div className="pointer-events-none absolute -top-8 left-1/3 w-16 h-20 overflow-visible z-20">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10, x: 0, scale: 0.7 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [-5, -35, -55],
            x: [0, (i % 2 === 0 ? 8 : -8), (i % 2 === 0 ? 14 : -14)],
            scale: [0.7, 1.1, 0.9],
            rotate: [0, (i % 2 === 0 ? 12 : -12)]
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            delay: i * 0.75,
            ease: "easeOut"
          }}
          className="absolute font-black text-amber-900 drop-shadow-[1px_1px_0px_rgba(255,255,255,0.8)] text-base select-none"
        >
          {MUSIC_NOTES[i % MUSIC_NOTES.length]}
        </motion.span>
      ))}
    </div>
  )
}

const panelMotion = {
  initial: { opacity: 0, scale: 0.98, y: 14 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 1.01, y: -10 },
}

export function App() {
  const [phase, setPhase] = useState<GamePhase>('TITLE')
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [repair, setRepair] = useState<RepairState>(makeRepairState)
  const [drawer, setDrawer] = useState<DrawerId>(null)
  const [heldTool, setHeldTool] = useState<HeldTool>(null)
  const [feedback, setFeedback] = useState('First job: open the fan and inspect its secrets.')
  const [testResult, setTestResult] = useState<TestResult>(null)
  const [musicOn, setMusicOn] = useState(() => audioManager.getMusicEnabled())
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [stationToast, setStationToast] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)
  const stationToastTimerRef = useRef<number | null>(null)
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null)

  const isWorkbench = phase === 'WORKSHOP_PUZZLE' || phase === 'TESTING' || phase === 'VERDICT' || phase === 'WORKSHOP_LOADING'
  const activeTrackSrc = isWorkbench ? WORKBENCH_TRACKS[currentTrackIndex].src : MAIN_MENU_TRACK

  const isPlaying = musicOn
  const isMuted = !musicOn

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    if (stationToastTimerRef.current !== null) window.clearTimeout(stationToastTimerRef.current)
  }, [])

  useEffect(() => {
    const audio = bgmAudioRef.current
    if (!audio) return
    const targetUrl = new URL(activeTrackSrc, window.location.origin).href
    if (audio.src !== targetUrl) {
      audio.src = activeTrackSrc
    }
    if (musicOn) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [activeTrackSrc, musicOn])

  useEffect(() => {
    const startBgmOnGesture = () => {
      const audio = bgmAudioRef.current
      if (musicOn && audio) {
        const targetUrl = new URL(activeTrackSrc, window.location.origin).href
        if (audio.src !== targetUrl) {
          audio.src = activeTrackSrc
        }
        audio.play().catch(() => {})
      }
    }
    window.addEventListener('click', startBgmOnGesture, { once: true })
    return () => {
      window.removeEventListener('click', startBgmOnGesture)
    }
  }, [musicOn, activeTrackSrc])

  const handleToggleMusic = () => {
    const next = !musicOn
    audioManager.setMusicEnabled(next)
    setMusicOn(next)
    audioManager.play('button')
  }

  const handleRadioClick = () => {
    const nextIndex = (currentTrackIndex + 1) % WORKBENCH_TRACKS.length
    setCurrentTrackIndex(nextIndex)

    if (!musicOn) {
      audioManager.setMusicEnabled(true)
      setMusicOn(true)
    }

    const nextTrack = WORKBENCH_TRACKS[nextIndex]
    if (bgmAudioRef.current) {
      bgmAudioRef.current.src = nextTrack.src
      bgmAudioRef.current.play().catch(() => {})
    }

    setStationToast(nextTrack.name)
    if (stationToastTimerRef.current !== null) {
      window.clearTimeout(stationToastTimerRef.current)
    }
    stationToastTimerRef.current = window.setTimeout(() => {
      setStationToast(null)
    }, 1500)

    audioManager.play('button')
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && heldTool) {
        setHeldTool(null)
        setDrawer(null)
        setFeedback('Tool put back on the bench. Choose another item when you are ready.')
        audioManager.play('button')
      }
    }
    const handleContextMenu = (e: MouseEvent) => {
      if (heldTool) {
        e.preventDefault()
        setHeldTool(null)
        setDrawer(null)
        setFeedback('Tool put back on the bench. Choose another item when you are ready.')
        audioManager.play('button')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('contextmenu', handleContextMenu)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [heldTool])

  const selectTool = (tool: Exclude<HeldTool, null>) => {
    setHeldTool(tool)
    setDrawer(null)
    audioManager.play('tool')
    const names = { screwdriver: 'Screwdriver', tape: 'Black insulation tape', comb: 'Plastic comb' }
    setFeedback(`Holding: ${names[tool]}. Now click the matching part of the fan.`)
  }

  const unequipTool = () => {
    setHeldTool(null)
    setDrawer(null)
    setFeedback('Tool put back on the bench. Choose another item when you are ready.')
    audioManager.play('button')
  }

  const openDrawer = (nextDrawer: Exclude<DrawerId, null>) => {
    setDrawer((current) => current === nextDrawer ? null : nextDrawer)
    audioManager.play('button')
  }

  const removeClip = (clip: 'top' | 'left' | 'right') => {
    if (repair.removedClips.includes(clip)) return
    if (heldTool !== 'screwdriver') {
      setFeedback('Those clips need the screwdriver. Open the red toolbox first!')
      audioManager.play('button')
      return
    }
    const nextRemoved = [...repair.removedClips, clip]
    const allDone = nextRemoved.length === 3
    setRepair((current) => ({
      ...current,
      removedClips: nextRemoved,
      screwsRemoved: allDone,
    }))
    audioManager.play('tool')
    if (allDone) {
      setFeedback('All 3 retaining clips removed! Click the front grille to lift it off.')
    } else {
      setFeedback(`Clip removed (${nextRemoved.length}/3). Unscrew the remaining clips.`)
    }
  }

  const toggleGrille = () => {
    if (!repair.screwsRemoved) {
      const remaining = 3 - repair.removedClips.length
      setFeedback(`The grille is still clipped shut (${remaining} left). Remove all screws first.`)
      return
    }
    if (!repair.grilleDetached) {
      setRepair((current) => ({ ...current, grilleDetached: true, grilleReattached: false }))
      setFeedback('Grille off! The naked motor shaft is ready for three comb blades.')
      audioManager.play('whoosh')
      return
    }
    if (repair.combsAttached < 3 || !repair.hubTaped) {
      setFeedback('Not yet — lock all three comb blades at the center before closing it up.')
      return
    }
    setRepair((current) => ({ ...current, grilleDetached: false, grilleReattached: true }))
    setFeedback('Safety grille reattached. It is ready for a dramatic test.')
    audioManager.play('repair')
  }

  const attachComb = () => {
    if (!repair.grilleDetached) {
      setFeedback('The front grille is in the way. Remove its clips and lift it off first.')
      return
    }
    if (repair.combsAttached >= 3 && heldTool === 'tape' && !repair.hubTaped) {
      tapeHub()
      return
    }
    if (heldTool !== 'comb') {
      setFeedback('A comb blade belongs on the rotor peg. Pick one from the jugaad box.')
      return
    }
    if (repair.combsAttached >= 3) {
      setFeedback('All three comb blades are in place. Tape the center hub tight!')
      return
    }
    const nextCount = repair.combsAttached + 1
    setRepair((current) => ({ ...current, combsAttached: nextCount }))
    setFeedback(`Plastic comb blade ${nextCount}/3 attached. ${nextCount === 3 ? 'Now lock the hub with tape.' : 'Keep going!'}`)
    audioManager.play('repair')
  }

  const tapeHub = () => {
    if (!repair.grilleDetached) {
      setFeedback('Remove the grille before taping the rotor hub.')
      return
    }
    if (repair.combsAttached < 3) {
      if (heldTool === 'comb') {
        attachComb()
        return
      }
      setFeedback('The hub has nothing to lock yet — attach all three comb blades.')
      return
    }
    if (heldTool !== 'tape') {
      setFeedback('The hub needs a generous wrap of black insulation tape.')
      return
    }
    if (!repair.hubTaped) {
      setRepair((current) => ({ ...current, hubTaped: true }))
      setFeedback('Hub sealed. Those comb blades are now officially “engineering.”')
      audioManager.play('repair')
    }
  }

  const tapeWire = () => {
    if (heldTool !== 'tape') {
      setFeedback('Exposed wire! Pick black insulation tape from the consumables tray.')
      return
    }
    if (!repair.wireTaped) {
      setRepair((current) => ({ ...current, wireTaped: true }))
      setFeedback('Wire joint insulated. Electrocution has been rescheduled.')
      audioManager.play('repair')
    }
  }

  const startTest = () => {
    let result: Exclude<TestResult, null>
    if (!repair.wireTaped) result = 'shortCircuit'
    else if (repair.combsAttached === 3 && repair.hubTaped) result = 'success'
    else if (repair.combsAttached > 0 && !repair.hubTaped) result = 'bladeMissile'
    else result = 'rattle'

    setHeldTool(null)
    setDrawer(null)
    setTestResult(result)
    setPhase('TESTING')
    audioManager.play(result === 'success' ? 'success' : result === 'shortCircuit' ? 'spark' : 'failure')
    timerRef.current = window.setTimeout(() => setPhase('VERDICT'), result === 'success' ? 1700 : 1450)
  }

  const resetWorkshop = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    setRepair(makeRepairState())
    setDrawer(null)
    setHeldTool(null)
    setTestResult(null)
    setFeedback('Fresh start. Remove the grille, build the rotor, then insulate the wire.')
  }

  const enterWorkshop = () => {
    resetWorkshop()
    setPhase('WORKSHOP_LOADING')
    audioManager.play('button')
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setPhase('WORKSHOP_PUZZLE')
      audioManager.play('repair')
    }, 1300)
  }

  const returnToTitle = () => {
    resetWorkshop()
    setDialogueIndex(0)
    setPhase('TITLE')
  }

  const isSuccessful = testResult === 'success'

  return (
    <main className="app-shell">
      <audio
        ref={bgmAudioRef}
        src={activeTrackSrc}
        loop
        preload="auto"
      />
      <div className="comic-stage" aria-live="polite">
        <AnimatePresence mode="wait">
          {phase === 'TITLE' && (
            <motion.section key="title" className="scene title-scene" {...panelMotion}>
              <img className="scene-background" src={ASSETS.counter} alt="Shri Ganesh Electronics repair shop" />
              <div className="sepia-overlay" />
              <div className="halftone-overlay" />
              <motion.div
                className="title-card"
                initial={{ opacity: 0, x: '-50%', y: '-50%', rotate: -5, scale: 0.86 }}
                animate={{ opacity: 1, x: '-50%', y: '-50%', rotate: -1.5, scale: 1 }}
                transition={{ type: 'spring', stiffness: 180, damping: 15, delay: 0.16 }}
              >
                {/* Top-Right Corner Controls: Music ON/OFF */}
                <div className="title-corner-controls">
                  <button
                    className={`comic-icon-btn ${musicOn ? 'music-active' : 'music-muted'}`}
                    type="button"
                    onClick={handleToggleMusic}
                    aria-label={musicOn ? 'Mute background music' : 'Play background music'}
                    title={musicOn ? 'Music: ON (Click to Mute)' : 'Music: OFF (Click to Play)'}
                  >
                    {musicOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    <span>{musicOn ? 'MUSIC ON' : 'MUSIC OFF'}</span>
                  </button>
                </div>

                <p className="eyebrow-stamp">EST. 2004 • FIXED WITH FAITH & TAPE</p>
                <h1><span>JUGAAD</span><strong>REPAIR SHOP</strong></h1>
                <p className="title-subtitle">Shri Ganesh Electronics — <em>Yahan Sab Theek Hota Hai!</em></p>

                <div className="title-actions">
                  <button
                    className="stamp-button start-button"
                    type="button"
                    onClick={() => {
                      setPhase('COUNTER_DIALOGUE')
                      audioManager.play('button')
                      if (musicOn && bgmAudioRef.current) {
                        bgmAudioRef.current.play().catch(() => {})
                      }
                    }}
                  >
                    <Play size={22} fill="currentColor" /> START REPAIR <span aria-hidden="true">🔧</span>
                  </button>
                  <button
                    className="stamp-button how-to-play-button"
                    type="button"
                    onClick={() => {
                      setShowHowToPlay(true)
                      audioManager.play('button')
                    }}
                  >
                    <HelpCircle size={20} /> HOW TO PLAY <span aria-hidden="true">💡</span>
                  </button>
                </div>
              </motion.div>
              <div className="corner-caption title-caption">BROKEN APPLIANCES. ZERO ORIGINAL PARTS. 100% ASLI JUGAAD!</div>
            </motion.section>
          )}

          {phase === 'COUNTER_DIALOGUE' && (
            <motion.section key="counter" className="scene counter-scene" {...panelMotion}>
              <img className="scene-background" src={ASSETS.counter} alt="Inside Shri Ganesh Electronics" />
              <div className="counter-vignette" />
              <div className="chapter-tag">LEVEL 01 <span>•</span> THE BARGAIN BREEZE</div>

              <motion.img
                key={dialogueIndex}
                className="rahul-portrait counter-rahul opacity-100 absolute -bottom-[8%] left-6 h-[82%] max-h-[540px] object-contain pointer-events-none z-3"
                src={dialogueIndex === 0 ? ASSETS.rahulDistressed : ASSETS.rahulPleading}
                alt="Rahul holding his broken fan"
                initial={{ opacity: 0, x: -36, rotate: -3 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 170, damping: 18 }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={dialogueIndex}
                  className="speech-bubble counter-bubble"
                  initial={{ opacity: 0, scale: 0.82, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 19 }}
                >
                  <span className="speech-label">RAHUL SAYS</span>
                  <p>“{dialogue[dialogueIndex].text}”</p>
                  <small>{dialogue[dialogueIndex].caption}</small>
                </motion.div>
              </AnimatePresence>

              <div className="counter-controls">
                <div className="comic-dots" aria-label={`Dialogue panel ${dialogueIndex + 1} of ${dialogue.length}`}>
                  {dialogue.map((_, index) => <i key={index} className={index === dialogueIndex ? 'active' : ''} />)}
                </div>
                {dialogueIndex < dialogue.length - 1 ? (
                  <button className="stamp-button" type="button" onClick={() => { setDialogueIndex(1); audioManager.play('button') }}>
                    NEXT PANEL <ArrowRight size={20} />
                  </button>
                ) : (
                  <button className="stamp-button green-button" type="button" onClick={enterWorkshop}>
                    <Wrench size={21} /> TAKE IT TO THE BENCH
                  </button>
                )}
              </div>
            </motion.section>
          )}

          {phase === 'WORKSHOP_LOADING' && (
            <motion.section key="loading" className="scene loading-scene" {...panelMotion}>
              <img className="scene-background" src={ASSETS.workshop} alt="Workshop background" />
              <div className="counter-vignette !block !bg-black/30" />

              <motion.div
                className="loading-card"
                initial={{ opacity: 0, scale: 0.86, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -10 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              >
                <div className="eyebrow-stamp !bg-amber-400 !text-black !transform-none mb-2">
                  JUGAAD GARAGE · WORKBENCH
                </div>
                <h2 className="loading-title">LOADING WORKBENCH...</h2>
                <p className="loading-subtitle">
                  Chhotu is clearing the bench & preparing the plastic combs.
                </p>

                <div className="loading-icon-wrapper">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
                    className="inline-block"
                  >
                    <Wrench size={36} className="text-amber-500 stroke-[2.5]" />
                  </motion.div>
                </div>

                <div className="comic-progress-track">
                  <motion.div
                    className="comic-progress-fill"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.25, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>

              <div className="corner-caption title-caption">
                PREPARING REPAIR STATION 01...
              </div>
            </motion.section>
          )}

          {(phase === 'WORKSHOP_PUZZLE' || phase === 'TESTING') && (
            <motion.section
              key="workshop"
              className={`scene workshop-scene ${heldTool ? `cursor-${heldTool}` : ''} ${phase === 'TESTING' ? 'is-testing' : ''} ${testResult ? `test-${testResult}` : ''}`}
              {...panelMotion}
            >
              <img className="scene-background" src={ASSETS.workshop} alt="Vintage electronics workshop workbench" />
              <div className="workshop-tint" />

              {/* Compact Click Hitbox Over Vintage Desk Radio */}
              <div 
                className="absolute z-20"
                style={{
                  top: '18%',
                  right: '7%',
                  width: '16%',
                  height: '20%',
                }}
              >
                {/* Floating notes only visible while music plays */}
                {isPlaying && !isMuted && <FloatingNotes />}

                {/* Radio Click Area */}
                <button
                  type="button"
                  onClick={handleRadioClick}
                  title="Tune Radio Station"
                  className="w-full h-full cursor-pointer focus:outline-none rounded-lg border-2 border-transparent hover:border-amber-400/40 hover:bg-amber-300/10 transition-colors active:scale-95"
                  aria-label="Tune Radio"
                />

                {/* Quick Station Badge on Tune */}
                <AnimatePresence>
                  {stationToast && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.85 }}
                      animate={{ opacity: 1, y: -16, scale: 1 }}
                      exit={{ opacity: 0, y: -26 }}
                      transition={{ duration: 0.2 }}
                      className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-100 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] text-[10px] font-black uppercase text-black tracking-wide whitespace-nowrap z-30 select-none font-['Bangers']"
                    >
                      📻 {stationToast}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <header className="workshop-header">
                <div><span className="chapter-tag">WORKBENCH 01</span><h2>THE COMB-BLADE SPECIAL</h2></div>
                <div className="workshop-tools-header">
                  <button
                    className={`workshop-header-btn ${musicOn ? 'is-active' : 'is-muted'}`}
                    type="button"
                    onClick={handleToggleMusic}
                    title={musicOn ? 'Music: ON (Click to Mute)' : 'Music: OFF (Click to Play)'}
                    aria-label="Toggle background music"
                  >
                    {musicOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>
                  <button
                    className="workshop-header-btn"
                    type="button"
                    onClick={() => {
                      setShowHowToPlay(true)
                      audioManager.play('button')
                    }}
                    title="How to Play"
                    aria-label="How to Play"
                  >
                    <HelpCircle size={16} />
                  </button>
                  <div className={`repair-meter ${repair.wireTaped && repair.combsAttached === 3 && repair.hubTaped ? 'ready' : ''}`}>
                    <i /> {repair.wireTaped && repair.combsAttached === 3 && repair.hubTaped ? 'READY TO TEST' : 'REPAIR IN PROGRESS'}
                  </div>
                </div>
              </header>

              <div className="objective-note">
                <b>CHHOTU’S PLAN:</b> unscrew grille → fit 3 plastic combs → tape hub → insulate cut wire.
              </div>

              <div
                className="fan-puzzle w-[320px] h-[320px] md:w-[360px] md:h-[360px] absolute left-[41%] bottom-[14%] -translate-x-1/2 z-10"
                aria-label="Layered table fan repair puzzle"
              >
                {/* 1. Base Layer (z-0) */}
                <img
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
                  src={ASSETS.fanBody}
                  alt="Broken table fan body"
                  draggable={false}
                />

                {/* 2. Rotor Combs (z-10) */}
                <div
                  className={`rotor-layer absolute inset-0 pointer-events-none z-10 ${
                    phase === 'TESTING' && testResult === 'success' ? 'is-spinning' : ''
                  }`}
                  style={{ transformOrigin: '50.8% 45.7%' }}
                >
                  {Array.from({ length: repair.combsAttached }, (_, index) => (
                    <img
                      key={index}
                      className={`w-[40px] h-[106px] md:w-[44px] md:h-[116px] absolute left-[50.8%] top-[45.7%] -translate-x-1/2 -translate-y-full origin-bottom object-contain pointer-events-none ${
                        index === 0
                          ? 'rotate-0'
                          : index === 1
                            ? 'rotate-[120deg]'
                            : 'rotate-[240deg]'
                      } ${
                        phase === 'TESTING' && testResult === 'bladeMissile'
                          ? `comb-flying comb-${index + 1}`
                          : ''
                      }`}
                      src={ASSETS.comb}
                      alt={`Plastic comb fan blade ${index + 1}`}
                      draggable={false}
                    />
                  ))}
                </div>

                {/* Rotor comb attach hotspot */}
                {repair.grilleDetached && repair.combsAttached < 3 && (
                  <button
                    className={`absolute left-[50.8%] top-[45.7%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full cursor-pointer focus:outline-none transition-all ${
                      heldTool === 'comb'
                        ? 'z-16 ring-4 ring-amber-400/80 animate-pulse hover:bg-amber-400/30'
                        : 'z-12 hover:bg-amber-400/20'
                    }`}
                    type="button"
                    onClick={attachComb}
                    disabled={phase === 'TESTING'}
                    aria-label="Attach a comb blade to the rotor"
                    title="Click with plastic comb to attach blade"
                  />
                )}

                {/* 3. Hub Lock */}
                {repair.grilleDetached && (
                  <button
                    className={`absolute left-[50.8%] top-[45.7%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full cursor-pointer focus:outline-none flex items-center justify-center transition-all ${
                      heldTool === 'tape' && !repair.hubTaped
                        ? 'z-16 ring-4 ring-amber-400 animate-pulse hover:scale-115 hover:bg-amber-400/30'
                        : 'z-15 hover:scale-105'
                    }`}
                    type="button"
                    onClick={tapeHub}
                    disabled={phase === 'TESTING'}
                    aria-label="Tape the rotor hub"
                    title={repair.hubTaped ? 'Center hub taped' : 'Click with black tape to secure hub'}
                  >
                    {repair.hubTaped && (
                      <img
                        className="w-16 h-16 absolute inset-0 object-contain pointer-events-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]"
                        src={ASSETS.hubTape}
                        alt="Tape securing the fan hub"
                        draggable={false}
                      />
                    )}
                  </button>
                )}
                {!repair.grilleDetached && repair.hubTaped && (
                  <img
                    className="w-16 h-16 absolute left-[50.8%] top-[45.7%] -translate-x-1/2 -translate-y-1/2 object-contain pointer-events-none z-15 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]"
                    src={ASSETS.hubTape}
                    alt="Tape securing the fan hub"
                    draggable={false}
                  />
                )}

                {/* 4. Front Grille (z-20) - only render on the fan when NOT detached or when reattached */}
                {(!repair.grilleDetached || repair.grilleReattached) && (
                  <button
                    className="absolute inset-0 w-full h-full z-20 cursor-pointer focus:outline-none"
                    type="button"
                    onClick={toggleGrille}
                    disabled={phase === 'TESTING'}
                    aria-label="Front grille"
                    title={!repair.screwsRemoved ? 'Unscrew clips first' : 'Click to lift off front grille'}
                  >
                    <img
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                      src={ASSETS.fanGrille}
                      alt="Fan front grille"
                      draggable={false}
                    />
                  </button>
                )}

                {/* 3. Retaining Screws (3 discrete clips along outer perimeter rim) */}
                {!repair.screwsRemoved && (
                  <>
                    {!repair.removedClips.includes('top') && (
                      <button
                        className={`screw-clip-target absolute top-[5.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 z-30 cursor-pointer transition-all hover:scale-125 focus:outline-none flex items-center justify-center ${
                          heldTool === 'screwdriver' ? 'ring-2 ring-amber-400/80 rounded-sm animate-pulse' : ''
                        }`}
                        type="button"
                        onClick={() => removeClip('top')}
                        disabled={phase === 'TESTING'}
                        aria-label="Remove top screw clip"
                        title="Click with screwdriver to remove clip"
                      >
                        <img
                          src={ASSETS.grilleScrews}
                          alt="Top screw clip"
                          className="w-6 h-6 object-contain pointer-events-none"
                          draggable={false}
                        />
                      </button>
                    )}
                    {!repair.removedClips.includes('left') && (
                      <button
                        className={`screw-clip-target absolute top-[59%] left-[19%] -translate-x-1/2 -translate-y-1/2 w-9 h-9 z-30 cursor-pointer transition-all hover:scale-125 focus:outline-none rotate-[-60deg] flex items-center justify-center ${
                          heldTool === 'screwdriver' ? 'ring-2 ring-amber-400/80 rounded-sm animate-pulse' : ''
                        }`}
                        type="button"
                        onClick={() => removeClip('left')}
                        disabled={phase === 'TESTING'}
                        aria-label="Remove bottom-left screw clip"
                        title="Click with screwdriver to remove clip"
                      >
                        <img
                          src={ASSETS.grilleScrews}
                          alt="Bottom-left screw clip"
                          className="w-6 h-6 object-contain pointer-events-none"
                          draggable={false}
                        />
                      </button>
                    )}
                    {!repair.removedClips.includes('right') && (
                      <button
                        className={`screw-clip-target absolute top-[59%] left-[81%] -translate-x-1/2 -translate-y-1/2 w-9 h-9 z-30 cursor-pointer transition-all hover:scale-125 focus:outline-none rotate-[60deg] flex items-center justify-center ${
                          heldTool === 'screwdriver' ? 'ring-2 ring-amber-400/80 rounded-sm animate-pulse' : ''
                        }`}
                        type="button"
                        onClick={() => removeClip('right')}
                        disabled={phase === 'TESTING'}
                        aria-label="Remove bottom-right screw clip"
                        title="Click with screwdriver to remove clip"
                      >
                        <img
                          src={ASSETS.grilleScrews}
                          alt="Bottom-right screw clip"
                          className="w-6 h-6 object-contain pointer-events-none"
                          draggable={false}
                        />
                      </button>
                    )}
                  </>
                )}

                {/* 5. Wire Tape Attachment: anchored directly over cut wire at bottom-right base */}
                <button
                  className={`absolute bottom-[2%] right-[16%] w-10 h-10 -rotate-45 z-25 cursor-pointer focus:outline-none group flex items-center justify-center transition-all ${
                    heldTool === 'tape' && !repair.wireTaped
                      ? 'ring-4 ring-amber-400 animate-pulse hover:scale-125 rounded-full hover:bg-amber-400/30'
                      : ''
                  }`}
                  type="button"
                  onClick={tapeWire}
                  disabled={phase === 'TESTING'}
                  aria-label="Insulate the exposed fan wire"
                  title={repair.wireTaped ? 'Wire insulated' : 'Click with black tape to insulate wire'}
                >
                  {repair.wireTaped ? (
                    <img
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                      src={ASSETS.wireTape}
                      alt="Electrical tape repair on power wire"
                      draggable={false}
                    />
                  ) : (
                    <span className="w-3 h-3 rounded-full bg-amber-400/80 animate-ping pointer-events-none" />
                  )}
                </button>
              </div>

              {/* Detached front grille resting cleanly in the empty desk space to the right of the fan */}
              <AnimatePresence>
                {repair.grilleDetached && !repair.grilleReattached && (
                  <motion.button
                    key="detached-grille"
                    className="absolute left-[66%] bottom-[13%] -translate-x-1/2 w-[205px] h-[205px] md:w-[235px] md:h-[235px] z-20 cursor-pointer focus:outline-none group"
                    type="button"
                    onClick={toggleGrille}
                    disabled={phase === 'TESTING'}
                    aria-label="Reattach front grille"
                    title="Click to refit front grille to fan"
                    initial={{ opacity: 0, scale: 0.85, rotate: -15 }}
                    animate={{ opacity: 1, scale: 1, rotate: 6 }}
                    exit={{ opacity: 0, scale: 0.85, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      className="w-full h-full object-contain pointer-events-none drop-shadow-[0_10px_16px_rgba(0,0,0,0.35)]"
                      src={ASSETS.fanGrille}
                      alt="Detached fan front grille resting on workbench"
                      draggable={false}
                    />
                    <span className="absolute bottom-[4%] left-1/2 -translate-x-1/2 bg-amber-100 text-black font-['Bangers'] text-xs md:text-sm px-3 py-1 border-2 border-black rotate-[-4deg] shadow-[3px_3px_0_#000] whitespace-nowrap group-hover:bg-amber-300 pointer-events-none">
                      CLICK TO REFIT
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>

              <div className="tool-containers" aria-label="Workshop supplies">
                <ToolContainer id="toolbox" label="RED TOOLBOX" image={ASSETS.toolbox} isOpen={drawer === 'toolbox'} onToggle={openDrawer}>
                  <button className={`supply-choice ${heldTool === 'screwdriver' ? 'selected' : ''}`} type="button" onClick={() => selectTool('screwdriver')}>
                    <div className="supply-icon-box">
                      <img src="/cursors/cursor_screwdriver.png.png" alt="Screwdriver" className="supply-icon-img" />
                    </div>
                    <div className="supply-info">
                      <strong className="supply-title">SCREWDRIVER</strong>
                      <span className="supply-desc">For 3 grille clips</span>
                    </div>
                    {heldTool === 'screwdriver' && <span className="supply-badge">HELD</span>}
                  </button>
                </ToolContainer>
                <ToolContainer id="consumables" label="CONSUMABLES" image={ASSETS.consumables} isOpen={drawer === 'consumables'} onToggle={openDrawer}>
                  <button className={`supply-choice ${heldTool === 'tape' ? 'selected' : ''}`} type="button" onClick={() => selectTool('tape')}>
                    <div className="supply-icon-box">
                      <img src="/cursors/cursor_tape.png.png" alt="Black Tape" className="supply-icon-img" />
                    </div>
                    <div className="supply-info">
                      <strong className="supply-title">BLACK TAPE</strong>
                      <span className="supply-desc">Hub lock + cut wire</span>
                    </div>
                    {heldTool === 'tape' && <span className="supply-badge">HELD</span>}
                  </button>
                </ToolContainer>
                <ToolContainer id="jugaad" label="JUGAAD BOX" image={ASSETS.jugaadBox} isOpen={drawer === 'jugaad'} onToggle={openDrawer}>
                  <button className={`supply-choice ${heldTool === 'comb' ? 'selected' : ''}`} type="button" onClick={() => selectTool('comb')}>
                    <div className="supply-icon-box">
                      <img src={ASSETS.comb} alt="Plastic Comb" className="supply-icon-img -rotate-12" />
                    </div>
                    <div className="supply-info">
                      <strong className="supply-title">
                        PLASTIC COMB <span className="comb-count-badge">×{Math.max(0, 3 - repair.combsAttached)}</span>
                      </strong>
                      <span className="supply-desc">High-RPM desi blade</span>
                    </div>
                    {heldTool === 'comb' && <span className="supply-badge">HELD</span>}
                  </button>
                </ToolContainer>
              </div>

              <footer className="workshop-footer">
                <div className="bg-amber-100 border-4 border-black shadow-[4px_4px_0px_#000] p-2.5 px-3 rounded-lg flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs font-['Bangers'] tracking-wider text-red-600 uppercase leading-none">
                      HOLDING
                    </span>
                    <strong className="text-xs md:text-sm font-['Bangers'] text-black tracking-wide leading-tight mt-0.5">
                      {heldTool === 'screwdriver'
                        ? 'SCREWDRIVER'
                        : heldTool === 'tape'
                          ? 'BLACK INSULATION TAPE'
                          : heldTool === 'comb'
                            ? `PLASTIC COMB (${Math.max(0, 3 - repair.combsAttached)} LEFT)`
                            : 'NONE'}
                    </strong>
                  </div>
                  {heldTool && (
                    <button
                      type="button"
                      onClick={unequipTool}
                      className="stamp-button !min-h-0 !py-1 !px-2.5 !text-xs !bg-red-600 !text-white !border-2 !border-black !shadow-[2px_2px_0px_#000] cursor-pointer hover:!brightness-110 active:!translate-x-0.5 active:!translate-y-0.5"
                    >
                      UNEQUIP (ESC)
                    </button>
                  )}
                </div>
                <div className="feedback-strip">{feedback}</div>
                <button className="stamp-button test-button" type="button" onClick={startTest} disabled={phase === 'TESTING'}>
                  <Zap size={21} fill="currentColor" /> TEST JUGAAD <span aria-hidden="true">⚡</span>
                </button>
              </footer>

              {phase === 'TESTING' && <TestingEffects result={testResult} />}
            </motion.section>
          )}

          {phase === 'VERDICT' && (
            <motion.section key="verdict" className={`scene verdict-scene ${isSuccessful ? 'victory' : 'failure'}`} {...panelMotion}>
              <img className="scene-background" src={ASSETS.counter} alt="Shri Ganesh Electronics" />
              <div className="verdict-radials" />
              <motion.div className="verdict-stamp" initial={{ x: '-50%', scale: 2.4, rotate: -12, opacity: 0 }} animate={{ x: '-50%', scale: 1, rotate: -4, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 15 }}>
                {isSuccessful ? '★ 5-STAR JUGAAD ★' : '✕ JUGAAD KAAND ✕'}
              </motion.div>
              <motion.img
                className="rahul-portrait verdict-rahul opacity-100 absolute -bottom-[4%] left-6 h-[78%] max-h-[520px] object-contain pointer-events-none z-5"
                src={isSuccessful ? ASSETS.rahulHappy : ASSETS.rahulAngry}
                alt={isSuccessful ? 'Rahul delighted by the repaired fan' : 'Rahul upset after the repair test'}
                initial={{ opacity: 0, x: -55 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 130, damping: 17, delay: 0.12 }}
              />
              <motion.div className="speech-bubble verdict-bubble" initial={{ opacity: 0, scale: 0.8, y: 22 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 16, delay: 0.28 }}>
                <span className="speech-label">RAHUL’S VERDICT</span>
                <p>{isSuccessful
                  ? '“Hawa bhi aa rahi hai aur budget bhi bacha! Bhaiya, aap toh asli engineer nikle!”'
                  : testResult === 'shortCircuit'
                    ? '“Arre! Fan nahi, Diwali ka patakha bana diya! Wire pe tape kaun lagayega?”'
                    : testResult === 'bladeMissile'
                      ? '“Kangi seedha Sharma ji ke balcony mein gayi! Center hub ko tape karna tha!”'
                      : '“Yeh hawa kam aur tabla zyada baja raha hai. Chalo, ek baar aur try karo.”'}</p>
                <small>{isSuccessful ? 'MISSION COMPLETE: ₹120 + ONE HAPPY NEIGHBOUR' : 'THE WORKBENCH DEMANDS ANOTHER ATTEMPT.'}</small>
              </motion.div>
              <div className="score-card">
                <span>{isSuccessful ? 'CUSTOMER RATING' : 'DAMAGE REPORT'}</span>
                <strong>{isSuccessful ? '★★★★★' : '⚡ + 🪮 = ?'}</strong>
                <b>{isSuccessful ? '+ ₹120 CASH' : 'NO PAYMENT TODAY'}</b>
              </div>
              <div className="verdict-actions">
                <button className="stamp-button cream-button" type="button" onClick={returnToTitle}>HOME</button>
                <button className="stamp-button green-button" type="button" onClick={enterWorkshop}>
                  <RotateCcw size={19} /> {isSuccessful ? 'PLAY AGAIN' : 'REPAIR AGAIN'}
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* HOW TO PLAY COMIC MODAL */}
      <AnimatePresence>
        {showHowToPlay && (
          <motion.div
            className="how-to-play-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHowToPlay(false)}
          >
            <motion.div
              className="how-to-play-dialog"
              initial={{ scale: 0.88, y: 22, rotate: -1 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.88, y: 22, rotate: 1 }}
              transition={{ type: 'spring', stiffness: 240, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="how-close-btn"
                onClick={() => {
                  setShowHowToPlay(false)
                  audioManager.play('button')
                }}
                aria-label="Close how to play dialog"
                title="Close"
              >
                <X size={20} />
              </button>

              <div className="how-to-play-header">
                <div className="how-to-play-ribbon">CHHOTU’S JUGAAD MANUAL 🛠️</div>
                <h2>HOW TO FIX RAHUL’S FAN</h2>
                <p className="how-subtitle">Follow these 4 desi engineering steps to deliver 5-star airflow!</p>
              </div>

              <div className="how-to-play-grid">
                <div className="how-step-card">
                  <div className="how-step-badge"><span>🪛</span> 1. UNSCREW GRILLE</div>
                  <p>Open the <b>Red Toolbox</b> and equip the <b>Screwdriver</b>. Click all 3 retaining clips on the fan rim, then click the front grille to lift it off onto the desk.</p>
                </div>
                <div className="how-step-card">
                  <div className="how-step-badge"><span>🪮</span> 2. FIT COMB BLADES</div>
                  <p>Open the <b>Jugaad Box</b> and equip the <b>Plastic Comb</b>. Click the naked motor rotor 3 times to snap in 3 aerodynamic desi comb blades!</p>
                </div>
                <div className="how-step-card">
                  <div className="how-step-badge"><span>⬛</span> 3. INSULATING TAPE</div>
                  <p>Grab <b>Black Tape</b> from Consumables. Click the center motor hub to lock the combs, then click the sparking cut wire at the base to insulate it.</p>
                </div>
                <div className="how-step-card">
                  <div className="how-step-badge"><span>🛡️</span> 4. REFIT & TEST</div>
                  <p>Click the detached grille resting on the desk to refit it, then hit <b>TEST JUGAAD ⚡</b> to unleash Rahul’s cool budget breeze!</p>
                </div>
              </div>

              <div className="how-controls-tip">
                <span>💡</span> <b>CONTROLS TIP:</b> Right-Click or press <b>[ESC]</b> anytime to put your held tool back on the workbench! Custom mouse cursors guide your actions.
              </div>

              <div className="how-dialog-action">
                <button
                  type="button"
                  className="stamp-button start-button"
                  onClick={() => {
                    setShowHowToPlay(false)
                    audioManager.play('button')
                  }}
                >
                  CHALO SHURU KAREIN! (GOT IT!) 🚀
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

interface ToolContainerProps {
  id: Exclude<DrawerId, null>
  label: string
  image: string
  isOpen: boolean
  onToggle: (id: Exclude<DrawerId, null>) => void
  children: React.ReactNode
}

function ToolContainer({ id, label, image, isOpen, onToggle, children }: ToolContainerProps) {
  return (
    <div className={`tool-container ${isOpen ? 'is-open' : ''}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="supply-drawer"
            initial={{ opacity: 0, y: 16, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 280, damping: 19 }}
          >
            <div className="drawer-header-strip">
              <span className="drawer-tag">{label}</span>
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        className="container-button cursor-pointer"
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={isOpen}
        title={label}
      >
        <img
          className="container-image w-full aspect-square object-contain pointer-events-none"
          src={image}
          alt={label}
          draggable={false}
        />
      </button>
    </div>
  )
}

function TestingEffects({ result }: { result: TestResult }) {
  return (
    <div className="testing-effects" aria-label="Testing repair">
      {result === 'success' && <><div className="wind-lines" /><div className="test-sfx">VRRRRR!</div></>}
      {result === 'shortCircuit' && <><div className="flash-frame" /><div className="smoke smoke-one" /><div className="smoke smoke-two" /><div className="test-sfx danger">ZZZAP!</div></>}
      {result === 'bladeMissile' && <div className="test-sfx danger">FWOOMP!</div>}
      {result === 'rattle' && <div className="test-sfx danger">KRRR-KRRR!</div>}
    </div>
  )
}

export default App
