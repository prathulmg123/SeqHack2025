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

// Components
import RegistrationForm from '../RegistrationForm'
import { useToast } from '../ToastManager'

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
    dispatch.pointer.setType('hidden')
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

  const [isRegistrationFormOpen, setIsRegistrationFormOpen] = useState(false);
  const { showError } = useToast();

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRegistrationFormOpen(true);
  };

  const handleRegistrationSubmit = async (formData: any) => {
    try {
      // The actual submission will be handled by the RegistrationForm component
      // We just need to close the modal on success
      setIsRegistrationFormOpen(false);
    } catch (error) {
      console.error('Registration submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error submitting registration. Please try again.';
      showError(errorMessage);
      throw error;
    }
  };

  return (
    <div className={style.container}>
      <motion.div 
        className={classes}
        initial={{ opacity: 0 }}
        animate={{ opacity: !app.ready ? 1 : 1 }}
        transition={{ 
          duration: 0.9,
          delay: 1  // Adds a 2-second delay before animation starts
        }}
      >
        <div
          className={style.button}
          // onMouseEnter={overHandler}
          // onMouseLeave={outHandler}
        >
          <span className={style.label}>
            <Email className={style.email}/>
            <span className={style.text}>seqathon@seqato.com</span>
          </span>
          <span className={style.marker} />
        </div>
      </motion.div>
      {/* <motion.div
        className={style.registerButton}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        onClick={handleRegisterClick}
        // onMouseEnter={overHandler}
        // onMouseLeave={outHandler}
      >
        <span className={style.registerText}>Register Now</span>
        <span className={style.arrowIcon}>→</span>
      </motion.div> */}
      
      {/* Registration Form Modal */}
      {isRegistrationFormOpen && (
        <RegistrationForm 
          isOpen={isRegistrationFormOpen}
          onClose={() => setIsRegistrationFormOpen(false)}
          onSubmit={handleRegistrationSubmit}
        />
      )}
    </div>
  )
}

export default LangSwitch
