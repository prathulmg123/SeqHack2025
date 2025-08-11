import style from './index.module.css';

// Components
import Section from 'components/Section';
import Container, { Row } from 'components/Container';
import ContentBlock from 'components/ContentBlock';
import Heading from 'components/Heading';
import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// Helper function to parse date string to Date object
const parseDate = (dateStr: string): Date => {
  const [month, day] = dateStr.split(' ');
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const monthIndex = months.indexOf(month.toUpperCase());
  if (monthIndex === -1) {
    return new Date(NaN); // Invalid month
  }
  return new Date(2025, monthIndex, parseInt(day));
};

// Helper function to get the current stage index
const getCurrentStageIndex = (milestones: any[]): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // First, check if we are currently within any milestone's date range
  for (let i = 0; i < milestones.length; i++) {
    const [startDateStr, endDateStr] = milestones[i].date.split(' - ').map((s: any) =>
      s.trim().replace('(', '').replace(')', '').replace('Evening', '').trim()
    );

    try {
      const startDate = parseDate(startDateStr);
      const endDate = endDateStr ? parseDate(endDateStr) : startDate;

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) continue;

      endDate.setHours(23, 59, 59, 999); // Include the entire end day

      if (today >= startDate && today <= endDate) {
        return i; // This is the current stage
      }
    } catch (e) {
      continue;
    }
  }

  // If no stage is currently active, find the next upcoming one
  for (let i = 0; i < milestones.length; i++) {
    const [startDateStr] = milestones[i].date.split(' - ').map((s: any) =>
      s.trim().replace('(', '').replace(')', '').replace('Evening', '').trim()
    );

    try {
      const startDate = parseDate(startDateStr);
      if (isNaN(startDate.getTime())) continue;

      if (today < startDate) {
        return i; // This is the next upcoming stage
      }
    } catch (e) {
      continue;
    }
  }

  return milestones.length; // Default to a non-existent index if all have passed
};

function About() {
  const { t } = useTranslation('translation', { keyPrefix: 'about' });
  const intro: string[] = t('intro', { returnObjects: true });

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
    },
    {
      title: 'Placeholder',
      date: '',
      year: '',
      description: '',
      icon: '',
      color: ''
    }
  ];

  const [currentStageIndex, setCurrentStageIndex] = useState(-1);

  useEffect(() => {
    setCurrentStageIndex(getCurrentStageIndex(milestones));
  }, []);

  return (
    <Section name="about" className={style.root}>
      <Container grid>
        <Row start={1} end={3}>
          <ContentBlock>
            <div className={style.headingContainer}>
              <Heading
                misaligned
                key="rewards-heading"
                className={`${style.font} ${style.portfolioHeading} ${style.customHeading}`}>
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
              key="timeline-heading"
              className={`${style.font} ${style.portfolioHeading} ${style.customHeading}`}>
              <span className={style.glowText}>Timeline & Milestones</span>
            </Heading>
          </div>
        </Row>
        <Row start={1} end={3}>
          <ContentBlock className={style.contentBlock}>
            <div className={style.specialCardDescription}>
              <p>From registration to the grand finale, every date is a crucial step toward victory. Stay on track with the official SEQATHON 2025 timeline.</p>
            </div>
          </ContentBlock>
        </Row>
      </Container>

      <Container>
        <Row>
          <div className={style.timelineGridWrapper}>
            {/* Row 1: First 3 milestones */}
            <div className={style.timelineRow}>
              {milestones.slice(0, 3).map((milestone, index) => {
                const absoluteIndex = index;
                const isCurrent = absoluteIndex === currentStageIndex;
                return (
                  <React.Fragment key={absoluteIndex}>
                    <div className={style.timelineStep}>
                      <motion.div
                        className={style.timelineCard}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] } }}
                        viewport={{ once: true, margin: "-50px" }}
                        style={{
                          borderColor: isCurrent ? '#10B981' : `${milestone.color}40`,
                          boxShadow: isCurrent ? '0 0 15px #10B98180, 0 0 30px #10B98140' : `0 10px 30px ${milestone.color}20`,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                        animate={isCurrent ? { scale: [1, 1.02, 1], transition: { duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } } : {}}
                      >
                        <div className={style.stepLabel}>
                          Step {absoluteIndex + 1}
                          {isCurrent && (
                            <motion.span className={style.currentBadge} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }}>
                              You Are Here
                            </motion.span>
                          )}
                        </div>
                        <div className={style.cardDate}>
                          {milestone.date}
                          <div className={style.cardYear}>{milestone.year}</div>
                        </div>
                        <h3 className={style.cardTitle}>{milestone.title}</h3>
                        <p className={style.cardDescription}>{milestone.description}</p>
                      </motion.div>
                      {index < 2 ? (
                        <div className={style.arrowRight}>
                          <svg width="32" height="32" viewBox="0 0 24 24"><path d="M4 12h16m0 0l-6-6m6 6l-6 6" stroke="#EC4899" strokeWidth="2" fill="none" /></svg>
                        </div>
                      ) : (
                        <div className={style.arrowDown}>
                          <svg width="32" height="32" viewBox="0 0 24 24"><path d="M12 4v16m0 0l6-6m-6 6l-6-6" stroke="#EC4899" strokeWidth="2" fill="none" /></svg>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                )
              })}
            </div>

            {/* Row 2: Next 3 milestones (reversed) */}
            <div className={style.timelineRow}>
              {[...milestones.slice(3, 6)].reverse().map((milestone, index) => {
                const absoluteIndex = 5 - index;
                const isCurrent = absoluteIndex === currentStageIndex;
                return (
                  <React.Fragment key={absoluteIndex}>
                    <div className={style.timelineStep}>
                      <motion.div
                        className={style.timelineCard}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] } }}
                        viewport={{ once: true, margin: "-50px" }}
                        style={{
                          borderColor: isCurrent ? '#10B981' : `${milestone.color}40`,
                          boxShadow: isCurrent ? '0 0 15px #10B98180, 0 0 30px #10B98140' : `0 10px 30px ${milestone.color}20`,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                        animate={isCurrent ? { scale: [1, 1.02, 1], transition: { duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } } : {}}
                      >
                        <div className={style.stepLabel}>
                          Step {absoluteIndex + 1}
                          {isCurrent && (
                            <motion.span className={style.currentBadge} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }}>
                              You Are Here
                            </motion.span>
                          )}
                        </div>
                        <div className={style.cardDate}>
                          {milestone.date}
                          <div className={style.cardYear}>{milestone.year}</div>
                        </div>
                        <h3 className={style.cardTitle}>{milestone.title}</h3>
                        <p className={style.cardDescription}>{milestone.description}</p>
                      </motion.div>
                      {index < 2 ? (
                        <div className={style.arrowRight}>
                          <svg width="32" height="32" viewBox="0 0 24 24"><path d="M20 12H4m0 0l6-6m-6 6l6 6" stroke="#EC4899" strokeWidth="2" fill="none" /></svg>
                        </div>
                      ) : (
                        <div className={style.arrowDown}>
                          <svg width="32" height="32" viewBox="0 0 24 24"><path d="M12 4v16m0 0l6-6m-6 6l-6-6" stroke="#EC4899" strokeWidth="2" fill="none" /></svg>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                )
              })}
            </div>

            {/* Row 3: Last 3 milestones */}
            <div className={style.timelineRow}>
              {milestones.slice(6, 9).map((milestone, index) => {
                const absoluteIndex = index + 6;
                const isCurrent = absoluteIndex === currentStageIndex;
                // Hide the 9th card (placeholder)
                if (absoluteIndex === 8) {
                  return null;
                }
                return (
                  <React.Fragment key={absoluteIndex}>
                    <div className={style.timelineStep}>
                      <motion.div
                        className={style.timelineCard}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] } }}
                        viewport={{ once: true, margin: "-50px" }}
                        style={{
                          borderColor: isCurrent ? '#10B981' : `${milestone.color}40`,
                          boxShadow: isCurrent ? '0 0 15px #10B98180, 0 0 30px #10B98140' : `0 10px 30px ${milestone.color}20`,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                        animate={isCurrent ? { scale: [1, 1.02, 1], transition: { duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } } : {}}
                      >
                        <div className={style.stepLabel}>
                          Step {absoluteIndex + 1}
                          {isCurrent && (
                            <motion.span className={style.currentBadge} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }}>
                              You Are Here
                            </motion.span>
                          )}
                        </div>
                        <div className={style.cardDate}>
                          {milestone.date}
                          <div className={style.cardYear}>{milestone.year}</div>
                        </div>
                        <h3 className={style.cardTitle}>{milestone.title}</h3>
                        <p className={style.cardDescription}>{milestone.description}</p>
                      </motion.div>
                      {index < 1 && (
                        <div className={style.arrowRight}>
                          <svg width="32" height="32" viewBox="0 0 24 24"><path d="M4 12h16m0 0l-6-6m6 6l-6 6" stroke="#EC4899" strokeWidth="2" fill="none" /></svg>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        </Row>
      </Container>
    </Section>
  );
}

export default About;
