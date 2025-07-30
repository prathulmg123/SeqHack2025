import style from './index.module.css'

// Components
import Section from 'components/Section'
import Container, { Row } from 'components/Container'
import ContentBlock from 'components/ContentBlock'
import ImageTrigger from 'components/ImageTrigger'
import Square from 'components/Square'
import Heading from 'components/Heading'
import { List, ListItem } from 'components/List'
import React, { useEffect } from 'react';

import { FaMoneyBillWave, FaGift, FaRocket, FaCode } from 'react-icons/fa'
import { Trans, useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

function About() {
  const { t } = useTranslation('translation', { keyPrefix: 'about' })
  const intro: string[] = t('intro', { returnObjects: true })
  const clanTitle: string = t('clan_title')
  const clan: string[] = t('clan', { returnObjects: true })
  const methodTitle: string = t('method_title')
  const method: string[] = t('method', { returnObjects: true })

  const rewards = [
    {
      icon: <FaMoneyBillWave />,
      title: 'HUGE PRIZE POOL',
      description: 'Amazing cash prizes await those who seek innovation!',
    },
    {
      icon: <FaGift />,
      title: 'GOODIES?',
      description: 'Stickers, T-Shirts, and more fascinating prizes!',
    },
    {
      icon: <FaRocket />,
      title: 'RESUME BOOST!',
      description: 'Boost your resume with a new project! Better if you win!',
    },
    {
      icon: <FaCode />,
      title: 'CODE & CHILL',
      description: 'Write code, chill with the others and have fun!',
    },
  ]

  const roadmapItems = [
    { num: '01', title: 'Code Quality', desc: 'Robust, clean, and efficient code implementation', img: '/public/images/browser.png' },
    { num: '02', title: 'Innovation', desc: 'Creative and practical solutions that push boundaries', img: '/public/images/ideaInov.png' },
    { num: '03', title: 'Presentation', desc: 'Clear, engaging, and professional demonstration', img: '/public/images/presentation.png' },
    // { num: '04', title: 'Impact', desc: 'Real-world applicability and potential', img: '/public/images/browser.png' }
  ];


  useEffect(() => {
    function drawConnectors() {
      const cards = document.querySelectorAll('.modernCard');
      const svg = document.querySelector('.cardConnectorSVG');
      if (!svg || cards.length < 2) return;

      svg.innerHTML = '';

      for (let i = 0; i < cards.length - 1; i++) {
        const start = cards[i].getBoundingClientRect();
        const end = cards[i + 1].getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();

        const startX = start.right - svgRect.left;
        const startY = start.top + start.height / 2 - svgRect.top;
        const endX = end.left - svgRect.left;
        const endY = end.top + end.height / 2 - svgRect.top;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'cardConnectorPath');

        const d = `
          M ${startX} ${startY}
          C ${(startX + endX) / 2} ${startY},
            ${(startX + endX) / 2} ${endY},
            ${endX} ${endY}
        `;

        path.setAttribute('d', d);
        svg.appendChild(path);
      }
    }


    drawConnectors();
    window.addEventListener('resize', drawConnectors);
    return () => window.removeEventListener('resize', drawConnectors);
  }, []);

  return (
    <Section name="about" className={style.root}>
      <Container grid>
        <Row start={1} end={3}>
          <ContentBlock>
            <div className={style.headingContainer}>
              <Heading
                misaligned
                key={intro[0]}
                className={`${style.font} ${style.portfolioHeading} ${style.customHeading}`}
              >
                <span className={style.glowText}>Rewards & Benefits</span>
              </Heading>
            </div>
            <div className={style.grid}>
              {rewards.map((reward, index) => (
                <motion.div
                  key={index}
                  className={style.card}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className={style.icon}>{reward.icon}</div>
                  <div className={style.title}>{reward.title}</div>
                  <div className={style.description}>{reward.description}</div>
                </motion.div>
              ))}
            </div>
          </ContentBlock>
        </Row>
      </Container>
      <Container grid outerRightOnMobile>
        <Row start={1} end={3}>
          <div className={`${style.section} ${style.headingContainer}`}>
            <Heading
              misaligned
              key={intro[0]}
              className={`${style.font} ${style.portfolioHeading} ${style.customHeading}`}
            >
              <span className={style.glowText}>Evaluation Criteria</span>
            </Heading>
          </div>
        </Row>
      </Container>
      <Container>
        <Row start={1} end={3}>
          <div className={style.modernTimeline}>
            {roadmapItems.map((item, index) => (
              <div
                key={index}
                className={`${style.modernCard} ${style[`color-${(index % 4) + 1}`]}`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className={style.cardContent}>
                  <img src={item.img} width={140} alt="" />
                  <div className={style.cardNumber}>{index + 1}</div>
                  <h3 className={style.cardTitle}>{item.title}</h3>
                  <p className={style.cardDescription}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Row>
      </Container>
      <Container grid outerRightOnMobile>
        <Row start={1} end={3}>
          <div className={`${style.section} ${style.headingContainer}`}>
            <Heading
              misaligned
              key={intro[0]}
              className={`${style.font} ${style.portfolioHeading} ${style.customHeading}`}
            >
              <span className={style.glowText}>Timeline</span>
            </Heading>
          </div>
        </Row>
      </Container>
      <Container>
        <Row start={1} end={3}>
          <div className={style.timelineContainer}>
            {[
              {
                title: 'Registration',
                date: 'July 15 - Aug 15, 2025',
                description: 'Register your team and get ready',
                icon: '📝',
                color: '#6366F1'
              },
              {
                title: 'Kickoff',
                date: 'August 16, 2025',
                description: 'Event begins with opening ceremony',
                icon: '🚀',
                color: '#EC4899'
              },
              {
                title: 'Coding Phase',
                date: 'Aug 16 - 30, 2025',
                description: 'Teams work on their solutions',
                icon: '💻',
                color: '#10B981'
              },
              {
                title: 'Submission',
                date: 'August 30, 2025',
                description: 'Final submissions due',
                icon: '📤',
                color: '#F59E0B'
              },
              {
                title: 'Judging',
                date: 'Aug 31 - Sep 5',
                description: 'Expert evaluation period',
                icon: '🏆',
                color: '#3B82F6'
              },
              {
                title: 'Results',
                date: 'September 10, 2025',
                description: 'Winners announced',
                icon: '🎉',
                color: '#8B5CF6'
              }
            ].map((milestone, index) => (
              <motion.div 
                key={index}
                className={style.timelineItem}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }
                }}
                viewport={{ once: true }}
              >
                <div 
                  className={style.timelineDot}
                  style={{ backgroundColor: milestone.color }}
                >
                  <span className={style.timelineIcon}>{milestone.icon}</span>
                </div>
                <div className={style.timelineContent}>
                  <div className={style.timelineDate}>{milestone.date}</div>
                  <h3 className={style.timelineTitle}>{milestone.title}</h3>
                  <p className={style.timelineDescription}>{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Row>
      </Container>
    </Section>
  )
}
export default About
