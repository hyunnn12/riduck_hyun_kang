// workout의 데이터를 받아 차트로 만들어주는 컴포넌트
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { CanvasJSChart } from "canvasjs-react-charts";

const WorkoutChart = ({ stages, workoutName, description }) => {
  const [open, setOpen] = useState(false); // 다운로드 알림창의 열림/닫힘 상태 관리
  const [nextOpen, setNextOpen] = useState(false); // 다음 알림창의 열림/닫힘 상태 관리
  const FTP = 250;
  const dataSeries = [];
  let currentTime = 0;
  let totalDuration = 0;

  // workout 단계의 이름이 10자가 넘어가면 나머지는 ...로 대체
  const truncateLabel = (label) => {
    return label.length > 10 ? label.substring(0, 10) + "..." : label;
  };

  // 다운로드 알림창 열기/닫기 핸들러
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDownload = () => {
    setOpen(false);
  };

  // 다음 알림창 열기/닫기 핸들러
  const handleNextOpen = () => {
    setNextOpen(true);
  };
  const handleNextClose = () => {
    setNextOpen(false);
  };
  const handleNext = () => {
    setNextOpen(false);
  };

  // 차트 데이터 생성
  stages.forEach((stage) => {
    const {
      Duration,
      PowerLow,
      PowerHigh,
      Power,
      OnPower,
      OffPower,
      OnDuration,
      OffDuration,
      Repeat,
      name,
    } = stage;
    const dataPoints = [];
    let label = "";

    if (name === "Warmup") {
      label = "Warmup";
      const startPower = FTP * PowerLow;
      const endPower = FTP * PowerHigh;
      const duration = parseInt(Duration);

      for (let i = 0; i <= duration; i += 10) {
        const power = startPower + (endPower - startPower) * (i / duration);
        dataPoints.push({ x: currentTime + i, y: power });
      }
      currentTime += duration;
      totalDuration += duration;
    } else if (name === "SteadyState") {
      label = "SteadyState";
      const power = FTP * Power;
      const duration = parseInt(Duration);

      for (let i = 0; i <= duration; i += 10) {
        dataPoints.push({ x: currentTime + i, y: power });
      }
      currentTime += duration;
      totalDuration += duration;
    } else if (name === "IntervalsT") {
      label = "IntervalsT";
      for (let repeat = 0; repeat < Repeat; repeat++) {
        const onDuration = parseInt(OnDuration);
        for (let i = 0; i <= onDuration; i += 10) {
          dataPoints.push({ x: currentTime + i, y: FTP * OnPower });
        }
        currentTime += onDuration;
        totalDuration += onDuration;

        const offDuration = parseInt(OffDuration);
        for (let i = 0; i <= offDuration; i += 10) {
          dataPoints.push({ x: currentTime + i, y: FTP * OffPower });
        }
        currentTime += offDuration;
        totalDuration += offDuration;
      }
    } else if (name === "Cooldown") {
      label = "Cooldown";
      const startPower = FTP * PowerHigh;
      const endPower = FTP * PowerLow;
      const duration = parseInt(Duration);

      for (let i = 0; i <= duration; i += 10) {
        const power = startPower + (endPower - startPower) * (i / duration);
        dataPoints.push({ x: currentTime + i, y: power });
      }
      currentTime += duration;
      totalDuration += duration;
    }

    // 차트 색상 설정
    const getZoneColor = (power) => {
      if (power < 0.4 * FTP) return "#BEBECA";
      if (power < 0.6 * FTP) return "#54AFFE";
      if (power < 0.8 * FTP) return "#4DB6AC";
      if (power < 0.9 * FTP) return "#FF823C";
      return "#F06292";
    };

    // 데이터 시리즈 생성 및 옵션 설정
    const zoneColor = getZoneColor(dataPoints[0].y);
    dataSeries.push({
      type: "area",
      name: truncateLabel(label),
      dataPoints: dataPoints,
      color: zoneColor,
      fillOpacity: 0.5,
      markerType: "circle",
      markerSize: 0,
      markerColor: zoneColor,
      highlightEnabled: true,
      toolTipContent: "{name} | {x}: {y}",
    });
  });

  // zoomEnabled 속성을 추가
  const options = {
    theme: "light2",
    zoomEnabled: true, // 확대/축소 기능 활성화
    toolTip: {
      shared: false,
      enabled: true,
    },
    data: dataSeries,
  };

  const totalTimeMinutes = Math.round(totalDuration / 60);

  return (
    <Card sx={{ maxWidth: "80%", margin: "0 auto", boxShadow: 3 }}>
      <CardContent>
        {/* 확대/축소 안내 문구 추가 */}
        <Typography
          variant="subtitle1"
          color="textSecondary"
          align="center"
          sx={{ marginBottom: 2 }}
        >
          확대하고 싶은 곳을 마우스로 드래그하여 확대할 수 있습니다.
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ marginBottom: 2 }}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h5">{workoutName}</Typography>
          </Box>
          <IconButton onClick={handleClickOpen}>
            <DownloadIcon />
          </IconButton>
        </Box>

        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ marginBottom: 2 }}
        >
          {description}
        </Typography>

        <CanvasJSChart options={options} />
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", padding: 2 }}>
        <Box display="flex" alignItems="center">
          <AccessTimeIcon sx={{ marginRight: 1 }} />
          <Typography variant="h6">{totalTimeMinutes} 분</Typography>
        </Box>
        <Button
          variant="contained"
          color="inherit"
          sx={{
            backgroundColor: "#BEBEBE",
            color: "#000",
            fontFamily: "Roboto, Arial, sans-serif",
            fontSize: "16px",
          }}
          onClick={handleNextOpen}
        >
          다음
        </Button>
      </CardActions>

      {/* 다운로드 알림창 */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>다운로드 하시겠습니까?</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            취소
          </Button>
          <Button onClick={handleDownload} color="primary" variant="contained">
            다운로드
          </Button>
        </DialogActions>
      </Dialog>

      {/* 다음 알림창 */}
      <Dialog open={nextOpen} onClose={handleNextClose}>
        <DialogTitle>다음으로 이동하시겠습니까?</DialogTitle>
        <DialogActions>
          <Button onClick={handleNextClose} color="primary">
            취소
          </Button>
          <Button onClick={handleNext} color="primary" variant="contained">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default WorkoutChart;
