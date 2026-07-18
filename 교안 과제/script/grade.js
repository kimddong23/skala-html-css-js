// ===== 성적 계산기 =====
// 과목마다 점수를 물어봐서 총점이랑 평균을 내고, 합격/불합격을 알려주는 거.
// 배열, 반복문(for), if 조건문을 사용.

function checkGrade() {
    // 과목 이름 배열. 반복문으로 하나씩 점수를 입력받음
    const subjects = ["HTML", "CSS", "JavaScript"];
    let total = 0; // 점수 합계

    // 과목 개수만큼 반복. i는 0, 1, 2 순서로 진행
    for (let i = 0; i < subjects.length; i++) {
        // Number()로 감싸지 않으면 입력값이 문자열로 처리돼 덧셈이 문자열 연결이 됨 (예: "80"+"90" -> "8090")
        const score = Number(prompt(subjects[i] + " 점수를 입력하세요. (0 ~ 100)"));

        // 취소하거나 숫자가 아닌 걸 넣으면 계산을 멈춤
        if (isNaN(score)) {
            alert("어허... 숫자를 입력해라니까 왜 그런걸 입력하십니까");
            return; // 함수 끝내기
        }
        total += score; // total = total + score
    }

    const average = total / subjects.length; // 평균 = 총점 / 과목수
    const passed = average >= 60; // 60점 이상이면 합격

    // \n은 줄바꿈. toFixed(1)로 소수점 한 자리까지 반올림
    alert(
        "===== 성적 결과표 =====\n" +
        "총점 : " + total + "점\n" +
        "평균 : " + average.toFixed(1) + "점\n" +
        "----------------------\n" +
        "결과 : " + (passed ? "합격입니다!" : "불합격, 재수강!")
    );
}
