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

import { FaTrophy, FaGift, FaRocket, FaCode } from 'react-icons/fa'
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
      icon: <img src="/images/cash.png" alt="Prize Money" className={style.rewardImage} />,
      title: 'Substantial Prize Pool',
      description: 'Compete for a total prize pool valued at over ₹1,00,000, with significant cash awards distributed among the top finalist teams.',
    },
    {
      icon: <img src="/images/gift.png" alt="Prize Money" className={style.rewardImage} />,
      title: 'Exclusive Merchandise & Swag',
      description: <>{'All finalists will receive a limited-edition SEQATHON kit, which includes:'}<br />• Official Event T-Shirt<br />• Custom Sticker Pack<br />• Certificate of Achievement<br />• And more surprise perks</>,
    },
    {
      icon: <img src="/images/boost.png" alt="Prize Money" className={style.rewardImage} />,
      title: 'Career & Portfolio Development',
      description: 'Develop a high-impact project to feature in your professional portfolio. Top performers will gain exclusive access to internship interviews and career opportunities at SEQATO.',
    },
    {
      icon: <img src="/images/pc.png" alt="Prize Money" className={style.rewardImage} />,
      title: 'Mentorship & Networking',
      description: 'Engage directly with senior engineers and tech leads from SEQATO. Collaborate with talented peers from across the nation and build lasting connections with industry leaders.',
    },
  ]

  const roadmapItems = [
    { num: '01', title: 'Code Quality', desc: 'Robust, clean, and efficient code implementation', img: '/public/images/browser.png' },
    { num: '02', title: 'Innovation', desc: 'Creative and practical solutions that push boundaries', img: '/public/images/ideaInov.png' },
    { num: '03', title: 'Presentation', desc: 'Clear, engaging, and professional demonstration', img: '/public/images/presentation.png' },
    // { num: '04', title: 'Impact', desc: 'Real-world applicability and potential', img: '/public/images/browser.png' }
  ];

  const milestones = [
    {
      title: 'Registration',
      date: 'AUG 04 - AUG 16',
      year: '2025',
      description: 'Sign up your team to participate in the hackathon.',
      icon: '📝',
      color: '#6366F1'
    },
    {
      title: 'Qualifier Challenge Release',
      date: 'AUG 23',
      year: '2025',
      description: 'The official problem statement for the first challenge will be released exclusively to the shortlisted qualifier teams.',
      icon: '🚀',
      color: '#EC4899'
    },
    {
      title: 'Qualifier Submission Deadline',
      date: 'AUG 30',
      year: '2025',
      description: 'All qualifier teams must submit their completed solutions for this phase via the designated repository for evaluation.',
      icon: '🎓',
      color: '#3B82F6'
    },
    {
      title: 'Finalist Announcement & Onboarding',
      date: 'SEP 03 - SEP 06',
      year: '2025',
      description: 'The top 10 teams advancing to the Grand Finale are announced. These teams will then confirm their participation by completing the final registration and payment.',
      icon: '👥',
      color: '#8B5CF6'
    },
    {
      title: 'Final Challenge Release',
      date: 'SEP 16',
      year: '2025',
      description: 'The exclusive, in-depth problem statement for the Grand Finale is released to the 10 finalist teams to kick off the final development sprint.',
      icon: '💻',
      color: '#10B981'
    },
    {
      title: 'Final Submission Deadline',
      date: 'SEP 18',
      year: '2025',
      description: 'The final development phase concludes. All code and project materials for the Grand Finale must be submitted via GitLab by midnight.',
      icon: '⚙️',
      color: '#F59E0B'
    },
    {
      title: 'Project Showcase (On-site)',
      date: 'SEP 20',
      year: '2025',
      description: 'The 10 finalist teams present their solutions and give a live demonstration to our elite jury at the SEQATO headquarters.',
      icon: '📑',
      color: '#F97316'
    },
    {
      title: 'Winners Announcement & Ceremony',
      date: 'SEP 20 - (Evening)',
      year: '2025',
      description: 'The SEQATHON 2025 champions are announced, followed by the prize distribution and official closing ceremony.',
      icon: '🏆',
      color: '#8B5CF6'
    }
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
            <div className={style.grid} >
              <Row start={1} end={3}>
                <ContentBlock className={style.contentBlock}>
                  <div className={style.specialCardDescription}>
                    <p>Unlock career-defining opportunities, gain elite mentorship, and compete for a substantial prize pool.</p>
                  </div>

                </ContentBlock>
              </Row>
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
      {/* <Container grid outerRightOnMobile>
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
      </Container> */}
      {/* <Container grid >
        <Row start={1} end={3}>
          <ContentBlock className={style.contentBlock}>
            <div className={style.specialCardDescription}>
              <p>Evaluation focuses on problem understanding,<br></br> structured approach, code quality, and documentation.<br></br> Creativity, clarity of thought, and teamwork are key across all phases.<br></br> Finalists will also be judged on solution impact, innovation, and presentation.</p>
            </div>

          </ContentBlock>
        </Row>
      </Container> */}
      {/* <Container>
        <ContentBlock>
          <Row start={1} end={3}>
            <div className={style.modernTimeline}>
              <div className={style.roadmapRow}>
                {roadmapItems.map((item, index) => (
                  <div
                    key={index}
                    className={`${style.modernCard} ${style[`color-${(index % 4) + 1}`]}`}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className={style.cardNumber}>{index + 1}</div>
                    <div className={style.cardContent}>
                      <img
                        src={item.img}
                        loading="lazy"
                        decoding="async"
                        alt="Mobile preview"
                        style={{ display: 'block', width: '40%', height: 'auto' }}
                        width={140}

                      />

                      <h3 className={style.cardTitle}>{item.title}</h3>
                      <p className={style.cardDescription}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Row>
        </ContentBlock>
      </Container> */}

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
      <Container grid >
        <Row start={1} end={3}>
          <ContentBlock className={style.contentBlock}>
            <div className={style.specialCardDescription}>
              <p>Stay on track with clearly defined phases and deadlines.<br></br> Each stage has specific deliverables and review points.<br></br> Timely submissions are crucial for progressing to the next round.</p>
            </div>

          </ContentBlock>
        </Row>
      </Container>
      {/* <Container> */}
      <Container className="timeline-container">
        <ContentBlock>
          <Row start={1} end={3}>

            <div className={style.timelineGridWrapper}>
              {/* Row 1: First 3 milestones */}
              <div className={style.timelineRow}>
                {milestones.slice(0, 3).map((milestone, index, array) => (
                  <React.Fragment key={index}>
                    <div className={style.timelineStep}>
                      <motion.div
                        className={style.timelineCard}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.6,
                            delay: index * 0.1,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        }}
                        viewport={{ once: true, margin: "-50px" }}
                        style={{
                          borderColor: `${milestone.color}40`,
                          boxShadow: `0 10px 30px ${milestone.color}20`,
                        }}
                      >
                        <div className={style.stepLabel}>Step {index + 1}</div>
                        <div className={style.cardDate}>
                          {milestone.date}
                          <div className={style.cardYear}>{milestone.year}</div>
                        </div>
                        <h3 className={style.cardTitle}>{milestone.title}</h3>
                        <p className={style.cardDescription}>{milestone.description}</p>
                      </motion.div>
                      {index < 2 ? (
                        <div className={style.arrowRight}>
                          <svg width="32" height="32" viewBox="0 0 24 24">
                            <path d="M4 12h16m0 0l-6-6m6 6l-6 6" stroke="#EC4899" strokeWidth="2" fill="none" />
                          </svg>
                        </div>
                      ) : (
                        <div className={style.arrowDown}>
                          <svg width="32" height="32" viewBox="0 0 24 24">
                            <path d="M12 4v16m0 0l6-6m-6 6l-6-6" stroke="#EC4899" strokeWidth="2" fill="none" />
                          </svg>
                        </div>

                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Row 2: Next 3 milestones (reversed) */}
              <div className={style.timelineRow}>
                {[...milestones.slice(3, 6)].reverse().map((milestone, index) => (
                  <React.Fragment key={index + 3}>
                    <div className={style.timelineStep}>
                      <motion.div
                        className={style.timelineCard}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.6,
                            delay: index * 0.1,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        }}
                        viewport={{ once: true, margin: "-50px" }}
                        style={{
                          borderColor: `${milestone.color}40`,
                          boxShadow: `0 10px 30px ${milestone.color}20`,
                        }}
                      >
                        <div className={style.stepLabel}>Step {6 - index}</div>
                        <div className={style.cardDate}>
                          {milestone.date}
                          <div className={style.cardYear}>{milestone.year}</div>
                        </div>
                        <h3 className={style.cardTitle}>{milestone.title}</h3>
                        <p className={style.cardDescription}>{milestone.description}</p>
                      </motion.div>
                      {index < 2 && (
                        <div className={style.arrowRight}>
                           <svg width="32" height="32" viewBox="0 0 24 24">
                          <path d="M20 12H4m0 0l6-6m-6 6l6 6" stroke="#EC4899" strokeWidth="2" fill="none" />
                        </svg>
                        </div>
                      )}
                      {index === 0 && (
                        <div className={style.arrowDown}>
                          <svg width="32" height="32" viewBox="0 0 24 24">
                            <path d="M12 4v16m0 0l6-6m-6 6l-6-6" stroke="#EC4899" strokeWidth="2" fill="none" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Row 3: Last 3 milestones */}
              <div className={style.timelineRowThird}>
                {milestones.slice(6, 9).map((milestone, index, array) => (
                  <React.Fragment key={index + 6}>
                    <div className={style.timelineStep}>
                      <motion.div
                        className={style.timelineCard}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.6,
                            delay: index * 0.1,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        }}
                        viewport={{ once: true, margin: "-50px" }}
                        style={{
                          borderColor: `${milestone.color}40`,
                          boxShadow: `0 10px 30px ${milestone.color}20`,
                        }}
                      >
                        <div className={style.stepLabel}>Step {index + 7}</div>
                        <div className={style.cardDate}>
                          {milestone.date}
                          <div className={style.cardYear}>{milestone.year}</div>
                        </div>
                        <h3 className={style.cardTitle}>{milestone.title}</h3>
                        <p className={style.cardDescription}>{milestone.description}</p>
                      </motion.div>
                      {index < 1 && (
                        <div className={style.arrowRight}>
                        <svg width="32" height="32" viewBox="0 0 24 24">
                            <path d="M4 12h16m0 0l-6-6m6 6l-6 6" stroke="#EC4899" strokeWidth="2" fill="none" />
                          </svg>
                        </div>


                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>

            </div>


          </Row>
        </ContentBlock>
      </Container>
    </Section>
  )
}
export default About
