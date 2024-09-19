import React from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';

const WorkoutCard = ({ stages, workoutName, description }) => {
    const FTP = 250;
    const dataSeries = [];
    let currentTime = 0;
    let totalDuration = 0;

    // 각 워크아웃 단계를 순회하며 차트의 데이터 시리즈를 생성
    stages.forEach((stage) => {
        const { Duration, PowerLow, PowerHigh, Power, OnPower, OffPower, OnDuration, OffDuration, Repeat, name } = stage;
        const dataPoints = [];

        if (name === 'Warmup') {
            dataPoints.push({ x: currentTime, y: FTP * PowerLow });
            currentTime += parseInt(Duration);
            dataPoints.push({ x: currentTime, y: FTP * PowerHigh });
            totalDuration += parseInt(Duration); // 총 운동 시간 추가
        } else if (name === 'SteadyState') {
            dataPoints.push({ x: currentTime, y: FTP * Power });
            currentTime += parseInt(Duration);
            dataPoints.push({ x: currentTime, y: FTP * Power });
            totalDuration += parseInt(Duration); // 총 운동 시간 추가
        } else if (name === 'IntervalsT') {
            for (let i = 0; i < Repeat; i++) {
                // On interval
                dataPoints.push({ x: currentTime, y: FTP * OnPower });
                currentTime += parseInt(OnDuration);
                totalDuration += parseInt(OnDuration); // 총 운동 시간 추가

                // Off interval
                dataPoints.push({ x: currentTime, y: FTP * OffPower });
                currentTime += parseInt(OffDuration);
                totalDuration += parseInt(OffDuration); // 총 운동 시간 추가
            }
        } else if (name === 'Cooldown') {
            dataPoints.push({ x: currentTime, y: FTP * PowerHigh });
            currentTime += parseInt(Duration);
            dataPoints.push({ x: currentTime, y: FTP * PowerLow });
            totalDuration += parseInt(Duration); // 총 운동 시간 추가
        }

        // 각 파워 존에 따라 색상 결정
        const getZoneColor = (power) => {
            if (power < 0.4 * FTP) return '#BEBECA';
            if (power < 0.6 * FTP) return '#54AFFE';
            if (power < 0.8 * FTP) return '#4DB6AC';
            if (power < 0.9 * FTP) return '#FF823C';
            return '#F06292';
        };

        // 각 시리즈의 색상 설정
        const zoneColor = getZoneColor(dataPoints[0].y);
        dataSeries.push({
            type: "area",
            dataPoints: dataPoints,
            color: zoneColor,
            fillOpacity: 0.5 // 그래프의 투명도 설정
        });
    });

    // 총 운동 시간 계산 (초 -> 분 변환)
    const totalTimeMinutes = Math.round(totalDuration / 60);

    const options = {
        theme: "light2",
        data: dataSeries
    };

    return (
        <div className="workout-card" style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', maxWidth: '600px', margin: '20px auto' }}>
            {/* 카드 상단: 제목 및 아이콘 */}
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>{workoutName}</h2>
                <i className="icon-download" style={{ cursor: 'pointer' }}>📥</i> {/* 다운로드 아이콘 */}
            </div>

            {/* 설명 부분 */}
            <p>{description}</p>

            {/* 차트 부분 */}
            <CanvasJSChart options={options} />

            {/* 카드 하단: 총 운동 시간 및 버튼 */}
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <div className="total-time">
                    <i className="icon-clock">⏰</i> {/* 시간 아이콘 */}
                    <span>{totalTimeMinutes} 분</span>
                </div>
                <button className="next-button">다음</button> {/* 다음 버튼 */}
            </div>
        </div>
    );
};

export default WorkoutCard;
    