// ===== 내 가방 보기 =====
// 물건 하나를 { 이름, 개수 } 객체로 만들고,
// 그 객체들을 배열에 담아 목록으로 보여줌.

function showMyBag() {
    // 객체 { } 하나가 물건 하나. 배열 [ ] 안에 나열.
    const myBag = [
        { name: "맥북프로 M4 48GB 1TB", count: 1 },
        { name: "냉방병 피하기 위한 후드티", count: 1 },
        { name: "손풍기", count: 1 },
        { name: "식곤증을 막아주는 에너지 드링크", count: 1 }
    ];

    let text = "[내 가방 속 물품]\n-----------------------\n";

    // 배열의 물건을 하나씩 꺼내 문자열로 이어붙임.
    // for...of는 요소(item)를 바로 순회해서 item.name처럼 접근 가능.
    for (const item of myBag) {
        text += "- " + item.name + " : " + item.count + "개\n";
    }

    text += "-----------------------\n";
    text += "총 물품 종류 : " + myBag.length + "가지"; // .length는 배열 요소 개수

    alert(text);
}
