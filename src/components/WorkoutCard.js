// 각 워크아웃 정보들을 카드 형태로 보여줄 컴포넌트
import React from 'react';
import WorkoutChart from './WorkoutChart';

const WorkoutCard = ({ workout }) => {
    // 'stages'가 배열인 경우에만 'reduce'를 사용하여 총 운동 시간을 계산합니다.
    const totalDuration = Array.isArray(workout.stages) 
        ? workout.stages.reduce((sum, stage) => sum + parseInt(stage.Duration || 0), 0) 
        : 0;

    return (
        <div className="workout-card">
            <h2>{workout.name}</h2>
            <p>{workout.description}</p>
            <WorkoutChart stages={workout.stages} />
            <div className="workout-duration">Total Duration: {totalDuration} seconds</div>
        </div>
    );
};

export default WorkoutCard;
