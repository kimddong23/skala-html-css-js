// ===== 화면 계층 =====
// storage.js 에서 데이터 함수만 가져와 쓰고, 여기서는 DOM 렌더링과 이벤트 처리를 담당함.
// 흐름은 항상 "배열 상태를 바꾼다 → render() 로 다시 그린다" 한 방향으로 유지함.

import { getTodos, addTodo, toggleTodo, removeTodo, updateTodo } from './storage.js';

// 다룰 DOM 요소들을 한 번에 잡아둠
const form          = document.querySelector('#todo-form');
const input         = document.querySelector('#todo-input');
const dueInput      = document.querySelector('#todo-due');        // [추가과제] 마감일 입력
const prioritySel   = document.querySelector('#todo-priority');   // [추가과제] 우선순위 선택
const list          = document.querySelector('#todo-list');
const filters       = document.querySelector('#filters');
const summaryText   = document.querySelector('#summary-text');
const emptyState    = document.querySelector('#empty-state');
const quoteEl       = document.querySelector('#quote');
const progressBar   = document.querySelector('#progress-bar');    // [추가과제] 진행률 바
const progressLabel = document.querySelector('#progress-label');  // [추가과제] 진행률 텍스트

// 현재 필터 상태: 'all' | 'active' | 'done'
let currentFilter = 'all';

// [추가과제] 우선순위 순서 맵. 낮은 숫자가 먼저 오도록 정렬에 사용.
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

// [추가과제] 우선순위별 한글 레이블
const PRIORITY_LABEL = { high: '높음', medium: '보통', low: '낮음' };

// 필터 값에 맞는 항목만 남겨서 돌려줌
function applyFilter(todos) {
    if (currentFilter === 'active') return todos.filter((todo) => !todo.done);
    if (currentFilter === 'done')   return todos.filter((todo) => todo.done);
    return todos;
}

// [추가과제] 우선순위순으로 정렬 (완료 항목은 뒤로, 같은 완료 상태 안에서 우선순위순)
function sortByPriority(todos) {
    return todos.slice().sort((a, b) => {
        // 완료 항목은 항상 뒤로
        if (a.done !== b.done) return a.done ? 1 : -1;
        // 같은 완료 상태면 우선순위로 비교
        return (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1);
    });
}

// [추가과제] 오늘 날짜를 YYYY-MM-DD 형식으로 반환. 마감일 초과 판별에 사용.
function todayString() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

// 할 일 하나를 <li> 로 만들어 반환.
// dataset(id) 을 li 에 심어두면, 이벤트 위임에서 어떤 항목인지 되찾을 수 있음.
function createItemElement(todo) {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.done ? ' is-done' : '');
    li.dataset.id = todo.id;

    // 완료 토글 체크박스
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-check';
    checkbox.checked = todo.done;
    checkbox.setAttribute('aria-label', '완료 여부 토글');
    checkbox.dataset.action = 'toggle';

    // [추가과제] 우선순위 태그. data-priority 로 CSS 색상 구분.
    const priorityTag = document.createElement('span');
    priorityTag.className = 'priority-tag';
    priorityTag.dataset.priority = todo.priority || 'medium';
    priorityTag.textContent = PRIORITY_LABEL[todo.priority] || PRIORITY_LABEL.medium;

    // 할 일 내용. textContent 로 넣어 입력값이 그대로 태그로 해석되지 않게 함.
    // [보완] 완료되지 않은 항목은 더블클릭으로 인라인 편집을 시작할 수 있음.
    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;
    if (!todo.done) {
        textSpan.title = '더블클릭하여 수정';
        textSpan.dataset.action = 'edit-start';
    }

    // 항목 오른쪽 영역(마감일 + 삭제 버튼)을 묶는 컨테이너
    const rightArea = document.createElement('div');
    rightArea.className = 'todo-right';

    // [추가과제] 마감일 배지. due 값이 있을 때만 표시. 오늘보다 이전이면 overdue 표시.
    if (todo.due) {
        const dueBadge = document.createElement('span');
        dueBadge.className = 'due-badge';
        if (!todo.done && todo.due < todayString()) {
            dueBadge.classList.add('is-overdue');
        }
        // 날짜를 'M월 D일' 형식으로 짧게 표시
        const [, mm, dd] = todo.due.split('-');
        dueBadge.textContent = `${parseInt(mm, 10)}월 ${parseInt(dd, 10)}일`;
        rightArea.appendChild(dueBadge);
    }

    // 삭제 버튼. 기능적 기호로 ✕ 사용.
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'todo-remove';
    removeBtn.dataset.action = 'remove';
    removeBtn.setAttribute('aria-label', '삭제');
    removeBtn.textContent = '✕';

    rightArea.appendChild(removeBtn);

    li.append(checkbox, priorityTag, textSpan, rightArea);
    return li;
}

// [보완] 인라인 편집: 텍스트 span 을 input 으로 교체하고, 포커스를 넘김.
// Enter 또는 blur 로 저장, Escape 로 취소.
function startInlineEdit(li) {
    const textSpan = li.querySelector('.todo-text');
    if (!textSpan) return;

    const id = li.dataset.id;

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'todo-edit-input';
    editInput.value = textSpan.textContent;
    editInput.maxLength = 120;
    editInput.setAttribute('aria-label', '할 일 수정');

    // 편집 중에는 편집 입력란이 텍스트 span 자리를 차지하게 함
    textSpan.replaceWith(editInput);
    editInput.focus();
    editInput.select();

    let committed = false;

    function commit() {
        if (committed) return;
        committed = true;
        const newText = editInput.value.trim();
        if (newText && newText !== textSpan.textContent) {
            updateTodo(id, newText);
            render();
        } else {
            // 변경 없거나 빈 값이면 원래 span 복원
            editInput.replaceWith(textSpan);
        }
    }

    function cancel() {
        if (committed) return;
        committed = true;
        editInput.replaceWith(textSpan);
    }

    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter')  { e.preventDefault(); commit(); }
        if (e.key === 'Escape') { e.preventDefault(); cancel(); }
    });

    // blur 시에도 저장(단, Escape 로 이미 취소된 경우는 건너뜀)
    editInput.addEventListener('blur', commit);
}

// [추가과제] 진행률 바 갱신. 항목이 없으면 0%로 표시.
function renderProgress(todos) {
    const total = todos.length;
    const done  = todos.filter((t) => t.done).length;
    const pct   = total === 0 ? 0 : Math.round((done / total) * 100);

    progressBar.style.width  = `${pct}%`;
    progressLabel.textContent = `${pct}%`;
}

// 요약 문구 갱신: 전체 개수와 완료 개수를 보여줌
function renderSummary(todos) {
    const total = todos.length;
    const done  = todos.filter((todo) => todo.done).length;
    summaryText.textContent = `전체 ${total}개 · 완료 ${done}개`;
}

// 상태 → 화면. 목록을 비우고 필터에 맞는 항목만 다시 그림.
function render() {
    const todos   = getTodos();
    // [추가과제] 우선순위순 정렬 후 필터 적용
    const sorted  = sortByPriority(todos);
    const visible = applyFilter(sorted);

    list.innerHTML = '';
    visible.forEach((todo) => list.appendChild(createItemElement(todo)));

    emptyState.hidden = visible.length > 0;

    renderSummary(todos);
    renderProgress(todos);  // [추가과제] 진행률 바도 함께 갱신
}

// ===== 이벤트 처리 =====

// 추가: form submit 하나로 추가 버튼 클릭과 Enter 키를 함께 처리.
// 빈 값이면 addTodo 가 null 을 돌려주므로 그때는 아무 것도 하지 않음.
// [추가과제] 마감일(due)과 우선순위(priority) 값도 함께 넘김.
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const due      = dueInput.value;          // YYYY-MM-DD 또는 빈 문자열
    const priority = prioritySel.value;       // 'high' | 'medium' | 'low'
    const added    = addTodo(input.value, due, priority);
    if (!added) return;
    input.value   = '';
    dueInput.value = '';
    prioritySel.value = 'medium';
    render();
});

// 이벤트 위임: 부모 ul 에 클릭 리스너를 1회만 걸고,
// closest() 로 클릭된 지점이 속한 항목(li)과 눌린 버튼의 역할(dataset.action)을 알아냄.
list.addEventListener('click', (event) => {
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;

    const item   = actionEl.closest('.todo-item');
    if (!item) return;

    const id     = item.dataset.id;
    const action = actionEl.dataset.action;

    if (action === 'toggle') {
        toggleTodo(id);
        render();
    } else if (action === 'remove') {
        removeTodo(id);
        render();
    }
});

// [보완] 인라인 편집: 텍스트 span 더블클릭으로 편집 시작. 이벤트 위임으로 처리.
list.addEventListener('dblclick', (event) => {
    const actionEl = event.target.closest('[data-action="edit-start"]');
    if (!actionEl) return;

    const item = actionEl.closest('.todo-item');
    if (!item) return;

    startInlineEdit(item);
});

// 필터 버튼도 이벤트 위임으로 처리. 눌린 버튼의 data-filter 로 상태를 바꿈.
filters.addEventListener('click', (event) => {
    const btn = event.target.closest('.filter-btn');
    if (!btn) return;

    currentFilter = btn.dataset.filter;

    // 활성 버튼 표시를 눌린 버튼으로 옮김
    filters.querySelectorAll('.filter-btn').forEach((el) => {
        el.classList.toggle('is-active', el === btn);
    });

    render();
});

// ===== 오늘의 한마디 =====
// 로컬 data/quotes.json 을 fetch 해서 그 중 하나를 무작위로 보여줌.
// 네트워크/파싱 오류는 try/catch 로 잡고, 실패하면 하드코딩 기본 문구로 대체.
const DEFAULT_QUOTE = '오늘 할 일에 집중하면 하루가 정돈된다.';

async function loadQuote() {
    try {
        const res = await fetch('data/quotes.json');
        if (!res.ok) throw new Error(`요청 실패: ${res.status}`);

        const quotes = await res.json();
        if (!Array.isArray(quotes) || quotes.length === 0) {
            throw new Error('빈 목록');
        }

        const picked = quotes[Math.floor(Math.random() * quotes.length)];
        quoteEl.textContent = picked;
    } catch {
        // 어떤 이유로든 실패하면 기본 문구로 안전하게 대체
        quoteEl.textContent = DEFAULT_QUOTE;
    }
}

// ===== 최초 실행 =====
// 저장된 목록을 그리고, 한마디를 비동기로 불러옴.
render();
loadQuote();
