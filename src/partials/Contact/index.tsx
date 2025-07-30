import style from './index.module.css'

// Components
import Section from 'components/Section'
import Container, { Row } from 'components/Container'
import ContentBlock from 'components/ContentBlock'
import Heading from 'components/Heading'
import LiquidButton from './LiquidButton'
import RegistrationForm from 'components/RegistrationForm'

// Hooks
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaUserPlus, FaArrowRight } from 'react-icons/fa'
import { useInView } from 'react-intersection-observer'
import { useDispatch } from 'react-redux'
import gsap from 'gsap'

// Services
// import ExcelService from 'utils/excelService'
// import ImageStorageService from 'utils/imageStorageService'
import { useToast } from 'components/ToastManager'
// Icons
import {
  FiMail as Email,
  FiPhone as Phone,
  FiLinkedin as LinkedIn,
  FiInstagram as Instagram,
  FiYoutube as YouTube
} from 'react-icons/fi'

function Contact() {
  const dispatch = useDispatch()
  const { t } = useTranslation('translation', { keyPrefix: 'contact' })
  const intro = t('intro')
  const [isRegistrationFormOpen, setIsRegistrationFormOpen] = useState(false)
  const { showSuccess, showError } = useToast()

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  })
  
  const registerBtnRef = useRef<HTMLAnchorElement>(null)
  
  useEffect(() => {
    if (!registerBtnRef.current || !inView) return;
    
    const btn = registerBtnRef.current;
    const arrow = btn.querySelector(`.${style.arrowIcon}`);
  
    // Reset to initial state
    gsap.set(btn, { 
      scale: 0,
      opacity: 0,
      rotationY: 0
    });
    
    // Kill any existing animations
    gsap.killTweensOf(btn);
    if (arrow) gsap.killTweensOf(arrow);
  
    // Animation sequence
    const tl = gsap.timeline();
    tl.to(btn, {
      scale: 1.1,
      opacity: 1,
      duration: 0.8,
      ease: 'back.out(1.7)'
    })
    .to(btn, {
      rotationY: 360,
      duration: 1.2
    }, '-=0.5')
    .to(btn, {
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)'
    }, '-=0.8');
  
    // Arrow animation
    if (arrow) {
      gsap.to(arrow, {
        x: 8,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5
      });
    }
  
    return () => {
      // Cleanup function
      gsap.killTweensOf(btn);
      if (arrow) gsap.killTweensOf(arrow);
    };
  }, [inView]); // Add inView as a dependency
  
  const overHandler = useCallback(() => {
    dispatch.pointer.setType('hover')
  }, [dispatch])

  const outHandler = useCallback(() => {
    dispatch.pointer.setType('default')
  }, [dispatch])

  const handleRegistrationSubmit = async (formData: any) => {
    try {
      // Generate unique registration ID
      const registrationId = `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Store images for each team member
      for (let i = 0; i < formData.numberOfParticipants; i++) {
        const member = formData.teamMembers[i]
        if (member.idCard) {
          // await ImageStorageService.storeImage(member.idCard, 'idCard', registrationId, i)
        }
      }
      
      // Generate Excel/CSV file
      // try {
      //   await ExcelService.generateExcelFile(formData)
      // } catch (excelError) {
      //   console.warn('Excel generation failed, falling back to CSV:', excelError)
      //   ExcelService.generateCSVFile(formData)
      // }
      
      // Show success message
      showSuccess('Registration submitted successfully! Data file has been downloaded.')
      
    } catch (error) {
      console.error('Registration submission error:', error)
      showError('Error submitting registration. Please try again.')
      throw error
    }
  }

  const handleRegisterClick = () => {
    setIsRegistrationFormOpen(true)
  }

  const contactInfo = [
    {
      icon: <Email />,
      text: 'hackathon@seqato.com',
      href: 'mailto:hackathon@seqato.com',
      ariaLabel: 'Email address'
    },
    {
      icon: <Phone />,
      text: '+91-XXXXXXXXXX',
      href: 'tel:+91XXXXXXXXXX',
      ariaLabel: 'Phone number 1'
    },
    {
      icon: <Phone />,
      text: '+91-XXXXXXXXXX',
      href: 'tel:+91XXXXXXXXXX',
      ariaLabel: 'Phone number 2'
    }
  ];

  const socialMedia = [
    {
      icon: <LinkedIn />,
      text: 'LinkedIn',
      href: 'https://www.linkedin.com/company/seqato/',
      ariaLabel: 'LinkedIn profile'
    },
    {
      icon: <Instagram />,
      text: 'Instagram',
      href: 'https://www.instagram.com/seqato/',
      ariaLabel: 'Instagram profile'
    },
    {
      icon: <YouTube />,
      text: 'YouTube',
      href: 'https://www.youtube.com/@seqato/',
      ariaLabel: 'YouTube channel'
    }
  ];

  const REGISTRATION_LINK = 'https://forms.gle/Pst8hNj8bcHt3AYG8'; // Replace with actual link

  return (
    <Section name="contact" className={style.root} >
      <Container grid>
        <Row start={1} end={1}>
          <ContentBlock>
            <Heading>{intro}</Heading>
          </ContentBlock>
        </Row>
      </Container>

      {/* Register button with liquid effect */}
      <LiquidButton
        text="REGISTER NOW"
        onClick={handleRegisterClick}
        width={220}
        height={60}
        color1="#ff4d4d"
        color2="#f9cb28"
        color3="#ff4d4d"
        color4="#f9cb28"
        color5="#ff4d4d"
        className={style.btnLiquid}
        icon={<FaArrowRight className={style.arrowIcon} />}
      />

      {/* Registration Form Modal */}
      <RegistrationForm
        isOpen={isRegistrationFormOpen}
        onClose={() => setIsRegistrationFormOpen(false)}
        onSubmit={handleRegistrationSubmit}
      />

      <div className={style.contactWrapper}>
        <div className={style.contactSection}>
          {contactInfo.map((item, index) => (
            <a
              key={`contact-${index}`}
              href={item.href}
              className={style.contactItem}
              onMouseEnter={overHandler}
              onMouseLeave={outHandler}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.ariaLabel}
            >
              <span className={style.icon} aria-hidden="true">
                {item.icon}
              </span>
              <span className={style.text}>{item.text}</span>
            </a>
          ))}
        </div>

        <div className={style.socialSection}>
          {socialMedia.map((item, index) => (
            <a
              key={`social-${index}`}
              href={item.href}
              className={style.socialItem}
              onMouseEnter={overHandler}
              onMouseLeave={outHandler}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.ariaLabel}
            >
              <span className={style.socialIcon} aria-hidden="true">
                {item.icon}
              </span>
            </a>
          ))}
        </div>
      </div>
    </Section>
  )
}

export default Contact
