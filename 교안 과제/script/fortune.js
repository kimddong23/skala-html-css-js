// ===== [추가과제] 오늘의 개발자 운세 =====
// 페이지를 열거나 '다시 뽑기' 버튼을 누르면, 아래 목록에서 랜덤으로 하나 골라서 보여줌.
// (배열 + Math.random + DOM 조작 = 교안 JS 실습의 확장)

const fortunes = [
    "오늘 금요일 배포는 금지입니다. 주말을 지키세요.",
    "세미콜론 하나가 당신의 3시간을 앗아갈 수 있습니다.",
    "커밋 메시지에 진심을 담아보세요. 'fix' 말고.",
    "오늘 만난 버그는 사실 기능(feature)입니다.",
    "console.log는 당신을 배신하지 않습니다.",
    "오늘 짠 코드는 내일의 당신이 이해하지 못합니다.",
    "git push --force 는 참으세요. 오늘은 특히.",
    "오늘의 에러는 90% 확률로 오타입니다.",
    "리더보드는 새로고침하지 마세요. 정신건강에 해롭습니다.",   // Kaggle 썰
    "빌런은 언젠가 잡힙니다. 아마도.",                        // Kaggle 썰
    "휴식도 실력입니다. 낮잠을 두려워 마세요.",                 // 휴일 일과
    "오늘 배포한 코드는 잘 돌아갈 것입니다. 로컬에서는.",         // 개발 밈
    "HTML은 프로그래밍 언어가 아닙니다. 오늘도 명심하세요.",      // 팀원 썰
    "이불 밖은 위험하지만, 커밋 잔디도 위험합니다.",
    "오늘 하루, 스택오버플로우 접속이 원활할 길일입니다."
];

const el  = document.querySelector('#fortune-text');
const btn = document.querySelector('#fortune-btn');

// 운세 하나 뽑아서 화면에 넣는 함수
function rollFortune() {
    const i = Math.floor(Math.random() * fortunes.length); // 0 ~ (개수-1) 중 랜덤
    el.textContent = fortunes[i];
}

if (el) {
    rollFortune();                                  // 페이지 열자마자 한 번 뽑기
    if (btn) btn.addEventListener('click', rollFortune); // 버튼 누르면 다시 뽑기
}
