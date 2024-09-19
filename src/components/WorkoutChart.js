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
            const power = FTP * Power;
            const duration = parseInt(Duration);

            for (let i = 0; i <= duration; i += 10) {
                dataPoints.push({ x: currentTime + i, y: power });
            }
            currentTime += duration;
            totalDuration += duration;
        } else if (name === 'IntervalsT') {
            for (let repeat = 0; repeat < Repeat; repeat++) {
                // On interval
                const onDuration = parseInt(OnDuration);
                for (let i = 0; i <= onDuration; i += 10) {
                    dataPoints.push({ x: currentTime + i, y: FTP * OnPower });
                }
                currentTime += onDuration;
                totalDuration += onDuration;

                // Off interval
                const offDuration = parseInt(OffDuration);
                for (let i = 0; i <= offDuration; i += 10) {
                    dataPoints.push({ x: currentTime + i, y: FTP * OffPower });
                }
                currentTime += offDuration;
                totalDuration += offDuration;
            }
        } else if (name === 'Cooldown') {
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
            fillOpacity: 0.5, // 그래프의 투명도 설정
            markerType: "circle", // 마커(점) 모양 설정
            markerSize: 0, // 기본 상태에서는 점을 숨김
            markerColor: zoneColor, // 마커 색상 설정
            highlightEnabled: true, // 선 강조 설정
            toolTipContent: "{x}: {y}" // 툴팁 내용 지정
        });
    });

    // 총 운동 시간 계산 (초 -> 분 변환)
    const totalTimeMinutes = Math.round(totalDuration / 60);

    const options = {
        theme: "light2",
        toolTip: {
            shared: false, // 선 위에서만 툴팁이 나타나도록 설정
            enabled: true // 툴팁을 활성화
        },
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