// ===== 회원가입 입력칸 커스텀 경고 메시지 =====
// 브라우저가 기본으로 띄우는 경고(예: "이 텍스트를 8자 이상 늘리세요") 대신,
// 내가 정한 문구를 띄우는 코드.
// 원리: 입력칸이 조건을 못 맞추면 'invalid' 이벤트가 발생함 → 그때 문구를 교체함.

// 입력칸(id)별로, 위반한 조건에 따라 띄울 문구를 미리 정의
const messages = {
    userID: {
        valueMissing: "아이디를 입력해 주세요.",          // 미입력 시
        tooShort:     "아이디는 4자 이상 입력해 주세요.",   // minlength(4) 못 채웠을 때
        tooLong:      "아이디는 15자까지만 가능해요."       // maxlength(15) 넘었을 때
    },
    userPw: {
        valueMissing: "비밀번호를 입력해 주세요.",
        tooShort:     "비밀번호는 8자 이상 입력해 주세요."   // minlength(8) 못 채웠을 때
    },
    userEmail: {
        typeMismatch: "이메일 형식(@ 포함)으로 입력해 주세요." // 이메일 모양이 아닐 때
    }
};

// 정의한 입력칸들을 순회하며 이벤트를 등록
for (const id in messages) {
    const input = document.querySelector('#' + id);
    if (!input) continue; // 해당 칸이 없으면 건너뜀 (에러 방지)

    // 조건을 못 맞춰 경고가 뜨려는 순간 실행됨
    input.addEventListener('invalid', () => {
        // input.validity에 위반한 조건이 true/false로 담겨 있음
        const rule = messages[id];
        let msg = "입력값을 확인해 주세요."; // 매칭되는 문구가 없을 때의 기본 문구

        // 정의한 조건들을 순서대로 확인해 위반한 조건의 문구를 선택
        for (const key in rule) {
            if (input.validity[key]) {  // 이 조건을 위반했으면
                msg = rule[key];
                break; // 첫 번째로 걸린 것만 사용하고 종료
            }
        }

        input.setCustomValidity(msg); // 브라우저 기본 문구를 커스텀 문구로 교체
    });

    // 다시 입력하면 경고를 비워서 재검사되게 함.
    // (비우지 않으면 한 번 뜬 문구가 계속 남음)
    input.addEventListener('input', () => input.setCustomValidity(''));
}
