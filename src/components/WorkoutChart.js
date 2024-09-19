import React from 'react';
import { Box, Paper, Typography, IconButton, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { CanvasJSChart } from 'canvasjs-react-charts';

const WorkoutChart = ({ stages, workoutName, description }) => {
    const FTP = 250;
    const dataSeries = [];
    let currentTime = 0;
    let totalDuration = 0;

    // 차트 데이터 생성 (이전과 동일)
    stages.forEach((stage) => {
        const { Duration, PowerLow, PowerHigh, Power, OnPower, OffPower, OnDuration, OffDuration, Repeat, name } = stage;
        const dataPoints = [];
        let label = '';

        if (name === 'Warmup') {
            label = 'Warmup';
            const startPower = FTP * PowerLow;
            const endPower = FTP * PowerHigh;
            const duration = parseInt(Duration);

            for (let i = 0; i <= duration; i += 10) {
                const power = startPower + ((endPower - startPower) * (i / duration));
                dataPoints.push({ x: currentTime + i, y: power });
            }
            currentTime += duration;
            totalDuration += duration;
        } else if (name === 'SteadyState') {
            label = 'SteadyState';
            const power = FTP * Power;
            const duration = parseInt(Duration);

            for (let i = 0; i <= duration; i += 10) {
                dataPoints.push({ x: currentTime + i, y: power });
            }
            currentTime += duration;
            totalDuration += duration;
        } else if (name === 'IntervalsT') {
            label = 'IntervalsT';
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
        } else if (name === 'Cooldown') {
            label = 'Cooldown';
            const startPower = FTP * PowerHigh;
            const endPower = FTP * PowerLow;
            const duration = parseInt(Duration);

            for (let i = 0; i <= duration; i += 10) {
                const power = startPower + ((endPower - startPower) * (i / duration));
                dataPoints.push({ x: currentTime + i, y: power });
            }
            currentTime += duration;
            totalDuration += duration;
        }

        const getZoneColor = (power) => {
            if (power < 0.4 * FTP) return '#BEBECA';
            if (power < 0.6 * FTP) return '#54AFFE';
            if (power < 0.8 * FTP) return '#4DB6AC';
            if (power < 0.9 * FTP) return '#FF823C';
            return '#F06292';
        };

        const zoneColor = getZoneColor(dataPoints[0].y);
        dataSeries.push({
            type: "area",
            name: label,
            showInLegend: true,
            dataPoints: dataPoints,
            color: zoneColor,
            fillOpacity: 0.5,
            markerType: "circle",
            markerSize: 0,
            markerColor: zoneColor,
            highlightEnabled: true,
            toolTipContent: "{name} | {x}: {y}"
        });
    });

    const options = {
    theme: "light2",
    toolTip: {
        shared: false,
        enabled: true,
    },
    legend: {
        cursor: "pointer",
        horizontalAlign: "center",
        verticalAlign: "bottom",
        maxWidth: 600, // 범례의 최대 너비 설정
        itemWrap: true, // 긴 범례 항목이 줄 바꿈되도록 설정
        maxHeight: 50, // 범례 영역의 최대 높이 설정
        itemclick: (e) => {
            if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        },
        fontSize: 12, // 범례 폰트 크기 조정
        fontFamily: "Arial",
    },
    data: dataSeries,
};



    const totalTimeMinutes = Math.round(totalDuration / 60);

    return (
        <Paper elevation={3} sx={{ padding: 3, margin: '20px auto', maxWidth: '80%', width: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">{workoutName}</Typography>
                <IconButton>
                    <DownloadIcon />
                </IconButton>
            </Box>

            <Typography variant="body1" color="textSecondary" sx={{ marginY: 2 }}>
                {description}
            </Typography>

            <CanvasJSChart options={options} />

            {/* 아래 부분: 시간과 '다음' 버튼 */}
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginTop: 2 }}>
                {/* 왼쪽에 시간 표시 */}
                <Box display="flex" alignItems="center">
                    <AccessTimeIcon sx={{ marginRight: 1 }} />
                    <Typography variant="h6">{totalTimeMinutes} 분</Typography>
                </Box>
                {/* 오른쪽에 '다음' 버튼 */}
                <Button variant="contained" color="primary">
                    다음
                </Button>
            </Box>
        </Paper>
    );
};

export default WorkoutChart;