import React, { useState } from "react";
import WorkoutCard from "./components/WorkoutCard";
import { parseXML } from "./utils/xmlParser";
import "./styles/App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Typography, Button, Input } from "@mui/material";

// mui 테마 설정
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ff4081",
    },
    grey: {
      main: "#BEBEBE",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

function App() {
  const [workoutData, setWorkoutData] = useState(null);

  // 파일 업로드
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // 파일 선택 확인
    // 파일이 존재하는지 확인
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const xmlData = e.target.result;
        const parsedData = parseXML(xmlData); // XML 파싱
        setWorkoutData(parsedData);
      };
      reader.readAsText(file); // 텍스트 형식으로 파일 읽기
    }
  };

  return (
    // 큰 제목
    <ThemeProvider theme={theme}>
      <Box sx={{ textAlign: "center", padding: 3 }}>
        <Typography variant="h4" component="h1" sx={{ marginBottom: 3 }}>
          Workout Visualizer
        </Typography>

        {/* 업로드 버튼 */}
        <Button
          variant="contained"
          component="label"
          color="inherit"
          sx={{ backgroundColor: "#BEBEBE" }}
        >
          Upload XML File
          <Input
            type="file"
            accept=".xml"
            onChange={handleFileUpload}
            sx={{ display: "none" }}
          />
        </Button>

        {/* workout 데이터가 존재한다면 카드를 불러오기 */}
        {workoutData && <WorkoutCard workout={workoutData} />}
      </Box>
    </ThemeProvider>
  );
}

export default App;
