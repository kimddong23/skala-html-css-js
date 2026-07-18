// ===== juyong.dev Store - 상품 갤러리 인터랙션 =====
// 다크모드 / 카테고리 필터 / 장바구니 / 찜하기 / 가격 정렬
// localStorage 로 테마·장바구니·찜 목록을 유지함.

// ----- 저장소 키 -----
const KEY_THEME = 'juyong-store-theme';
const KEY_CART  = 'juyong-store-cart';   // [보완] 장바구니
const KEY_WISH  = 'juyong-store-wish';   // [추가과제] 찜

// ----- DOM 참조 -----
const body        = document.body;
const toggleBtn   = document.querySelector('#theme-toggle');
const toggleText  = toggleBtn.querySelector('.theme-toggle-text');
const navMenu     = document.querySelector('#nav-menu');
const gallery     = document.querySelector('#gallery');
const cartCountEl = document.querySelector('#cart-count');
const wishCountEl = document.querySelector('#wish-count');
const sortSelect  = document.querySelector('#sort-select');

// ----- 상태 -----
// localStorage 에서 배열 형태로 복원. 없으면 빈 배열.
let cart = JSON.parse(localStorage.getItem(KEY_CART) || '[]');  // 담긴 상품 id 배열
let wish = JSON.parse(localStorage.getItem(KEY_WISH) || '[]');  // 찜한 상품 id 배열

// =====================================================
// 1. 다크모드 토글
// =====================================================
function updateThemeLabel() {
    toggleText.textContent = body.classList.contains('dark') ? '라이트모드' : '다크모드';
}

// 초기 로드 시 저장된 테마 적용
if (localStorage.getItem(KEY_THEME) === 'dark') {
    body.classList.add('dark');
}
updateThemeLabel();

toggleBtn.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark');
    localStorage.setItem(KEY_THEME, isDark ? 'dark' : 'light');
    updateThemeLabel();
});

// =====================================================
// [보완] 2. 카테고리 필터
// 이벤트 위임: nav 클릭을 navMenu 한 곳에서 받아 처리.
// 활성 메뉴(.active), 카드 표시/숨김(.hidden) 갱신.
// =====================================================
let currentFilter = '전체';

function applyFilter(filter) {
    currentFilter = filter;

    // 메뉴 활성 항목 갱신
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.filter === filter);
    });

    // 카드 표시/숨김
    gallery.querySelectorAll('.card').forEach(card => {
        const match = filter === '전체' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
    });
}

// 이벤트 위임: navMenu 내 클릭 한 곳에서 모두 처리
navMenu.addEventListener('click', e => {
    const link = e.target.closest('.nav-link');
    if (!link) return;
    e.preventDefault();
    applyFilter(link.dataset.filter);
});

// 초기 필터 적용 (전체 표시)
applyFilter('전체');

// =====================================================
// [보완] 3. 장바구니 담기
// 같은 상품 중복 담기 방지(수량 대신 토글 방식으로 단순하게).
// 카운터는 담긴 항목 수. localStorage 에 id 배열로 저장.
// =====================================================
function saveCart() {
    localStorage.setItem(KEY_CART, JSON.stringify(cart));
}

function updateCartUI() {
    cartCountEl.textContent = cart.length;
    // 각 카드 버튼 상태 반영
    gallery.querySelectorAll('.card-btn').forEach(btn => {
        const inCart = cart.includes(btn.dataset.id);
        btn.classList.toggle('in-cart', inCart);
        btn.textContent = inCart ? '담기 취소' : '장바구니 담기';
        btn.disabled = false;   // 취소도 허용하므로 disabled 는 쓰지 않음
    });
}

// 이벤트 위임: gallery 내 card-btn 클릭 처리
gallery.addEventListener('click', e => {
    const btn = e.target.closest('.card-btn');
    if (!btn) return;

    const id = btn.dataset.id;
    if (cart.includes(id)) {
        // 이미 담긴 경우 취소
        cart = cart.filter(x => x !== id);
    } else {
        cart.push(id);
    }
    saveCart();
    updateCartUI();
});

// 초기 장바구니 UI 반영
updateCartUI();

// =====================================================
// [추가과제] 4. 찜하기
// ♡(빈 하트, &#9825;) / ♥(채운 하트, &#9829;) 토글.
// 찜 상태는 .wished 클래스 + localStorage 로 유지.
// =====================================================
function saveWish() {
    localStorage.setItem(KEY_WISH, JSON.stringify(wish));
}

function updateWishUI() {
    wishCountEl.textContent = wish.length;
    gallery.querySelectorAll('.wish-btn').forEach(btn => {
        const wished = wish.includes(btn.dataset.id);
        btn.classList.toggle('wished', wished);
        // &#9829; = 채운 하트, &#9825; = 빈 하트 (텍스트 렌더)
        btn.innerHTML = wished ? '&#9829;' : '&#9825;';
        btn.setAttribute('aria-label', wished ? '찜 취소' : '찜하기');
    });
}

// 이벤트 위임: gallery 내 wish-btn 클릭 처리
gallery.addEventListener('click', e => {
    const btn = e.target.closest('.wish-btn');
    if (!btn) return;

    const id = btn.dataset.id;
    if (wish.includes(id)) {
        wish = wish.filter(x => x !== id);
    } else {
        wish.push(id);
    }
    saveWish();
    updateWishUI();
});

// 초기 찜 UI 반영
updateWishUI();

// =====================================================
// [추가과제] 5. 가격 정렬
// 카드의 .card-price 텍스트에서 숫자만 파싱해 비교.
// DOM 재배열로 구현 (카드를 gallery 에서 꺼내 순서 바꿔 다시 넣음).
// =====================================================
function parsePrice(card) {
    const text = card.querySelector('.card-price').textContent;
    // "139,000원" -> 139000
    return parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
}

function sortCards(order) {
    // 현재 gallery 안의 모든 카드를 배열로
    const cards = Array.from(gallery.querySelectorAll('.card'));

    if (order === 'asc') {
        cards.sort((a, b) => parsePrice(a) - parsePrice(b));
    } else if (order === 'desc') {
        cards.sort((a, b) => parsePrice(b) - parsePrice(a));
    }
    // 'default' 는 data-id 기준 원래 순서 복원
    else {
        cards.sort((a, b) => Number(a.dataset.id) - Number(b.dataset.id));
    }

    // gallery 에 다시 삽입 (순서 재배열)
    cards.forEach(card => gallery.appendChild(card));
}

sortSelect.addEventListener('change', () => {
    sortCards(sortSelect.value);
});
