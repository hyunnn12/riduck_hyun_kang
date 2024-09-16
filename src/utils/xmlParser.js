// XML파일들을 파싱하는 함수 컴포넌트
import { XMLParser } from 'fast-xml-parser';

export const parseXML = (xmlData) => {
    const parser = new XMLParser();
    const jsonObj = parser.parse(xmlData);
    
    // 필요한 데이터 추출

    // XML의 workout 태그 안의 정보를 추출
    const workout = jsonObj.workout_file.workout;
    const workoutDetails = {
        // name 태그의 값 추출
        name: jsonObj.workout_file.name,
        // description 태그의 값 추출
        description: jsonObj.workout_file.description,
        // workout 단계 추출
        stages: workout
    };
    
    return workoutDetails;
};
