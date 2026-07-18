# SKALA 4기 · HTML / CSS / JavaScript 과제

신주용의 Full-stack Engineering (HTML · CSS · JavaScript) 실습 과제 모음입니다.
**순수 HTML/CSS/JavaScript로만** 작성했으며, 프레임워크나 빌드 도구는 사용하지 않았습니다.

- GitHub: https://github.com/kimddong23/skala-html-css-js

---

## 폴더 구조

```
과제 제출/
├── index.html                  # 전체 과제 포털 (랜딩 페이지)
│
├── 교안 과제/                   # 교안(강의) 실습 — HTML/CSS/JS 기초 ~ 심화
│   ├── index.html              # 포털 메인 Hub (시맨틱 레이아웃 + 날씨 + 게임)
│   ├── myProfile.html          # 나의 소개  (목록 ul / ol / dl)
│   ├── myClass.html            # 강의 시간표 (표 rowspan / colspan)
│   ├── myHoliday.html          # 휴일 일과  (br / mark 텍스트 서식)
│   ├── myTrip.html             # 여행지 소개 (시맨틱 태그 + 이미지/오디오/영상)
│   ├── signUp.html             # 회원가입 폼 (입력 유형 + 유효성 검사)
│   ├── signUpResult.html       # 회원가입 결과
│   ├── css/
│   │   └── style.css           # 공통 스타일 (폰트·박스모델·폼·Flex/Grid·반응형·애니메이션)
│   ├── script/                 # 자바스크립트
│   │   ├── upDown.js  grade.js  bag.js       # 게임 3종
│   │   ├── weatherAPI.js  realtimeInfo.js    # 실시간 날씨 (모듈 분리)
│   │   ├── signupValidation.js  signupEnhance.js  # 회원가입 폼 기능
│   │   └── fortune.js  videoFacade.js        # 추가 기능
│   ├── media/                  # 이미지 · 오디오
│   └── screenshots/            # 실행 결과 캡처 (과제/추가과제 표시)
│
└── 종합실습가이드 과제/          # 종합실습 프로젝트
    ├── 1_회원가입/              # 회원가입 & 결과 페이지
    ├── 2_여행지/               # 제주 여행지 소개 (시맨틱 · 미디어 · 앵커)
    ├── 3_상품갤러리/            # 반응형 상품 카드 갤러리 (다크모드)
    └── 4_할일앱/               # 인터랙티브 할 일 관리 앱 (모듈 · localStorage)
```

---

## 교안 과제

### Day 1 — HTML
| 페이지 | 학습 내용 |
|---|---|
| myProfile | 제목 위계, 목록(ul/ol/dl) |
| myClass | 표 구성, `rowspan` / `colspan` 병합 |
| myHoliday | 텍스트 서식(`br`, `mark`, `u`) |
| signUp / signUpResult | form, input 유형, 유효성 속성, GET 전송 |
| myTrip | 시맨틱 태그, `img`/`audio`/`video` 미디어 |
| index | 포털 Hub, 시맨틱 레이아웃 |

### Day 2-1 — CSS + JavaScript 기초
- **CSS** (`style.css`): 선택자, 색·폰트, 박스모델, Flexbox/Grid, 반응형(미디어 쿼리), 애니메이션
- **게임**: 업다운 게임(반복문) · 성적 계산기(배열/조건문) · 내 가방(객체 배열)

### Day 2-2 — JavaScript 심화
- **실시간 날씨**: DOM/이벤트 비동기 `fetch`(Open-Meteo) 모듈 분리(`weatherAPI` / `realtimeInfo`)

---

## 추가과제 (교안 실습을 확장한 창의 구현)

| 추가과제 | 위치 | 내용 |
|---|---|---|
| 커스텀 유효성 메시지 | signUp | 브라우저 기본 경고를 직접 정한 문구로 교체 |
| 회원가입 폼 고도화 | signUp | 비밀번호 보기/숨기기 · 강도 실시간 미터 · 글자수 카운터 |
| 날씨 자동 순환 | index | 토글 켜면 15초마다 다음 도시 날씨 자동 전환 |
| 유튜브 지연 로딩 | myTrip | 썸네일 먼저 표시 클릭 시 영상 로드(facade 패턴) |
| 오늘의 개발자 운세 | index | 새로고침/버튼마다 랜덤 문구 표시 |

> 각 추가과제는 소스 주석에 `[추가과제]`로 표시했고, 캡처에도 블록으로 강조 표시했습니다.

---

## 실행 방법

> 날씨·모듈(`type="module"`) 기능은 파일 더블클릭(`file://`)으로는 동작하지 않습니다. **로컬 서버로 열어주세요.**

1. **VS Code + Live Server** — `index.html` 우클릭 *Open with Live Server*
2. **터미널** — 해당 폴더에서
   ```bash
   python -m http.server 5500
   ```
   브라우저에서 `http://localhost:5500`

---

## 과제 회고

- HTML 뼈대 CSS 스타일 JavaScript 동작 순으로 점진적으로 확장하며 웹의 3요소를 익혔습니다.
- 특히 `rowspan/colspan` 표 병합, Flex/Grid 반응형, 비동기 `fetch`와 모듈 분리에서 개념이 크게 잡혔습니다.
- 기본 요구사항을 넘어 폼 고도화·날씨 자동순환·지연 로딩 등 여러 추가 기능을 직접 붙여보며 응용력을 길렀습니다.
