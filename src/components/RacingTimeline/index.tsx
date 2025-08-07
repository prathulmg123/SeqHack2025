import React from 'react';
import style from './index.module.css';

interface RacingTimelineProps {
  steps: {
    number: number;
    title: string;
    description: string;
  }[];
}

export const RacingTimeline: React.FC<RacingTimelineProps> = ({ steps }) => {
  return (
    <div className={style.racingTimeline}>
      {/* Start Line */}
      <div className={style.startLine}>
        <div className={style.flagIcon}>🏁</div>
        <h3>START</h3>
      </div>
      
      {/* Race Track */}
      <div className={style.raceTrack}>
        {/* Checkpoints */}
        {steps.map((step) => (
          <div key={step.number} className={style.checkpoint}>
            <div className={style.checkpointNumber}>{step.number}</div>
            <div className={style.checkpointContent}>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
            {step.number < steps.length && (
              <div className={style.trackLine}></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Finish Line */}
      <div className={style.finishLine}>
        <div className={style.flagIcon}>🏁</div>
        <h3>FINISH</h3>
      </div>
    </div>
  );
};

export default RacingTimeline;
