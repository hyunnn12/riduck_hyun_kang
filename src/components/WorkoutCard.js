// workout 데이터를 받아 카드 형태로 화면에 표시
import React from "react";
import WorkoutChart from "./WorkoutChart";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { Box, Typography } from "@mui/material";

// workout 객체는 파싱된 XML 파일의 내용
const WorkoutCard = ({ workout }) => {
  return (
    <div
      className="workout-card"
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      {/* 제목과 아이콘을 수평으로 중앙 정렬 */}
      <Box display="flex" justifyContent="center" alignItems="center">
        <FitnessCenterIcon style={{ marginRight: "8px" }} />
        <Typography variant="h5">{workout.name}</Typography>
      </Box>

      <p>{workout.description}</p>
      <WorkoutChart stages={workout.stages} />
    </div>
  );
};

export default WorkoutCard;
