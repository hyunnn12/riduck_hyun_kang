import React from 'react';
import WorkoutChart from './WorkoutChart';

const WorkoutCard = ({ workout }) => {
    
    return (
        <div className="workout-card">
            <h2>{workout.name}</h2>
            <p>{workout.description}</p>
            <WorkoutChart stages={workout.stages} />
        </div>
    );
};

export default WorkoutCard;
