import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import * as THREE from 'three'
import styles from './index.module.css'

const IntroScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Store cleanup functions
    const cleanupFunctions: (() => void)[] = []

    // Animate text
    const textAnimation = animateText()
    if (textAnimation) cleanupFunctions.push(() => textAnimation.kill())

    // Setup Three.js
    const threeCleanup = setupThreeJS()
    if (threeCleanup) cleanupFunctions.push(threeCleanup)

    // Cleanup function
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }, [])

  const animateText = () => {
    if (typeof window === 'undefined') return null
    
    const elements = document.querySelectorAll(`.${styles.textReveal} span`)
    if (!elements.length) return null

    return gsap.from(elements, {
      yPercent: 100,
      stagger: 0.06,
      ease: 'power4.out',
      duration: 1.2,
      delay: 0.3
    })
  }

  const setupThreeJS = () => {
    if (!canvasRef.current || typeof window === 'undefined') return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    camera.position.z = 2

    // Create stars
    const starsGeometry = new THREE.BufferGeometry()
    const starCount = 1000
    const positions = new Float32Array(starCount * 3)
    
    for (let i = 0; i < starCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const starMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 0.01 
    })
    
    const stars = new THREE.Points(starsGeometry, starMaterial)
    scene.add(stars)

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      stars.rotation.y += 0.0005
      renderer.render(scene, camera)
    }
    
    animate()

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }

  return (
    <section className={styles.container} ref={containerRef}>
      <canvas ref={canvasRef} className={styles.bgCanvas}></canvas>
      <div className={styles.content}>
        <h1 className={styles.textReveal}>
          <span>SEQATHON 3.0</span>
        </h1>
        <p className={styles.subtitle}>Your gateway to the future of innovation.</p>
      </div>
    </section>
  )
}

export default IntroScene