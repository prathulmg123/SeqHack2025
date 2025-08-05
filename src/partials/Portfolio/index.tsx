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
      icon: <img
      src="/images/mobile-min.png"                 // your original
      loading="lazy"
      decoding="async"
      alt="Mobile preview"
      style={{ display: 'block', width: '80%', height: 'auto' }} // replace width={"80%"}
      width={800}      // approximate intrinsic size to reserve layout (adjust if needed)
      height={450}     // keep aspect ratio, adjust to match real image
      fetchPriority="high"
    />,
      title: "Registration",
      date: "Aug 15",
      description: "Register and receive participant details by email.,Register and receive participant details by email."
    },
    
    {
      icon: <img
      src="/images/problem-solving-min.png"                 // your original
      loading="lazy"
      decoding="async"
      alt="Mobile preview"
      style={{ display: 'block', width: '80%', height: 'auto' }} // replace width={"80%"}
      width={800}      // approximate intrinsic size to reserve layout (adjust if needed)
      height={450}     // keep aspect ratio, adjust to match real image
       fetchPriority="high"
    />,
      title: "Problem Statement Release",
      date: "Aug 18",
      description: "Problem statements sent to all registered teams."
    },

    {
      icon: <img
    src="/images/checklist-min.png"                 // your original
    loading="lazy"
    decoding="async"
    alt="Mobile preview"
    style={{ display: 'block', width: '80%', height: 'auto' }} // replace width={"80%"}
    width={800}      // approximate intrinsic size to reserve layout (adjust if needed)
    height={450}     // keep aspect ratio, adjust to match real image
     fetchPriority="high"
  />,
      title: "Solution Submission",
      date: "Aug 21",
      description: "Teams submit solutions via GitHub."
    },

    {
      icon:<img
    src="/images/marketplace-min.png"                 // your original
    loading="lazy"
    decoding="async"
    alt="Mobile preview"
    style={{ display: 'block', width: '80%', height: 'auto' }} // replace width={"80%"}
    width={800}      // approximate intrinsic size to reserve layout (adjust if needed)
    height={450}     // keep aspect ratio, adjust to match real image
    // fetchpriority="low"
  />,
      title: "Shortlisting and Payment",
      date: "Aug 26",
      description: "Top 10 teams are shortlisted and informed to submit payment details."
    },
  
  ]

  return (
    <Section name="portfolio" className={style.root}>
      <Container grid outerRightOnMobile >
  <Row start={2} end={2}>
    {/* <div className={style.headingContainer}> */}
      <Heading 
        misaligned 
        key={intro[0]} 
        className={`${style.font} ${style.portfolioHeading} ${style.customHeading}`}
      >
        <span className={style.glowText}>Level 1 : Ignition Stage</span>
      </Heading>
      <div className={style.headingLine}></div>
    {/* </div> */}
  </Row>
</Container>
<Container grid key={portfolio[2]}>
        <Row start={3} end={4}>
          <ContentBlock className={style.contentBlock}>
            <div className={style.specialCardDescription}>
              <Trans i18nKey="portfolio.portfolio.2" />
            </div>
          </ContentBlock>
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
        <span className={style.glowText}>Level 2 : Mission Core</span>
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
              <ContentBlock>
        <div>
      <div className={style.specialCards}>
              {/* Final Challenge Card */}
              <div className={style.specialCard}>
                <div className={style.specialCardIcon}>
                <img
                  src="/images/obstacle.png"    
                  loading="lazy"
                  decoding="async"
                  alt="Mobile preview"
                  style={{ display: 'block', width: '40%', height: 'auto' }}
                  width={800}      
                  height={450}     
                />
                </div>
                <h3 className={style.specialCardTitle}>Final Challenge</h3>
                <div className={style.specialCardDate}>
                  <FaCalendarDay />
                  <span>Sept 15 (Noon)</span>
                </div>
                <p className={style.specialCardDescription}>
                  Final problem statements sent to 10 teams. Teams reply with selected problem statement.
                </p>
                <div className={style.specialCardSecondDate}>
                  <div className={style.specialCardDate}>
                    <FaCalendarDay />
                    <span>Sept 16 (Midnight)</span>
                  </div>
                  <p className={style.specialCardDescription}>
                    Teams submit final solutions via GitHub.
                  </p>
                </div>
              </div>

              {/* Presentation Day Card */}
              <div className={style.specialCardRight}>
                <div className={style.specialCardIcon}>
                <img
                  src="/images/pressday.png"    
                  loading="lazy"
                  decoding="async"
                  alt="Mobile preview"
                  style={{ display: 'block', width: '40%', height: 'auto' }}
                  width={800}      
                  height={450}     
                />
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
                    <span>Sept 20</span>
                  </div>
                  <p className={style.specialCardDescription}>
                    Results will be announced and prize distribution ceremony.
                  </p>
                </div>
              </div>
            </div>
            </div>
            </ContentBlock>
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
