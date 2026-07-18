// ===== 업다운 게임 =====
// index.html에서 버튼 누르면 실행되는 게임.
// 컴퓨터가 1~50 중에 숫자 하나를 정해두고, 내가 맞힐 때까지 Up/Down 힌트를 줌.
//
// (참고) 게임 메시지는 alert 팝업으로 띄우며, 팝업에는 아이콘 없이 텍스트만 사용.

function startGame() {
    // 정답 숫자 뽑기.
    // Math.random()은 0~1 사이 값이라, 50을 곱하고 1을 더해 1~50 범위로 만듦.
    const answer = Math.floor(Math.random() * 50) + 1;
    let count = 0; // 시도 횟수 카운트

    console.log("정답은:", answer); // 디버그용 출력 (개발자도구 콘솔에서 확인)

    // 맞힐 때까지 반복. 정답이거나 취소하면 break로 종료.
    while (true) {
        const guess = Number(prompt("1 ~ 50 사이의 숫자를 맞혀보세요! (취소하면 종료)"));

        // 취소를 누르거나 아무것도 안 넣으면 게임 끝
        if (!guess) {
            alert("게임을 종료합니다. 안녕히 가세요~");
            break;
        }

        count++; // 시도 횟수 증가

        if (guess === answer) {
            alert("정답! " + count + "번 만에 맞히셨습니다.");
            break;
        } else if (guess > answer) {
            alert("Down! 더 작은 숫자예요. (" + count + "회 시도)");
        } else {
            alert("Up! 더 큰 숫자예요. (" + count + "회 시도)");
        }
    }
}
