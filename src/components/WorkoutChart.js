// 각 차트들을 렌더링하는 컴포넌트
import React from 'react';
import CanvasJSReact from 'canvasjs-react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const WorkoutChart = ({ stages }) => {
    const dataPoints = [];

    // 워크아웃 단계를 순회하며 dataPoints에 추가
    let currentTime = 0;    
    stages.forEach((stage) => {
    const { Duration, PowerLow, PowerHigh, Power, OnPower, OffPower, OnDuration, OffDuration, Repeat } = stage;

    if (stage.name === 'Warmup') {
        dataPoints.push({ x: currentTime, y: 250 * PowerLow });
        currentTime += parseInt(Duration);
        dataPoints.push({ x: currentTime, y: 250 * PowerHigh });
    } else if (stage.name === 'SteadyState') {
        dataPoints.push({ x: currentTime, y: 250 * Power });
        currentTime += parseInt(Duration);
        dataPoints.push({ x: currentTime, y: 250 * Power });
    } else if (stage.name === 'IntervalsT') {
        for (let i = 0; i < Repeat; i++) {
            // On interval
            dataPoints.push({ x: currentTime, y: 250 * OnPower });
            currentTime += parseInt(OnDuration);
            // Off interval
            dataPoints.push({ x: currentTime, y: 250 * OffPower });
            currentTime += parseInt(OffDuration);
        }
    } else if (stage.name === 'Cooldown') {
        dataPoints.push({ x: currentTime, y: 250 * PowerHigh });
        currentTime += parseInt(Duration);
        dataPoints.push({ x: currentTime, y: 250 * PowerLow });
    }
});

    const options = {
        theme: "light2",
        data: [{
            type: "area",
            dataPoints: dataPoints
        }]
    };

    return <CanvasJSChart options={options} />;
};

export default WorkoutChart;
