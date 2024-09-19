import React, { useState } from "react";
import WorkoutCard from "./components/WorkoutCard";
import { parseXML } from "./utils/xmlParser";
import "./styles/App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Typography, Button, Input } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ff4081",
    },
    grey: {
      main: "#BEBEBE", // 회색 추가
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

function App() {
  const [workoutData, setWorkoutData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const xmlData = e.target.result;
      const parsedData = parseXML(xmlData);
      setWorkoutData(parsedData);
    };

    reader.readAsText(file);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ textAlign: "center", padding: 3 }}>
        <Typography variant="h4" component="h1" sx={{ marginBottom: 3 }}>
          Workout Visualizer
        </Typography>

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

        {workoutData && <WorkoutCard workout={workoutData} />}
      </Box>
    </ThemeProvider>
  );
}

export default App;
