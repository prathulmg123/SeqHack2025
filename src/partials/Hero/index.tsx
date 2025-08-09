import { useState, useEffect } from 'react'
import type { RootState } from 'store'

// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'
import breakpoints from 'utils/breakpoints'

// Hooks
import useScrollOffset from 'hooks/useScrollOffset'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'

// Components
import Logo from 'components/Logo'
import Section from 'components/Section'
import AudioWave from 'components/AudioWave'
import Menu from 'components/Menu'
import EnterCTA from 'components/EnterCTA'
import LangSwitch from 'components/LangSwitch'
import GSAPScrumbleText, { ScrambleTexts } from 'components/GSAPScrumbleText'
import AnimatedTitle from '../../components/AnimatedTitle';
import { motion, AnimatePresence } from 'framer-motion';
import GSAPIntroTitle from '@/components/GaspIntroTitle/AnimatedIntro'
import AnimatedIntro from '@/components/GaspIntroTitle/AnimatedIntro'
import IntroScene from '@/components/GaspIntroTitle/AnimatedIntro'
import Typewriter from '@/components/TypeWriter/Typewriter'
import Container, { Row } from 'components/Container'
import ContentBlock from 'components/ContentBlock'
import { Trans } from 'react-i18next'
import CountdownClock from '@/components/CountdownClock'

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

 
  useEffect(() => {
    // Target date: August 20, 2025, 23:59:59 (11 days from August 9, 2025)
    const targetDate = new Date('2025-08-20T23:59:59+05:30');

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);



  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time;
  };

  return (
    <div className={style.timerContainer}>
      <span className={style.timerLabel}>Registration <br></br> Ends In</span>
      <div className={style.timerDigits}>
      {timeLeft.days > 0 && (
        <>
          {formatTime(timeLeft.days)}d: 
        </>
      )}
      {formatTime(timeLeft.hours)}h:{formatTime(timeLeft.minutes)}m:{formatTime(timeLeft.seconds)}s
    </div>
    </div>
  );
};

export default function Hero() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const { t } = useTranslation('translation', { keyPrefix: 'intro' })
  const isTabletOrDesktop = useMediaQuery({ minWidth: breakpoints.mdP })

  // Simulate loading progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setLoading(false);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  const scrambleTexts: ScrambleTexts = [
    [t('p1.l1'), t('p1.l2')],
    [t('p2.l1'), t('p2.l2')],
    [t('p3.l1')],
    [t('p4.l1')]
  ]

  const { app, menu } = useSelector((state: RootState) => ({
    app: state.app,
    menu: state.menu
  }))

  const { gone } = useScrollOffset({ offset: isTabletOrDesktop ? 200 : 50 })

  const scrambleClasses = cn(style.scramble, {
    [style.gone]: gone || menu.open
  })

  const scrollClasses = cn(style.scroll, {
    [style.gone]: gone || menu.open || !app.ready
  })
  
  const contentClasses = cn(style.contentWrapper, {
    [style.visible]: !loading
  });
  
  return (
    <>
   {app.ready && ( <CountdownClock endDate="2025-08-20T23:59:59+05:30" animationDelay={6000} />)}
      {loading ? (

        <div className={style.loadingScreen}>
          {/* <h1 className={style.loadingTitle}>SEQATHON</h1> */}
          <div className={style.heroTitleContainer}>
                    <img
                      src="/images/SeqathonTitle.png"
                      alt="SEQATHON 10th Anniversary"
                      className={style.heroloaderImage}
                    />
                  </div>
          <div className={style.loadingBarContainer}>
            <div
              className={style.loadingBar}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className={style.loadingPercentage}>
            Loading... {progress}%
          </div>
        </div>
      ) : (

        <div className={contentClasses}>
          <header className={style.head}>
            <div className={style.logoContainer}>
              <Logo />
            </div>
            <div className={style.menuContainer}>
              <Menu />
            </div>
          </header>
            {
              app.ready && (
            <LangSwitch />
            )
            }

          <Section name="hero" className={style.root}>

            <div className={style.middle}>
              <span className={style.line} />
              <div className={scrambleClasses}>
                <GSAPScrumbleText
                  content={scrambleTexts}
                  paused={!app.ready}
                  key={scrambleTexts[0][0]}
                />
              </div>
            </div>
            {
              app.ready && (
                <Container grid 
                className={`${style.fadeIn} ${style.specialCardContainer} ${style.specialCardContentBlock}`} 
               >
                  <Row start={3} end={4}>
                    <ContentBlock>
                      <div className={style.specialCardDescription}>
                      This is more than a hackathon. It’s a stage for innovators, problem solvers, and tech visionaries to shape the future.
                        <br /><br />
                        With multiple challenge stages, mentorship from industry leaders, and prizes that matter, <strong>SEQATHON</strong> is where great ideas become real solutions.
                        <br /><br />
                        <strong style={{fontSize: '1.4rem'}}>The clock is ticking are you ready to compete ?</strong>
                      </div>
                    </ContentBlock>
                  </Row>
                </Container>
              )
            }

            {
              !app.ready && (

                <div className={style.heroContent}>
                  <div className={style.heroTitleContainer}>
                    <img
                      src="/images/SeqathonTitle.png"
                      alt="SEQATHON 10th Anniversary"
                      className={style.heroImage}
                    />
                  </div>
                  <Typewriter
                    text="Join us in celebrating a decade of innovation with SEQATO at the ultimate hackathon experience. Collaborate, create, and compete for glory as you tackle real world challenges, learn from industry leaders, and push the boundaries of technology."
                    speed={20}
                    delay={20} // Delay before starting the animation (after the title appears)
                    play={!loading}
                    className={style.heroDescription}
                    cursor={false} // Set to true if you want the blinking cursor
                  />
                  <CountdownTimer />
                  
                </div>
              )
            }
                  <div className={style.enterButtonContainer}>
                    <EnterCTA />
                  </div>
            <footer className={scrollClasses}>
              <span className={style.scrollIndicator} />
              <div>
                <span className={style.scrollText} style={{fontSize:'1.2rem'}}>{t('scroll_cta.line1')}</span>
                <span className={style.scrollText} style={{fontSize:'1.2rem'}}>{t('scroll_cta.line2')}</span>
              </div>
            </footer>
          </Section>
          <footer className={style.footer}>
            <AudioWave />
          </footer>
        </div>
      )}
    </>
  )
}
