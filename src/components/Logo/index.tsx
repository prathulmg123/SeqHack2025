// Types
import type { AnimationEvent } from 'react'
import type { RootState } from 'store'

// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'

// Hooks
import { useState, useCallback, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

function Logo() {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const [closingModal, setClosingModal] = useState(false)
  const currentPathname = useRef<string>(location.pathname)
  const app = useSelector((state: RootState) => state.app)
  const dispatch = useDispatch()
  const endAnimationHandler = useCallback((e: AnimationEvent) => {
    if (e.animationName === style['to-white']) {
      setClosingModal(false)
    }
  }, [])

  const handleLogoClick = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Visible
  useEffect(() => {
    setTimeout(() => {
      setVisible(true)
    }, 500)
  }, [])

  useEffect(() => {
    if (currentPathname.current !== location.pathname && location.pathname === '/') {
      setClosingModal(true)
    }
    currentPathname.current = location.pathname
  }, [closingModal, location.pathname])

  const classes = cn(style.root, {
    [style.hidden]: !visible,
    [style.toWhite]: app.ready && closingModal,
    [style.toBlack]: app.ready && location.pathname !== '/'
  })

  const overHandler = useCallback(() => {
    dispatch.pointer.setType('hidden')
  }, [dispatch.pointer])
  
  const outHandler = useCallback(() => {
    dispatch.pointer.setType('default')
  }, [dispatch.pointer])

  return (
    <div className={classes} onClick={handleLogoClick} onMouseEnter={overHandler} onMouseLeave={outHandler} style={{ cursor: 'pointer' }}>
      <div className={style.logoContainer}>
        <img 
          src="/public/images/10thLogo.png" 
          alt="Seqato Logo" 
          className={style.logoImage}
          onAnimationEnd={endAnimationHandler}
        />
      </div>
    </div>
  )
}

export default Logo
