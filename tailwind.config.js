/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 힐스테이트 실제 브랜드 무드: 딥 차콜 블랙 + 골드 + 크림슨 레드, 라이트 배경
        // (공식 브리핑북 실측 색상 기준 — 그린 계열 아님)
        brand: {
          DEFAULT: "#1C1917", // 딥 차콜 블랙 (헤더/포인트 텍스트/다크 밴드)
          dark: "#100E0D",
          light: "#3A3430",
        },
        gold: {
          DEFAULT: "#B8965A",
          light: "#D8C39A",
        },
        cta: {
          DEFAULT: "#5C1C1D", // 힐스테이트 시그니처 레드 (로고·방문예약 버튼)
          dark: "#431516",
          // 다크 배경(brand) 위에 쓰는 밝은 톤 — DEFAULT는 어두운 바탕에서 대비가 거의 없음(약 1.5:1)
          light: "#E8897E",
        },
        ivory: "#F7F4EF",
        ink: "#1F2421",
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "sans-serif"],
        // 히어로 브러시 태그라인 전용 — 본문/제목에는 쓰지 않는다
        script: ["var(--font-script)", "cursive"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(28, 25, 23, 0.22)",
        card: "0 4px 24px -8px rgba(28, 25, 23, 0.14)",
      },
      maxWidth: {
        content: "1120px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        "slide-up-fade": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-left-fade": {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-right-fade": {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "header-in": {
          "0%": { opacity: "0", transform: "translateY(-100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "hero-zoom": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        "float-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-7px)" },
        },
        "shine": {
          "0%": { transform: "translateX(-130%) skewX(-18deg)" },
          "55%, 100%": { transform: "translateX(230%) skewX(-18deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        "pulse-soft": "pulse-soft 1.8s ease-in-out infinite",
        "slide-up-fade": "slide-up-fade 0.8s cubic-bezier(0.16,1,0.3,1) both",
        "slide-left-fade": "slide-left-fade 0.8s cubic-bezier(0.16,1,0.3,1) both",
        "slide-right-fade": "slide-right-fade 0.8s cubic-bezier(0.16,1,0.3,1) both",
        "header-in": "header-in 0.55s cubic-bezier(0.16,1,0.3,1) both",
        "hero-zoom": "hero-zoom 16s ease-out both",
        "float-gentle": "float-gentle 3.6s ease-in-out infinite",
        "shine": "shine 3.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
