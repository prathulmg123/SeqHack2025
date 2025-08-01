import style from './index.module.css'

// Components
import Section from 'components/Section'
import Container, { Row } from 'components/Container'
import ContentBlock from 'components/ContentBlock'
import Heading from 'components/Heading'
import LiquidButton from './LiquidButton'
import RegistrationForm from 'components/RegistrationForm'
import ApiTest from 'components/ApiTest'
import { motion } from 'framer-motion';

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
import { submitRegistration } from 'utils/registrationService'
import { useToast } from 'components/ToastManager'
// Icons
import {
  FiMail as Email,
  FiPhone as Phone,
  FiLinkedin as LinkedIn,
  FiInstagram as Instagram,
  FiYoutube as YouTube
} from 'react-icons/fi'
import { Encryption } from '@/components/RegisterEncrypt'

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
  
  const outHandler = useCallback(() => {
    dispatch.pointer.setType('default')
  }, [dispatch.pointer])

 const overHandler = useCallback(() => {
    dispatch.pointer.setType('hidden')
  }, [dispatch.pointer])


  const handleRegistrationSubmit = async (formData: any) => {
    try {
      // Submit the registration data
      const result = await submitRegistration(formData);
      
      // Show success message
      showSuccess(result.message || 'Registration submitted successfully! Data has been saved to Google Drive.');
      
      // Close the registration form
      setIsRegistrationFormOpen(false);
      
    } catch (error: unknown) {
      console.error('Registration submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error submitting registration. Please try again.';
      showError(errorMessage);
      throw error;
    }
  }

  const handleRegisterClick = () => {
    setIsRegistrationFormOpen(true)
  }

  const contactInfo = [
    {
      icon: <Email />,
      text: 'seqathon@seqato.com',
      href: 'mailto:seqathon@seqato.com',
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
      href: 'https://in.linkedin.com/company/seqato',
      ariaLabel: 'LinkedIn profile'
    },
    {
      icon: <Instagram />,
      text: 'Instagram',
      href: 'https://www.instagram.com/seqato_software/?hl=en',
      ariaLabel: 'Instagram profile'
    },
    {
      icon: <YouTube />,
      text: 'YouTube',
      href: 'https://www.youtube.com/@seqato6196/featured',
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
      {/* <LiquidButton
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
      /> */}
      <Container>
        <ContentBlock className={style.contentBlock}>

       
<div className='contact-div' style={{
  position: 'relative',
  width: '100%',
  margin: '2rem 0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}}>
  <div className='contact-text' style={{
    // position: 'absolute',
    // left: '25%',
    // top: '50%',
    // transform: 'translateY(-50%)',
    fontSize: '0.8rem',
    lineHeight: '1.6',
    color: '#e2e8f0',
    maxWidth: '40%',
    textAlign: 'justify',
    zIndex: 1,
    margin: 0,
    pointerEvents: 'auto' // Ensure the text is clickable
  }}>
    <motion.div
      initial={{ 
        opacity: 0,
        x: -50,
        filter: 'blur(4px)'
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        transition: {
          duration: 0.9,
          ease: [0.16, 0.77, 0.47, 0.97],
          delay: 0.9
        }
      }}
      viewport={{ once: true, margin: "-20% 0px" }}
    >
      Join us for an exciting hackathon!<br></br> Register now to showcase your skills,<br></br> collaborate with others, and build innovative solutions.<br></br> Don’t miss the chance to learn, create, and compete!
    </motion.div>
  </div>
  <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Encryption onRegisterClick={handleRegisterClick} />
  </div>
</div>
</ContentBlock>
</Container>
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
              // href={item.href}
              className={style.contactItem}
              // onMouseEnter={overHandler}
              // onMouseLeave={outHandler}
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

        <div className={style.socialSection} onMouseLeave={outHandler} onMouseEnter={overHandler}>
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
