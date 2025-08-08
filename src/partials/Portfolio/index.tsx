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
      date: "Aug 15 - Aug 20",
      description: "The Call for Innovators Assemble your team, strategize, and submit your application to compete in SEQATHON 2025."
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
      date: "Aug 22",
      description: "The first challenge is unveiled! The official problem statement for the online qualifier will be released to the registered and verified teams."
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
      title: "Qualifier Code Freeze",
      date: "Aug 28",
      description: "The deadline for the online qualifier. Finalize your code and submit your solution for evaluation by our technical committee."
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
      title: "Grand Finale Onboarding",
      date: "Sept 2 - Sept 5",
      description: "Finalists are announced on September 2 and must confirm their spot by completing the final registration formalities (including paying a nominal participation fee of Rs. 400 per participant) by September 5 deadline."
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
                Exclusive final problem statement released to all finalist teams. Development sprint begins.
                </p>
                <div className={style.specialCardSecondDate}>
                  <div className={style.specialCardDate}>
                    <FaCalendarDay />
                    <span>Sept 16 (Midnight)</span>
                  </div>
                  <p className={style.specialCardDescription}>
                  Final code freeze — all project submissions must be uploaded via SEQATHON Git for evaluation.
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
                All finalist teams gather at SEQATO Office in Technopark Trivandrum to showcase their completed projects in front of the judging panel.
                </p>
                <div className={style.specialCardSecondDate}>
                  <div className={style.specialCardDate}>
                    <FaCalendarDay />
                    <span>Sept 20</span>
                  </div>
                  <p className={style.specialCardDescription}>
                  Winners are announced, and the event concludes with the official prize distribution ceremony.
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
