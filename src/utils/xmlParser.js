// XML 파일을 JavaScript 객체로 변환하여 필요한 데이터를 추출
import { XMLParser } from "fast-xml-parser";

// XMLData: XML 문자열
export const parseXML = (xmlData) => {
  // XMLParser를 이용하여 XML을 JavaScript 객체로 변환
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    preserveOrder: true, // XML 노드의 순서를 유지하도록 설정
  });

  // JavaScript 객체로 변환한 값을 jsonObj에 저장
  const jsonObj = parser.parse(xmlData);

  // 워크아웃 단계 추출
  const workout = jsonObj.workout_file.workout;
  let stages = [];

  // 단계별로 파싱
  for (const key in workout) {
    // 파싱된 결과가 배열 객체와 단일 객체로 나눠 배열에 넣어준다
    if (Array.isArray(workout[key])) {
      // 각 단계가 배열인 경우
      workout[key].forEach((stage) => {
        stages.push({
          name: key,
          ...stage, // 모든 속성 추가
        });
      });
    } else if (typeof workout[key] === "object") {
      // 단일 객체로 존재하는 경우
      stages.push({
        name: key,
        ...workout[key], // 모든 속성 추가
      });
    }
  }

  // 콘솔에 파싱된 데이터 출력
  console.log("Parsed stages:", stages);

  // 파싱된 정보들을 객체에 저장
  const workoutDetails = {
    name: jsonObj.workout_file.name,
    description: jsonObj.workout_file.description,
    stages: stages,
  };

  return workoutDetails;
};
