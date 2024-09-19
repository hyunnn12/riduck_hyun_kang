import React from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';

const WorkoutChart = ({ stages }) => {
    const FTP = 250;
    const dataSeries = [];
    let currentTime = 0;
    let totalDuration = 0; // 총 운동 시간을 저장할 변수

    // 각 워크아웃 단계를 순회하며 차트의 데이터 시리즈를 생성
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
            totalDuration += duration; // 총 시간 누적
        } else if (name === 'SteadyState') {
            label = 'SteadyState';
            const power = FTP * Power;
            const duration = parseInt(Duration);

            for (let i = 0; i <= duration; i += 10) {
                dataPoints.push({ x: currentTime + i, y: power });
            }
            currentTime += duration;
            totalDuration += duration; // 총 시간 누적
        } else if (name === 'IntervalsT') {
            label = 'IntervalsT';
            for (let repeat = 0; repeat < Repeat; repeat++) {
                // On interval
                const onDuration = parseInt(OnDuration);
                for (let i = 0; i <= onDuration; i += 10) {
                    dataPoints.push({ x: currentTime + i, y: FTP * OnPower });
                }
                currentTime += onDuration;
                totalDuration += onDuration; // 총 시간 누적

                // Off interval
                const offDuration = parseInt(OffDuration);
                for (let i = 0; i <= offDuration; i += 10) {
                    dataPoints.push({ x: currentTime + i, y: FTP * OffPower });
                }
                currentTime += offDuration;
                totalDuration += offDuration; // 총 시간 누적
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
            totalDuration += duration; // 총 시간 누적
        }

        // 각 파워 존에 따라 색상 결정
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
            enabled: true
        },
        legend: {
            cursor: "pointer",
            itemclick: (e) => {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            }
        },
        data: dataSeries
    };

    // 총 운동 시간 계산 (초 -> 분 변환)
    const totalTimeMinutes = Math.round(totalDuration / 60);

    return (
        <div className="workout-chart">
            <CanvasJSChart options={options} />
            {/* 총 운동 시간을 표시하는 부분 */}
            <div className="total-time" style={{ textAlign: 'center', marginTop: '20px' }}>
                <i className="icon-clock">⏰</i> {totalTimeMinutes} 분
            </div>
        </div>
    );
};

export default WorkoutChart;
