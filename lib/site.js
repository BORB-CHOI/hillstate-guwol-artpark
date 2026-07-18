// =============================================================
// 사이트 공통 설정 — 여기 값만 바꾸면 전체 페이지에 반영됩니다.
// (전화번호, 카카오 채널, 주소 등)
//
// 단지 정보는 공식 브리핑북(사업개요) 기준 사실만 반영했습니다.
// 가격(분양가/계약금/중도금 등) 정보는 정책상 절대 포함하지 않습니다.
// =============================================================

export const site = {
  name: "힐스테이트 구월아트파크",
  tagline: "구월동 중심, 브랜드 신축 주거공간",
  // 대표 상담 전화 (숫자만 — tel: 링크에 사용)
  phone: process.env.NEXT_PUBLIC_PHONE || "010-4619-6091",
  phoneRaw: (process.env.NEXT_PUBLIC_PHONE || "010-4619-6091").replace(/[^0-9]/g, ""),
  // 카카오톡 상담 채널 링크
  kakaoUrl: process.env.NEXT_PUBLIC_KAKAO_URL || "https://pf.kakao.com/_gGHwX",
  // 인스타그램 프로필 링크 (실제 계정 주소로 교체)
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/",
  // 유튜브 채널 (@박진과장) — 한글 핸들은 퍼센트 인코딩된 주소를 쓴다
  youtubeUrl:
    process.env.NEXT_PUBLIC_YOUTUBE_URL ||
    "https://www.youtube.com/@%EB%B0%95%EC%A7%84%EA%B3%BC%EC%9E%A5",
  // 홍보관(견본주택) 주소
  address: "인천 남동구 구월동 1455번지 일원 (옛 롯데백화점 부지)",
  hallHours: "오전 10시 ~ 오후 6시 (연중무휴 / 예약 우선)",
  // 배포 도메인 (SEO/OG용) — 배포 후 실제 주소로 교체
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://hillstate-guwol-artpark.vercel.app",
};

// 단지 개요 (공개 가능한 사실 정보만 — 가격 정보는 절대 포함하지 않음)
export const project = {
  developer: "현대엔지니어링",
  brand: "힐스테이트",
  location: "인천광역시 남동구 구월동 1455번지",
  scale: "지하 6층에서 지상 39층, 4개동, 아파트 496세대",
  moveIn: "2030년 10월 입주 예정",
  types: [
    { name: "84A", desc: "248세대, 4Bay 판상형", detail: "우수한 개방감의 광폭 거실" },
    { name: "84B", desc: "124세대, 4Bay 맞통풍 판상형", detail: "개방감과 채광, 환기가 좋은 구조" },
    { name: "101", desc: "124세대, 4Bay 맞통풍 판상형", detail: "드레스룸과 파우더룸 별도" },
  ],
  station: "인천 1호선 예술회관역 지하 직결",
  gtx: "인천시청역(GTX-B 예정, 2030년 개통 목표) 한 정거장",
};

// 방문 소요/안내 정보
export const visitInfo = {
  duration: "약 40~60분",
  benefits: [
    "실제 유니트 관람 가능",
    "예약 고객 우선 안내",
    "전문 상담 가능",
    "타입별 비교 가능",
  ],
};

// 브랜드 신뢰 지표 (공식 브리핑북/내부교육자료 기재 수상 이력 기준)
// 사용자 지정으로 정확히 7개만 유지한다. 임의로 늘리거나 줄이지 않는다.
// (2026-07-13 확정: 출처 기관이 없던 'Platinum Club', 'Leadership A' 2건 제외)
// hint: 담당자가 크롭해 줄 개별 로고 이미지 파일명
export const brandAwards = [
  {
    title: "브랜드평판지수",
    period: "2019~2026 83개월 연속",
    detail: "1위",
    countUp: 83, // 카운트업으로 강조할 숫자
    countUpSuffix: "개월",
    org: "한국기업평판연구소",
    hint: "award-reputation.png",
    hero: true, // 가장 임팩트 있는 지표라 크게 강조
  },
  {
    title: "대한민국 브랜드스타",
    period: "2022~2025 4년 연속",
    detail: "공동주택 부문 1위",
    org: "브랜드스탁",
    hint: "award-brandstar.jpg",
  },
  {
    title: "프리미엄 브랜드지수(KS-PBI)",
    period: "2023~2025 3년 연속",
    detail: "공동주택 부문 1위, 스마트홈서비스 부문 1위",
    org: "한국표준협회",
    hint: "award-kspbi.png",
  },
  {
    title: "베스트 아파트 브랜드",
    period: "2023~2024 2년 연속",
    detail: "1위",
    org: "부동산R114, 한국리서치",
    hint: "award-bestapt.png",
  },
  {
    title: "World 지수 편입",
    period: "2010~2024 15년 연속",
    detail: "2024년 DJSI 월드 지수 편입 건설, 엔지니어링 기업 중 1위",
    org: "DJSI",
    hint: "award-djsi.png",
  },
  {
    title: "세계 3대 어워드 그랜드슬램",
    period: "국내 건설사 최초",
    detail: "IF, IDEA, reddot 수상",
    org: "IF/IDEA/reddot",
    hint: "award-design.png",
  },
  {
    // 로고 하나(명예의 전당)에 아래 세 줄 실적이 함께 붙는다
    title: "'명예의 전당' 등극",
    hint: "award-hof.png",
    lines: [
      "국내 건설사 최초 2021~2024 4년 연속 'Platinum Club' 수상",
      "2018~2024 7년 연속 '명예의 전당' 등극",
      "2023 기후변화대응부문 'Leadership A' 등급",
    ],
  },
];

// 교통 비교 — 구월아트파크 vs 송도국제도시 (공식 브리핑북 "구월과 송도 비교" 기준)
// ※ 분양가 정보는 정책상 절대 포함하지 않음 — 시간 비교만 사용
export const transitCompare = {
  disclaimer:
    "※ 상기 시간표현은 '국토교통부 GTX-B 사업발표(2024.03.07)' 내용 중 '송도(인천대입구)-여의도 23분', '송도(인천대입구)-서울역 29분' 소요시간을 환산한 것으로 실제와는 차이가 있을 수 있습니다. 도보시간은 네이버 거리 측정을 기준으로 일반 도보 기준으로 환산하였습니다.",
  guwol: {
    label: "힐스테이트 구월아트파크",
    badge: "서울역까지 In 20분대",
    hint: "transit-map-guwol.jpg",
    ratio: "982/677", // 실측 비율, 잘림 없이
    steps: [
      { name: "예술회관역", time: "0분" },
      { name: "인천시청역", time: "약 18분" },
      { name: "서울역", time: "약 24분" },
    ],
  },
  songdo: {
    label: "송도국제도시 'P'사",
    badge: "서울역까지 In 40분대",
    hint: "transit-map-songdo.jpg",
    ratio: "1162/755", // 실측 비율, 잘림 없이
    steps: [
      { name: "센트럴파크역", time: "약 15분 (도보 약 800m)" },
      { name: "인천대입구역", time: "약 38분" },
      { name: "서울역", time: "약 44분" },
    ],
  },
};

// 생활 인프라 (반경 500m 내 / 공식 브리핑북 기재 기준)
export const nearbyInfra = [
  "롯데백화점",
  "홈플러스",
  "이마트 트레이더스",
  "뉴코아아울렛",
  "가천대 길병원",
  "인천문화예술회관",
  "인천광역시청",
  "중앙공원",
];

// 개발 호재 (공식 브리핑북 기재 계획 기준 — 실제 인·허가에 따라 변경될 수 있음)
export const developments = [
  {
    no: "01",
    title: "구월아이시티 (구월2지구)",
    desc: "약 1.6만세대, 3.9만명 규모의 미니 신도시급 공공주택지구 계획",
    stat: { value: 1.6, suffix: "만세대", label: "계획 세대수 약" },
  },
  {
    no: "02",
    title: "인천시청역 GTX-B 환승센터",
    desc: "GTX-B, 인천1호선, 인천2호선 환승 예정",
    stat: { value: 3, suffix: "개 노선", label: "환승 예정" },
  },
  {
    no: "03",
    title: "구월동 복합개발 (구 농산물시장 부지)",
    desc: "대규모 주상복합 개발 계획",
    stat: null,
  },
];
