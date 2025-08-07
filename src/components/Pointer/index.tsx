// Types
import type { RootState } from 'store'

// Styles
import style from './index.module.css'

// Utils
import { gsap } from 'gsap'
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin'
import cn from 'classnames'

// Hooks
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

gsap.registerPlugin(ScrambleTextPlugin)

const TRAIL_COUNT = 5;
const TRAIL_DELAY = 0.1;

function Pointer() {
  const location = useLocation()
  const pointer = useSelector((state: RootState) => state.pointer)
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLDivElement | null)[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [trailPositions, setTrailPositions] = useState(
    Array(TRAIL_COUNT).fill({ x: 0, y: 0 })
  )

  // Initialize trail refs
  useEffect(() => {
    trailRefs.current = trailRefs.current.slice(0, TRAIL_COUNT)
  }, [])

  // Update cursor position with smooth trail effect
  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', updateCursor)
    return () => window.removeEventListener('mousemove', updateCursor)
  }, [])

  // Animate cursor and trail
  useEffect(() => {
    if (trailRefs.current.length !== TRAIL_COUNT) return

    // Update main cursor
    gsap.to(cursorRef.current, {
      x: mousePos.x,
      y: mousePos.y,
      duration: 0.1,
      ease: 'power1.out'
    })

    // Update trail elements with delay
    const newTrailPositions = [...trailPositions]
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const targetX = i === 0 ? mousePos.x : newTrailPositions[i - 1].x
      const targetY = i === 0 ? mousePos.y : newTrailPositions[i - 1].y
      
      gsap.to(trailRefs.current[i], {
        x: targetX,
        y: targetY,
        duration: 0.3,
        delay: i * TRAIL_DELAY,
        ease: 'power1.out',
        onUpdate: () => {
          newTrailPositions[i] = { 
            x: parseFloat(trailRefs.current[i]?.style.left || '0'), 
            y: parseFloat(trailRefs.current[i]?.style.top || '0') 
          }
        }
      })
    }
    
    setTrailPositions(newTrailPositions)
  }, [mousePos])

  const classes = cn(style.root, {
    [style.dark]: location.pathname !== '/',
    [style[`type-${pointer.type}`]]: pointer.type,
    [style.hidden]: pointer.type === 'hidden' // Add hidden class when type is 'hidden'
  })

  return (
    <>
      {/* Main Cursor */}
      <div className={classes} ref={cursorRef}>
        <div className={style.cursorCenter} />
        <div className={style.cursorGear}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={style.gearTooth} style={{
              '--rotate': `${i * 45}deg`,
              '--delay': `${i * 0.05}s`
            } as React.CSSProperties} />
          ))}
        </div>
      </div>
      
      {/* Trail Elements */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div 
          key={i}
          ref={el => trailRefs.current[i] = el}
          className={`${style.trail} ${style[`trail-${i}`]}`}
          style={{
            '--trail-scale': 1 - (i / (TRAIL_COUNT * 1.5)),
            '--trail-opacity': 1 - (i / TRAIL_COUNT) * 0.8,
            '--trail-delay': `${i * TRAIL_DELAY}s`
          } as React.CSSProperties}
        >
          <div className={style.trailInner} />
        </div>
      ))}
    </>
  )
}

export default Pointer
