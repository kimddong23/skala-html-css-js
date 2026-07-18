/* =====================================================
   제주 여행지 소개 페이지 — 동작 스크립트
   순수 JavaScript. 네 가지 기능을 담당한다.
     1. [보완]      현재 섹션 내비 하이라이트 (IntersectionObserver + CSS 클래스)
     2. [추가과제]  명소 이미지 라이트박스 (클릭 확대, 닫기 버튼/배경 클릭/ESC)
     3. [추가과제]  가보고 싶은 명소 체크리스트 (localStorage 저장/복원, 카운트 표시)
     4. [추가과제]  유튜브 영상 자동 순환 (15초 간격, 이전/다음 버튼, 진행 바)
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /* ─────────────────────────────────────────────────────
       [보완] 현재 섹션 내비 하이라이트 강화
       IntersectionObserver로 섹션 진입을 감지하고,
       인라인 스타일 대신 CSS 클래스(.is-active)를 토글해
       transition 효과까지 자연스럽게 동작하게 함.
    ───────────────────────────────────────────────────── */
    var navLinks = Array.prototype.slice.call(
        document.querySelectorAll('.site-nav a[data-section]')
    );

    function setActiveNav(sectionId) {
        navLinks.forEach(function (link) {
            if (link.dataset.section === sectionId) {
                link.classList.add('is-active');
            } else {
                link.classList.remove('is-active');
            }
        });
    }

    var sections = navLinks
        .map(function (link) { return document.getElementById(link.dataset.section); })
        .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
        var navObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) { setActiveNav(entry.target.id); }
                });
            },
            { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
        );
        sections.forEach(function (sec) { navObserver.observe(sec); });
    }


    /* ─────────────────────────────────────────────────────
       [추가과제] 명소 이미지 라이트박스
       .lb-trigger 클릭 → 오버레이 표시
       닫기: 닫기 버튼, .lightbox 배경 클릭, ESC 키
    ───────────────────────────────────────────────────── */
    var lightbox  = document.getElementById('lightbox');
    var lbImg     = document.getElementById('lbImg');
    var lbCaption = document.getElementById('lbCaption');
    var lbClose   = document.getElementById('lbClose');
    var lbFigure  = document.getElementById('lbFigure');

    function openLightbox(src, alt, caption) {
        lbImg.src             = src;
        lbImg.alt             = alt;
        lbCaption.textContent = caption;
        lightbox.removeAttribute('hidden');
        lbClose.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.setAttribute('hidden', '');
        lbImg.src = '';
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.lb-trigger').forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            openLightbox(trigger.dataset.src, trigger.dataset.alt, trigger.dataset.caption);
        });
        trigger.setAttribute('tabindex', '0');
        trigger.setAttribute('role', 'button');
        trigger.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(trigger.dataset.src, trigger.dataset.alt, trigger.dataset.caption);
            }
        });
    });

    lightbox.addEventListener('click', closeLightbox);

    if (lbFigure) {
        lbFigure.addEventListener('click', function (e) { e.stopPropagation(); });
    }

    lbClose.addEventListener('click', function (e) {
        e.stopPropagation();
        closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !lightbox.hasAttribute('hidden')) { closeLightbox(); }
    });


    /* ─────────────────────────────────────────────────────
       [추가과제] 가보고 싶은 명소 체크리스트
       각 카드의 '가고 싶어요' 버튼 클릭으로 토글.
       localStorage에 저장하고 재방문 시 복원.
       카운트는 .wishlist-bar 안의 <strong>에 실시간 반영.
    ───────────────────────────────────────────────────── */
    var LS_KEY   = 'jeju-wishlist-v1';
    var wishBtns = Array.prototype.slice.call(document.querySelectorAll('.wish-btn'));
    var countEl  = document.querySelector('#wishCount strong');

    function loadWishlist() {
        try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch (e) { return []; }
    }

    function saveWishlist(list) {
        try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch (e) {}
    }

    function updateCount() {
        var checked = wishBtns.filter(function (b) {
            return b.getAttribute('aria-pressed') === 'true';
        }).length;
        if (countEl) { countEl.textContent = checked; }
    }

    function setWishState(btn, active) {
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        btn.textContent = active ? '찜 완료' : '가고 싶어요';
    }

    var savedList = loadWishlist();
    wishBtns.forEach(function (btn) {
        if (savedList.indexOf(btn.dataset.id) !== -1) { setWishState(btn, true); }
    });
    updateCount();

    wishBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id      = btn.dataset.id;
            var newState = btn.getAttribute('aria-pressed') !== 'true';
            setWishState(btn, newState);
            var list = loadWishlist();
            if (newState) {
                if (list.indexOf(id) === -1) { list.push(id); }
            } else {
                list = list.filter(function (x) { return x !== id; });
            }
            saveWishlist(list);
            updateCount();
        });
    });


    /* ─────────────────────────────────────────────────────
       [추가과제] 유튜브 영상 자동 순환
       영상 ID 배열을 두고 15초마다 iframe src를 교체.
       이전/다음 버튼으로 수동 이동도 가능.
       진행 바(.video-progress-bar)로 남은 시간을 시각화.

       영상 ID 선정 기준: YouTube에 공개된 제주 여행 영상.
         - autoplay=1&mute=1: 자동재생(음소거) 허용
         - rel=0: 관련 영상 표시 최소화
    ───────────────────────────────────────────────────── */
    var YT_VIDEOS = [
        { id: 'hSPcExVhquE', title: '제주도의 푸른 밤 — 밴드 고맙삼다' },
        { id: 'pT96hVA5YF8', title: '초호화 제주 여행은 돈값 할까?' },
        { id: 'F7PN-1EmJbI', title: '제주 찐로컬 맛집 — 또간집 EP.27' },
        { id: 'Dv2XQDs7k3k', title: '두 남자의 초호화 크루즈 여행기 — 제주' }
    ];
    var INTERVAL_MS = 15000;   /* 15초마다 다음 영상으로 전환 */
    var TICK_MS     = 250;     /* 진행 바 업데이트 주기 */

    var ytFrame      = document.getElementById('ytFrame');
    var ytTitle      = document.getElementById('ytTitle');
    var ytIndicator  = document.getElementById('ytIndicator');
    var ytPrev       = document.getElementById('ytPrev');
    var ytNext       = document.getElementById('ytNext');
    var ytProgressBar = document.getElementById('ytProgressBar');

    if (!ytFrame) { return; }   /* 영상 섹션이 없는 경우 방어 */

    var currentIdx   = 0;
    var elapsed      = 0;       /* 현재 영상에서 경과한 시간(ms) */
    var tickTimer    = null;

    /* iframe src를 지정 인덱스의 영상으로 교체 */
    function loadVideo(idx) {
        var v = YT_VIDEOS[idx];
        /* autoplay=1&mute=1: 브라우저 정책상 음소거 자동재생만 허용됨 */
        ytFrame.src = 'https://www.youtube.com/embed/' + v.id
                    + '?autoplay=1&mute=1&rel=0&modestbranding=1';
        ytTitle.textContent     = v.title;
        ytIndicator.textContent = (idx + 1) + ' / ' + YT_VIDEOS.length;
    }

    /* 진행 바를 elapsed/INTERVAL_MS 비율로 업데이트 */
    function updateProgress() {
        var pct = Math.min((elapsed / INTERVAL_MS) * 100, 100);
        ytProgressBar.style.width = pct + '%';
    }

    /* 자동 순환 tick — TICK_MS 마다 호출 */
    function tick() {
        elapsed += TICK_MS;
        updateProgress();
        if (elapsed >= INTERVAL_MS) { goNext(); }
    }

    function startTimer() {
        elapsed = 0;
        updateProgress();
        if (tickTimer) { clearInterval(tickTimer); }
        tickTimer = setInterval(tick, TICK_MS);
    }

    function goTo(idx) {
        currentIdx = (idx + YT_VIDEOS.length) % YT_VIDEOS.length;
        loadVideo(currentIdx);
        startTimer();
    }

    function goNext() { goTo(currentIdx + 1); }
    function goPrev() { goTo(currentIdx - 1); }

    ytNext.addEventListener('click', goNext);
    ytPrev.addEventListener('click', goPrev);

    /* 초기 영상 로드 + 타이머 시작 */
    goTo(0);

});
