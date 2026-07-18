// ===== [추가과제] 유튜브 영상 지연 로딩 (썸네일 → 클릭 시 재생) =====
// 처음엔 유튜브 썸네일 사진만 보여줌 (페이지가 가벼워짐).
// 재생 버튼을 누르면 그때 iframe을 만들어 넣어서 진짜 영상을 재생함.

const facade = document.querySelector('#videoFacade');

if (facade) {
    facade.addEventListener('click', () => {
        const id = facade.dataset.video; // data-video="..." 에 넣어둔 영상 ID

        // 썸네일 자리를 실제 유튜브 iframe으로 교체. autoplay=1 로 바로 재생.
        facade.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${id}?autoplay=1"
                    title="해군 훈련소의 모든 것 - 바다로 가는 첫걸음"
                    allow="autoplay; fullscreen"
                    allowfullscreen></iframe>
        `;
    });
}
