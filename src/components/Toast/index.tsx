import React, { useEffect, useState } from 'react';
import { FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import style from './index.module.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show toast with animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto hide after duration
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaExclamationTriangle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'info':
        return <FaInfoCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Info';
      default:
        return 'Info';
    }
  };

  return (
    <div className={`${style.toast} ${style[type]} ${isVisible ? style.show : ''}`}>
      <div className={style.icon}>
        {getIcon()}
      </div>
      <div className={style.content}>
        <div className={style.title}>{getTitle()}</div>
        <div className={style.message}>{message}</div>
      </div>
      <button className={style.closeButton} onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}>
        <FaTimes />
      </button>
      <div className={style.progress} style={{ animationDuration: `${duration}ms` }}></div>
    </div>
  );
};

export default Toast; 