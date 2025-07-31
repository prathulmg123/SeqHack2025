// Types
import type { RootState } from 'store'

// Styles
import style from './index.module.css'

// Utils
import cn from 'classnames'

// Hooks
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import {FiMail as Email} from 'react-icons/fi'
import { motion } from 'framer-motion'

const languages = ['it', 'en']

const LangSwitch = () => {
  const dispatch = useDispatch()
  const { app, menu } = useSelector((state: RootState) => ({
    app: state.app,
    menu: state.menu
  }))
  const [isReady, setIsReady] = useState(false)
  const { i18n } = useTranslation()
  const location = useLocation()

  const changeLanguage = useCallback(
    (lang: string) => () => {
      i18n.changeLanguage(lang)
    },
    [i18n]
  )

  const overHandler = useCallback(() => {
    dispatch.pointer.setType('hover')
  }, [dispatch.pointer])

  const outHandler = useCallback(() => {
    dispatch.pointer.setType('default')
  }, [dispatch.pointer])

  useEffect(() => {
    if (app.ready) {
      setTimeout(() => {
        setIsReady(true)
      }, 15000)
    }
  }, [app.ready])

  const isHome = location.pathname === '/'

  const classes = cn(style.root, {
    [style.hidden]: !app.ready || menu.open,
    [style.dark]: !isHome
  })

  return (
    <motion.div 
      className={classes}
      initial={{ opacity: 0 }}
      animate={{ opacity: !app.ready ? 1 : 0 }}
      transition={{ 
        duration: 0.9,
        delay: 1  // Adds a 2-second delay before animation starts
      }}
    >
      <div
        className={style.button}
        onMouseEnter={overHandler}
        onMouseLeave={outHandler}
      >
        <span className={style.label}>
          <Email className={style.email}/>
          <span className={style.text}>seqathon@seqato.com</span>
        </span>
        <span className={style.marker} />
      </div>
    </motion.div>
  )
}

export default LangSwitch
