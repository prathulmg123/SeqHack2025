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
          

             <img src={pt('image') as string} alt={project} />
          
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
