// Style
import style from './index.module.css'

// Components
import Section from 'components/Section'
import Container, { Row } from 'components/Container'
import ContentBlock from 'components/ContentBlock'
import Heading from 'components/Heading'
import { Trans } from 'react-i18next'

// Hooks
import { useTranslation } from 'react-i18next'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaUserPlus, FaFileAlt, FaCode, FaCheckCircle, FaTrophy, FaCalendarDay, FaLaptopCode } from 'react-icons/fa'

gsap.registerPlugin(ScrollTrigger)

const TimelineItem = ({ icon, title, date, description, index }: { icon: React.ReactNode, title: string, date: string, description: string, index: number }) => {
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = itemRef.current
    if (!el) return

    gsap.fromTo(el, 
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        delay: index * 0.15
      }
    )
  }, [index])

  return (
    <div ref={itemRef} className={style.timelineItem}>
      <div className={style.timelineIcon}>{icon}</div>
      <div className={style.timelineContent}>
        <h3 className={style.timelineTitle}>{title}</h3>
        <div className={style.timelineDate}>{date}</div>
        <p className={style.timelineDescription}>{description}</p>
      </div>
    </div>
  )
}

function Portfolio() {
  const { t } = useTranslation('translation', { keyPrefix: 'portfolio' })
  const intro: string[] = t('intro', { returnObjects: true })
  const portfolio: string[] = t('portfolio', { returnObjects: true })

  const timelineData = [
    {
      icon: <img src="public/images/mobile.png" width={"80%"} />,
      title: "Registration",
      date: "Aug 15",
      description: "Register and receive participant details by email."
    },
    {
      icon: <img src="public/images/problem-solving.png" width={"80%"} />,
      title: "Problem Statement Release",
      date: "Aug 20",
      description: "Problem statements sent to all registered teams."
    },
    {
      icon: <img src="public/images/checklist.png" width={"80%"} />,
      title: "Solution Submission",
      date: "Aug 21",
      description: "Teams submit solutions via GitHub."
    },
    {
      icon: <img src="public/images/marketplace.png" width={"80%"} />,
      title: "Shortlisting and Payment",
      date: "Aug 25",
      description: "Top 10 teams are shortlisted and informed to submit payment details."
    },
  
  ]

  return (
    <Section name="portfolio" className={style.root}>
      <Container grid outerRightOnMobile >
  <Row start={1} end={2}>
    <div className={style.headingContainer}>
      <Heading 
        misaligned 
        key={intro[0]} 
        className={`${style.font} ${style.portfolioHeading} ${style.customHeading}`}
      >
        <span className={style.glowText}>ONLINE PROCESS</span>
      </Heading>
      <div className={style.headingLine}></div>
    </div>
  </Row>
</Container>
      <div key={intro[2]} className='outline-process'>
        <Row start={1} end={4}>
          <ContentBlock>
            <div className={style.timelineContainer}>
              {timelineData.map((item, index) => (
                <TimelineItem 
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  date={item.date}
                  description={item.description}
                  index={index}
                />
              ))}
            </div>
          </ContentBlock>
        </Row>
      </div>
      <Container grid outerRightOnMobile className={style.projectSection}>
        <Row start={2} end={2}>
        <Heading 
        misaligned 
        key={intro[0]} 
        className={`${style.font} ${style.portfolioHeading} ${style.customHeading}`}
      >
        <span className={style.glowText}>OFFLINE PROCESS</span>
      </Heading>
        </Row>
      </Container>
      <Container grid key={portfolio[1]}>
        <Row start={3} end={4}>
          <ContentBlock className={style.contentBlock}>
            <div className={style.specialCardDescription}>
              <Trans i18nKey="portfolio.portfolio.1" />
            </div>
          
          </ContentBlock>
        </Row>
      </Container>

      <Container className={style.specialContainer}>

        <div>
      <div className={style.specialCards}>
              {/* Final Challenge Card */}
              <div className={style.specialCard}>
                <div className={style.specialCardIcon}>
                  <img src="public/images/obstacle.png" width={"30%"} />
                </div>
                <h3 className={style.specialCardTitle}>Final Challenge</h3>
                <div className={style.specialCardDate}>
                  <FaCalendarDay />
                  <span>Sept 18 (Morning)</span>
                </div>
                <p className={style.specialCardDescription}>
                  Final problem statements sent to 10 teams. Teams reply with selected problem statement.
                </p>
                <div className={style.specialCardSecondDate}>
                  <div className={style.specialCardDate}>
                    <FaCalendarDay />
                    <span>Sept 18 (Evening)</span>
                  </div>
                  <p className={style.specialCardDescription}>
                    Teams submit final solutions via GitHub.
                  </p>
                </div>
              </div>

              {/* Presentation Day Card */}
              <div className={style.specialCardRight}>
                <div className={style.specialCardIcon}>
                  <img src="public/images/pressday.png" width={"25%"} />
                </div>
                <h3 className={style.specialCardTitle}>Presentation Day</h3>
                <div className={style.specialCardDate}>
                  <FaCalendarDay />
                  <span>Sept 20</span>
                </div>
                <p className={style.specialCardDescription}>
                  All 10 teams present at our office for the final presentation.
                </p>
                <div className={style.specialCardSecondDate}>
                  <div className={style.specialCardDate}>
                    <FaCalendarDay />
                    <span>Sept 18 (Evening)</span>
                  </div>
                  <p className={style.specialCardDescription}>
                    Teams submit final solutions via GitHub.
                  </p>
                </div>
              </div>
            </div>
            </div>
      </Container>

      <div className={style.cardContainer} id="card-container" />

      <img 
        id="skReel" 
        src="/public/images/guide.png" 
        alt="Guidelines" 
        className={style.video}
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      />
      <video id="aqReel" autoPlay muted loop playsInline className={style.video}>
        {/* <source src="/projects/aq/reel-aq.mp4" type="video/mp4" /> */}
      </video>
      <video id="fbReel" autoPlay muted loop playsInline className={style.video}>
        {/* <source src="/projects/fb/fb-reel.mp4" type="video/mp4" /> */}
      </video>
      <video id="feudiReel" autoPlay muted loop playsInline className={style.video}>
        {/* <source src="/projects/feudi/feudi-reel.mp4" type="video/mp4" /> */}
      </video>
      <video id="claralunaReel" autoPlay muted loop playsInline className={style.video}>
        {/* <source src="/projects/claraluna/claraluna-reel.mp4" type="video/mp4" /> */}
      </video>
      
    </Section>
  )
}
export default Portfolio
