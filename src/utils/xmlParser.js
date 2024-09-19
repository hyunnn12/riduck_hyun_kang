//XML 파일을 JavaScript 객체로 변환하여 필요한 데이터를 추출
import { XMLParser } from 'fast-xml-parser';

export const parseXML = (xmlData) => {
    const parser = new XMLParser({
        ignoreAttributes: false,  // 속성을 파싱할 수 있도록 설정
        attributeNamePrefix: "",  // 속성 앞에 붙는 @_를 제거
    });
    const jsonObj = parser.parse(xmlData);

    // 워크아웃 단계 추출
    const workout = jsonObj.workout_file.workout;
    let stages = [];

    // 단계별로 파싱
    for (const key in workout) {
        if (Array.isArray(workout[key])) {
            // 각 단계가 배열인 경우
            workout[key].forEach((stage) => {
                stages.push({
                    name: key,
                    ...stage // 모든 속성 추가
                });
            });
        } else if (typeof workout[key] === 'object') {
            // 단일 객체로 존재하는 경우
            stages.push({
                name: key,
                ...workout[key] // 모든 속성 추가
            });
        }
    }

    // 콘솔에 파싱된 데이터 출력
    console.log('Parsed stages:', stages);

    const workoutDetails = {
        name: jsonObj.workout_file.name,
        description: jsonObj.workout_file.description,
        stages: stages
    };
    
    return workoutDetails;
};
