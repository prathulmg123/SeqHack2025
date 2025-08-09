// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'

// Hooks
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import useTransitionStage from 'hooks/useTransitionStage'
import { useTranslation } from 'react-i18next'

// COmponents
import Container from 'components/Container'

// Icons
import { ExternalArrow } from 'components/Icons'

const ProjectHero = () => {
  const dispatch = useDispatch()

  const { project } = useParams()
  const ts = useTransitionStage()

  const { t } = useTranslation('translation')
  const { t: pt } = useTranslation(project)

  const overHandler = useCallback(() => {
    dispatch.pointer.setType('hover')
  }, [dispatch.pointer])

  const outHandler = useCallback(() => {
    dispatch.pointer.setType('default')
  }, [dispatch.pointer])

  console.log(pt('awards'))
  const modules = pt('modules') as unknown as string[]
  const liveURL = pt('live')

  const classes = cn(style.root, ts && style[ts])

  return (
    <Container withoutMenu>
      <div className={classes}>
        <figure className={style.figure}>
          {project === 'guidelines' ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="Neon blue clipboard checklist icon">
              <defs>
                <linearGradient id="bg" x1="0" x2="1">
                  <stop offset="0%" stopColor="#00121a" />
                  <stop offset="100%" stopColor="#001a26" />
                </linearGradient>
                <filter id="neon" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="outerGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="10" floodColor="#00e6ff" result="b1" />
                  <feMerge>
                    <feMergeNode in="b1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .clip-bg { fill: none; }
                    .clipboard { fill: rgba(0,0,0,0.35); stroke: none; }
                    .outline { 
                      fill: none; 
                      stroke: #00e6ff; 
                      stroke-width: 4; 
                      stroke-linejoin: round; 
                      stroke-linecap: round; 
                      opacity: 0.95; 
                    }
                    .line { 
                      stroke: #00e6ff; 
                      stroke-width: 6; 
                      stroke-linecap: round; 
                      opacity: 0.95; 
                    }
                    .check { 
                      fill: none; 
                      stroke: #00e6ff; 
                      stroke-width: 8; 
                      stroke-linecap: round; 
                      stroke-linejoin: round; 
                    }
                    .shadow { 
                      fill: url(#bg); 
                      opacity: 0.06; 
                    }
                  `
                }} />
              </defs>
              <rect width="512" height="512" rx="32" ry="32" fill="url(#bg)" />
              <g transform="translate(72,68)">
                <rect x="16" y="40" width="352" height="384" rx="20" ry="20" className="clipboard" />
                <rect x="16" y="40" width="352" height="384" rx="20" ry="20" className="outline" filter="url(#neon)" />
                <g transform="translate(120,0)">
                  <rect x="0" y="-10" width="112" height="48" rx="10" ry="10" fill="#00121a" opacity="0.45" />
                  <rect x="0" y="-10" width="112" height="48" rx="10" ry="10" className="outline" filter="url(#outerGlow)" />
                </g>
                <g transform="translate(56,112)">
                  <line x1="0" y1="0" x2="240" y2="0" className="line" />
                  <line x1="0" y1="64" x2="240" y2="64" className="line" />
                  <line x1="0" y1="128" x2="240" y2="128" className="line" />
                  <polyline points="-14,2 10,28 44,-12" className="check" transform="translate(0,-8)" />
                  <polyline points="-14,66 10,92 44,42" className="check" transform="translate(0,-8)" />
                  <polyline points="-14,130 10,156 44,106" className="check" transform="translate(0,-8)" />
                  <circle cx="220" cy="0" r="6" fill="#00e6ff" opacity="0.95" />
                  <circle cx="220" cy="64" r="6" fill="#00e6ff" opacity="0.95" />
                  <circle cx="220" cy="128" r="6" fill="#00e6ff" opacity="0.95" />
                </g>
                <rect x="24" y="48" width="336" height="368" rx="16" ry="16" fill="none" stroke="#00121a" strokeWidth="6" opacity="0.35" />
              </g>
            </svg>
          ) : (
            pt('image') && <img src={pt('image') as string} alt={project} />
          )}
        </figure>
        <div className={style.info}>
          <div className={style.titleContainer}>
            <div className={style.titleInner}>
              <h1 className={style.title}>{pt('title')}</h1>
            </div>
          </div>
          <div className={style.detailContainer}>
            <div className={style.details}>
              <div className={style.detailBlock}>
                {
                  pt('title') === 'Criteria' ? (
                    <div className={classes}>
                    <div className={style.inner}>Success at <strong>SEQATHON</strong> isn’t just about building something that works — it’s about <strong>clarity</strong>, <strong>innovation</strong>, and <strong>execution excellence</strong>.<br></br>Our judging process is designed to reward <strong>well-structured thinking</strong>, <strong>high-quality code</strong>, <strong>creativity</strong>, and <strong>impactful delivery</strong>.Below is a detailed breakdown of how you’ll be evaluated at each stage.</div>
                  </div>
                  ) :pt('title') === 'Guidelines' ?
                    

<div className={classes}>
<div className={style.inner}>Stay on track with each phase of the <strong>hackathon</strong> — from registration to final presentations. Know when to submit, what to expect, and how to prepare at every stage. Follow the guidelines to make the most of your <strong>Seqathon 2025</strong> journey!</div>
</div>
                  : <div className={classes}>
                  <div className={style.inner}>Got Questions? We’ve got answers! Here are the most frequently asked questions about <strong>Seqathon</strong> 2025.</div>
                </div>
                }
              </div>
            </div>

          </div>
        </div>
      </div>
    </Container>
  )
}

export default ProjectHero
