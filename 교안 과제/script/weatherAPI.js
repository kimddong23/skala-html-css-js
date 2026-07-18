// ===== 날씨 정보 가져오는 부분 =====
// 위도(lat)와 경도(lon)를 받아, 해당 지역의 기온과 습도를 가져와 반환하는 함수.
// export를 붙이면 다른 파일에서 import해서 사용 가능.
// 무료 날씨 API인 Open-Meteo를 사용 (API 키 불필요).

export async function getLiveWeather(lat, lon) {
    // 요청 URL. ${ }에 위도와 경도를 삽입.
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m`;

    // 네트워크 오류에 대비해 try/catch로 감쌈.
    try {
        // fetch로 요청. await로 응답이 올 때까지 대기.
        const response = await fetch(url);
        if (!response.ok) throw new Error("서버 응답이 이상함"); // 응답이 정상이 아니면 catch로 이동

        const data = await response.json(); // 응답을 JSON 객체로 변환

        // 기온과 습도만 골라서 반환
        return {
            temp: data.current.temperature_2m,
            humidity: data.current.relative_humidity_2m
        };
    } catch (error) {
        console.error("날씨 가져오기 실패:", error);
        return null; // 실패 시 null 반환
    }
}
