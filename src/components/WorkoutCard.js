// workout 데이터를 받아 카드 형태로 화면에 표시
import React from "react";
import WorkoutChart from "./WorkoutChart";

// workout 객체는 파싱된 XML 파일의 내용
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
