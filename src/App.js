import React, { useState } from 'react';
import WorkoutCard from './components/WorkoutCard';
import { parseXML } from './utils/xmlParser';
import './styles/App.css';

function App() {
    const [workoutData, setWorkoutData] = useState(null);

    // 파일 업로드
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const xmlData = e.target.result;
            // utils.xmlParse.js-> XML 문자열을 JavaScript 객체로 변환
            const parsedData = parseXML(xmlData);
            setWorkoutData(parsedData);
        };
        
        reader.readAsText(file);
    };

    return (
        <div className="App">
            <h1>Workout Visualizer</h1>
            <input type="file" accept=".xml" onChange={handleFileUpload} />
            {workoutData && <WorkoutCard workout={workoutData} />}
        </div>
    );
}

export default App;
