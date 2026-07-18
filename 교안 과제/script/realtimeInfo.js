// ===== 실시간 세계 날씨 =====
// weatherAPI.js의 함수를 import해서, 받아온 날씨를 화면에 렌더링함.
// 기본: 도시를 select로 고르면 change 이벤트로 날씨 표시 (교안 실습).
//
// ※ 이 파일은 import를 사용하므로 Live Server 같은 서버 환경에서 열어야 동작함.

import { getLiveWeather } from './weatherAPI.js';

// 자주 쓰는 DOM 요소를 미리 참조해둠
const citySelect = document.querySelector('#city-select'); // 도시 고르는 드롭다운
const weatherBox = document.querySelector('#weather-box'); // 날씨 결과 보여줄 칸
const autoBtn    = document.querySelector('#auto-toggle'); // [추가과제] 자동 순환 버튼

// 날씨를 받아와 화면에 렌더링하는 함수 (도시 선택과 자동순환에서 공통 사용)
async function showWeather(value, label) {
    // "도시를 선택하세요"(none) 선택 시 안내문구만 표시
    if (value === "none") {
        weatherBox.innerHTML = "<p>도시를 선택하면 실시간 날씨가 표시됩니다.</p>";
        return;
    }

    const [lat, lon] = value.split(','); // "37.56,126.97"을 위도/경도로 분리
    weatherBox.innerHTML = "<p>실시간 날씨 불러오는 중...</p>"; // 로딩 문구

    const weather = await getLiveWeather(lat, lon);

    if (weather) {
        weatherBox.innerHTML = `
            <div class="weather-result">
                <h4><i class="bi bi-geo-alt-fill"></i> ${label}</h4>
                <p>기온 : <strong>${weather.temp}&deg;C</strong></p>
                <p>습도 : <strong>${weather.humidity}%</strong></p>
            </div>
        `;
    } else {
        weatherBox.innerHTML = "<p>날씨 정보를 가져오지 못했습니다.</p>";
    }
}

// ===== 교안 실습: 도시를 바꾸면(change 이벤트) 그 도시 날씨를 보여줌 =====
citySelect.addEventListener('change', (event) => {
    const label = citySelect.options[citySelect.selectedIndex].text; // 선택된 도시 이름
    showWeather(event.target.value, label);
});


// ============================================================
// [추가과제] 자동 순환 기능
// ------------------------------------------------------------
// 버튼을 켜면 15초마다 다음 도시로 자동 전환하며 날씨를 보여줌.
// setInterval로 일정 시간마다 반복 실행.
// ============================================================
let timer = null; // setInterval 핸들. null이면 꺼진 상태
let autoIndex = 0; // 자동 순환에서 현재 도시 인덱스

autoBtn.addEventListener('click', () => {
    if (timer) {
        // 켜져 있으면 끄기
        clearInterval(timer);
        timer = null;
        autoBtn.innerHTML = '<i class="bi bi-play-circle"></i> 자동 순환 켜기';
    } else {
        // 꺼져 있으면 켜기
        autoBtn.innerHTML = '<i class="bi bi-pause-circle"></i> 자동 순환 끄기';

        // 다음 도시로 넘어가며 날씨를 보여주는 동작
        const tick = () => {
            // 첫 option(none)은 제외하고 실제 도시들만 순회
            const options = [...citySelect.options].filter(o => o.value !== "none");
            const option = options[autoIndex];
            citySelect.value = option.value;    // 드롭다운도 현재 도시로 동기화
            showWeather(option.value, option.text);
            autoIndex = (autoIndex + 1) % options.length; // 마지막 다음엔 0번으로 순환
        };

        tick();                        // 켜자마자 한 번 실행
        timer = setInterval(tick, 15000); // 이후 15초마다 반복
    }
});
