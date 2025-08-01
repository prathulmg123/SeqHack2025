"use client";

import { motion } from "framer-motion";
import styles from "./index.module.css";
import { slideInFromTop } from "@/lib/motion";

interface EncryptionProps {
  onRegisterClick: () => void;
}

export const Encryption = ({ onRegisterClick }: EncryptionProps) => {
  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 1,
          ease: [0.16, 0.77, 0.47, 0.97],
          delay: 0.5
        }
      }}
      viewport={{ once: false, margin: "-20% 0px 0px 0px" }}
    >
      <motion.div 
        className={styles.lockWrapper}
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ 
          y: 0, 
          opacity: 1,
          transition: {
            delay: 1.8,
            duration: 1.8,
            ease: [0.16, 0.77, 0.47, 0.97]
          }
        }}
        viewport={{ once: false, margin: "0px 0px -20% 0px" }}
      >
        <div className={styles.lockGroup}>
          {/* <motion.div
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{
              y: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 2,
                ease: "easeInOut"
              }
            }}
          > */}
            <img
              src="/images/lock-top.png"
              alt="Lock top"
              width={40}
              height={40}
              className={styles.lockTop}
            />
          {/* </motion.div> */}
          <img
            src="/images/lock-main.png"
            alt="Lock main"
            width={60}
            height={60}
            className={styles.lockMain}
          />
        </div>

        <motion.button 
          className={styles.registerButton}
          onClick={onRegisterClick}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)',
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.95,
            transition: { duration: 0.1 }
          }}
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ 
            y: 0, 
            opacity: 1,
            transition: {
              delay: 1.2,
              duration: 0.8,
              ease: [0.16, 0.77, 0.47, 0.97]
            }
          }}
          viewport={{ once: false, margin: "0px 0px -10% 0px" }}
        >
          Register Now
        </motion.button>
      </motion.div>
      
      <motion.div 
        className={styles.bgVideoWrapper}
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ 
          y: 0, 
          opacity: 1,
          transition: {
            delay: 1.0,
            duration: 1.0,
            ease: [0.16, 0.77, 0.47, 0.97]
          }
        }}
        viewport={{ once: false, margin: "0px 0px -20% 0px" }}
      >
        <video
          loop
          muted
          autoPlay
          playsInline
          preload="false"
          className={styles.bgVideo}
        >
          <source src="/images/encryption-bg.webm" type="video/webm" />
        </video>
      </motion.div>
    </motion.div>
  );
};
