// ===== 데이터 계층 =====
// 할 일 배열을 들고 있으면서 localStorage 로 저장/복원하는 일만 담당함.
// 화면 렌더링은 여기서 하지 않고 app.js 에 맡김. (역할 분리)
//
// 할 일 하나의 형태: { id, text, done, due, priority }
//   id       - 항목을 구분하는 고유값 (삭제/토글 때 이 값으로 항목을 찾음)
//   text     - 할 일 내용
//   done     - 완료 여부 (true 면 취소선 표시)
//   due      - 마감일 (YYYY-MM-DD 문자열, 없으면 '')     [추가과제] 마감일
//   priority - 우선순위 ('high' | 'medium' | 'low')      [추가과제] 우선순위

const STORAGE_KEY = 'juyong-todo-items';   // 저장소에서 쓸 키 이름

// [추가과제] 초기 예시 데이터 — localStorage 가 비어 있을 때 한 번만 삽입됨.
// 이후 사용자가 수정하면 그 상태가 유지되고, seed 는 다시 들어오지 않음.
const SEED_TODOS = [
    { id: 'seed-1', text: 'Kaggle 대회 참여',            done: false, due: '2026-07-31', priority: 'high'   },
    { id: 'seed-2', text: '프론트엔드 공부 (HTML/CSS/JS)', done: true,  due: '2026-07-18', priority: 'high'   },
    { id: 'seed-3', text: 'SKCT 공부',                   done: false, due: '',           priority: 'medium' },
    { id: 'seed-4', text: '오픽 공부',                   done: false, due: '2026-07-10', priority: 'medium' },
    { id: 'seed-5', text: '면접 준비',                   done: false, due: '',           priority: 'high'   },
];

// 앱 전체가 공유하는 상태. 배열 하나로 관리하고, 바뀔 때마다 저장함.
let todos = load();

// 저장소에서 목록을 읽어옴. 값이 없거나 깨져 있으면 seed 데이터로 초기화.
function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            // 처음 방문: seed 를 저장소에 기록하고 반환
            localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TODOS));
            return SEED_TODOS.map((item) => ({ ...item }));
        }
        const parsed = JSON.parse(raw);
        // 배열이 아니면 신뢰하지 않고 비움
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

// 현재 상태를 JSON 으로 저장. 상태를 바꾸는 함수들이 끝에서 호출함.
function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 고유 id 생성. 시간값과 난수를 섞어 중복을 피함.
function createId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// 현재 목록을 읽어감. 원본을 직접 넘기지 않으려고 복사본을 돌려줌.
export function getTodos() {
    return todos.slice();
}

// 할 일 추가. 앞뒤 공백을 없앤 뒤 빈 값이면 추가하지 않고 null 을 반환.
// [추가과제] 마감일(due), 우선순위(priority) 필드를 함께 저장함.
export function addTodo(text, due = '', priority = 'medium') {
    const trimmed = text.trim();
    if (trimmed === '') return null;

    const item = { id: createId(), text: trimmed, done: false, due, priority };
    todos.push(item);
    save();
    return item;
}

// id 로 완료 여부를 뒤집음.
export function toggleTodo(id) {
    const item = todos.find((todo) => todo.id === id);
    if (!item) return;
    item.done = !item.done;
    save();
}

// id 로 항목을 목록에서 제거.
export function removeTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    save();
}

// [보완] 항목 텍스트를 수정하고 저장함. 빈 값이면 변경하지 않음.
export function updateTodo(id, text) {
    const trimmed = text.trim();
    if (trimmed === '') return false;

    const item = todos.find((todo) => todo.id === id);
    if (!item) return false;

    item.text = trimmed;
    save();
    return true;
}
