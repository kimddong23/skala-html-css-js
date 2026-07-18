// ===== [추가과제] 회원가입 폼 고도화 =====
// 교안 기본 폼에 3가지를 추가로 붙임:
//  1) 비밀번호 보기/숨기기 토글
//  2) 비밀번호 강도 실시간 표시 (길이 + 문자 종류로 점수)
//  3) 자기소개 글자수 실시간 카운터

const pw     = document.querySelector('#userPw');
const toggle = document.querySelector('#pwToggle');
const meter  = document.querySelector('#pwMeter i');
const pwMsg  = document.querySelector('#pwMsg');

// 1) 비밀번호 보기/숨기기 - type을 password <-> text 로 바꿔줌
toggle.addEventListener('click', () => {
    const hidden = pw.type === 'password';
    pw.type = hidden ? 'text' : 'password';
    toggle.innerHTML = hidden ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
});

// 2) 비밀번호 강도 - 입력할 때마다 점수 매겨서 막대 길이/색 변경
pw.addEventListener('input', () => {
    const v = pw.value;
    let score = 0;
    if (v.length >= 8)          score++; // 8자 이상
    if (/[A-Z]/.test(v))        score++; // 대문자 포함
    if (/[0-9]/.test(v))        score++; // 숫자 포함
    if (/[^A-Za-z0-9]/.test(v)) score++; // 특수문자 포함

    // 점수(0~4)에 따라 막대 너비/색/문구 결정
    const levels = [
        { w: '0%',   c: '',        t: '' },
        { w: '33%',  c: '#ef4444', t: '약함' },
        { w: '66%',  c: '#f59e0b', t: '보통' },
        { w: '100%', c: '#22c55e', t: '강함' },
        { w: '100%', c: '#16a34a', t: '아주 강함' }
    ];
    const lv = levels[score] || levels[0];
    meter.style.width = lv.w;
    meter.style.background = lv.c;
    pwMsg.textContent = v ? '비밀번호 강도: ' + lv.t : '';
    pwMsg.style.color = lv.c;
});

// 3) 자기소개 글자수 카운터 - 입력할 때마다 현재 글자 수 갱신
const intro = document.querySelector('#intro');
const introCount = document.querySelector('#introCount');
if (intro && introCount) {
    intro.addEventListener('input', () => {
        introCount.textContent = intro.value.length;
    });
}
