// ===== 회원가입 결과 표시 =====
// signup.html에서 method="get"으로 제출하면 값들이 주소창 뒤에
// ?userId=juyong&email=... 이렇게 붙어서 넘어옴.
// 여기서 그 값을 읽어서 표(table)로 그려줌.

// URLSearchParams = 주소창 뒤의 값들을 쉽게 꺼내게 도와주는 도구
const params = new URLSearchParams(window.location.search);

// 영어 name(폼에 적은 이름)을 화면에 보여줄 한글 이름으로 바꿔주는 목록
const labels = {
    userId:     "아이디",
    userPw:     "비밀번호",
    email:      "이메일",
    phone:      "전화번호",
    birth:      "생년월일",
    level:      "경력 수준",
    interest:   "관심 분야",
    path:       "가입 경로",
    intro:      "한 줄 소개",
    newsletter: "뉴스레터",
    agree:      "가이드라인 동의"
};

const body = document.querySelector('#result-body'); // 표 내용이 들어갈 자리

// labels에 적어둔 순서대로 항목을 하나씩 표에 넣음
for (const key in labels) {
    // 관심 분야(interest)는 여러 개 체크될 수 있어서 getAll 로 전부 가져와 콤마로 합침
    let value;
    if (key === "interest") {
        const list = params.getAll("interest");
        value = list.length ? list.join(", ") : "-";
    } else {
        // 나머지는 하나만 있음. 값이 없으면 "-" 로 표시
        value = params.get(key) || "-";
    }

    // 비밀번호는 그대로 보여주면 안 되니까 점으로 가림
    if (key === "userPw" && value !== "-") {
        value = "●".repeat(value.length);
    }

    // 표에 한 줄(tr) 추가. th=항목이름, td=값
    const row = document.createElement('tr');
    row.innerHTML = `<th>${labels[key]}</th><td>${value}</td>`;
    body.appendChild(row);
}
