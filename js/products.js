// 상품(재고) 목록 — 아래 배열 안의 항목을 복사/수정/삭제해서 실제 재고로 교체하세요.
//
// 각 항목 설명:
//   id            : 고유 번호 (숫자, 중복 금지)
//   name          : 상품명
//   category      : "전동공구" | "수공구" | "용접기기" | "안전용품" | "측정공구" | "기타"
//   price         : 판매가 (숫자, 원 단위)
//   originalPrice : 정가 (할인율 표시용, 없으면 price와 동일하게 두면 됨)
//   stock         : true(판매중) / false(품절)
//   condition     : 상태 설명 (예: "미사용 새제품", "사용감 있음 - 정상작동")
//   description   : 짧은 설명
//   image         : 사진 파일 경로 (images/파일명.jpg). 사진이 없으면 "" 로 두면 아이콘이 대신 표시됩니다.

const PRODUCTS = [
  {
    id: 1,
    name: "makita 충전 임팩트 드릴 (18V)",
    category: "전동공구",
    price: 85000,
    originalPrice: 150000,
    stock: true,
    condition: "사용감 있음 - 정상작동, 배터리 2개 포함",
    description: "배터리 2개, 충전기, 케이스 포함. 사업 정리로 특가 판매합니다.",
    image: ""
  },
  {
    id: 2,
    name: "전동 원형톱 (185mm)",
    category: "전동공구",
    price: 65000,
    originalPrice: 110000,
    stock: true,
    condition: "미사용 새제품",
    description: "박스 미개봉 새제품입니다. 목재 절단용.",
    image: ""
  },
  {
    id: 3,
    name: "그라인더 4인치",
    category: "전동공구",
    price: 30000,
    originalPrice: 55000,
    stock: true,
    condition: "사용감 있음 - 정상작동",
    description: "디스크 2매 여분 포함.",
    image: ""
  },
  {
    id: 4,
    name: "수동 몽키스패너 세트 (5종)",
    category: "수공구",
    price: 20000,
    originalPrice: 38000,
    stock: true,
    condition: "미사용 새제품",
    description: "150~450mm 사이즈 5종 세트.",
    image: ""
  },
  {
    id: 5,
    name: "라쳇 렌치 세트 (72개)",
    category: "수공구",
    price: 45000,
    originalPrice: 90000,
    stock: true,
    condition: "미사용 새제품",
    description: "케이스 포함, 소켓 72피스 풀세트.",
    image: ""
  },
  {
    id: 6,
    name: "드라이버 세트 (다목적)",
    category: "수공구",
    price: 12000,
    originalPrice: 22000,
    stock: true,
    condition: "사용감 있음 - 정상작동",
    description: "일자/십자 다양한 규격 포함.",
    image: ""
  },
  {
    id: 7,
    name: "CO2 용접기 (200A)",
    category: "용접기기",
    price: 320000,
    originalPrice: 550000,
    stock: true,
    condition: "사용감 있음 - 정상작동",
    description: "산업용, 토치 및 접지선 포함. 직접 확인 후 구매 가능.",
    image: ""
  },
  {
    id: 8,
    name: "용접 마스크 (자동 차광)",
    category: "안전용품",
    price: 25000,
    originalPrice: 45000,
    stock: true,
    condition: "미사용 새제품",
    description: "자동 차광 기능, 배터리 포함.",
    image: ""
  },
  {
    id: 9,
    name: "안전화 (270mm)",
    category: "안전용품",
    price: 18000,
    originalPrice: 35000,
    stock: false,
    condition: "미사용 새제품",
    description: "재고 소진되었습니다. 재입고 문의는 카카오톡으로 남겨주세요.",
    image: ""
  },
  {
    id: 10,
    name: "레이저 줄자 (40m)",
    category: "측정공구",
    price: 28000,
    originalPrice: 50000,
    stock: true,
    condition: "미사용 새제품",
    description: "실내외 겸용, 케이스 포함.",
    image: ""
  },
  {
    id: 11,
    name: "수평계 (60cm)",
    category: "측정공구",
    price: 9000,
    originalPrice: 17000,
    stock: true,
    condition: "사용감 있음 - 정상작동",
    description: "알루미늄 바디, 정확도 양호.",
    image: ""
  },
  {
    id: 12,
    name: "공구함 (2단, 대형)",
    category: "기타",
    price: 15000,
    originalPrice: 30000,
    stock: true,
    condition: "사용감 있음 - 정상작동",
    description: "이동식 바퀴 포함, 대용량 수납.",
    image: ""
  }
];
