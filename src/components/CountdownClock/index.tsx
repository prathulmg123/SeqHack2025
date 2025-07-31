// CountdownClock.tsx
import React, { useEffect, useRef, useState } from 'react'
import style from './index.module.css'

interface CountdownClockProps {
  endDate: string; // ISO string format: '2025-08-15T23:59:59'
  animationDelay?: number;
}

const CountdownClock: React.FC<CountdownClockProps> = ({ endDate, animationDelay = 0 }) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  })
  const [isAnimatedIn, setIsAnimatedIn] = useState(false)

  const radius = 45
  const circumference = 2 * Math.PI * radius

  const calculateTimeLeft = () => {
    const now = new Date().getTime()
    const end = new Date(endDate).getTime()
    const difference = end - now

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true
      }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false
    }
  }

  const updateCountdown = () => {
    const timeLeft = calculateTimeLeft()
    setTimeLeft(timeLeft)
    
    if (timeLeft.isExpired && intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  useEffect(() => {
    updateCountdown()
    intervalRef.current = setInterval(updateCountdown, 1000)
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [endDate])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimatedIn(true)
    }, animationDelay)

    return () => clearTimeout(timer)
  }, [animationDelay])

  // Calculate the percentage of time remaining for the progress circle
  const totalSeconds = 60 // We'll show progress for seconds in the current minute
  const progressOffset = ((totalSeconds - timeLeft.seconds) / totalSeconds) * circumference

  const formatNumber = (num: number) => num < 10 ? `0${num}` : num

  if (timeLeft.isExpired) {
    return (
      <div className={style.expiredMessage}>
        Registration Closed
      </div>
    )
  }

  return (
    <div className={`${style.clockWrapper} ${isAnimatedIn ? style.animateIn : ''}`}>
      <div className={style.clockContainer}>
        <div className={style.headerText}>REGISTRATION <br></br>ENDS IN</div>
        <svg className={style.circleSvg} viewBox="0 0 100 100">
          <circle
            className={style.clockBackground}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
          />
          <circle
            className={style.clockProgress}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#bc64f8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            transform="rotate(-90 50 50)"
          />
        </svg>
        
        <div className={style.digitalClock}>
          {timeLeft.days > 0 && (
            <>
            <div className={style.timeSegment}>
              <span className={style.timeNumber}>{formatNumber(timeLeft.days)}</span>
              <span className={style.timeLabel}>DAYS</span>
            </div>
            <div className={style.timeSeparator}>:</div>
            </>
          )}
          <div className={style.timeSegment}>
            <span className={style.timeNumber}>{formatNumber(timeLeft.hours)}</span>
            <span className={style.timeLabel}>HOURS</span>
          </div>
          <div className={style.timeSeparator}>:</div>
          <div className={style.timeSegment}>
            <span className={style.timeNumber}>{formatNumber(timeLeft.minutes)}</span>
            <span className={style.timeLabel}>MIN</span>
          </div>
          <div className={style.timeSeparator}>:</div>
          <div className={style.timeSegment}>
            <span className={style.timeNumber}>{formatNumber(timeLeft.seconds)}</span>
            <span className={style.timeLabel}>SEC</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountdownClock
