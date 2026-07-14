"use client";

// 스크롤로 뷰포트에 들어올 때 한 번 슬라이드업 + 페이드인 되는 래퍼.
// 무거운 애니메이션 라이브러리 없이 IntersectionObserver만 사용.
//
// 안전장치: 옵저버가 어떤 이유로든(구형 브라우저, 확장 프로그램 간섭 등)
// 트리거되지 않으면 콘텐츠가 영구히 숨겨지는 것을 막기 위해
// 일정 시간 후 강제로 visible 처리한다.
import { useEffect, useRef, useState } from "react";

const animations = {
  up: "animate-slide-up-fade",
  left: "animate-slide-left-fade", // 왼쪽에서 들어옴
  right: "animate-slide-right-fade", // 오른쪽에서 들어옴
};

export default function Reveal({ children, className = "", delay = 0, from = "up" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          ob.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -12% 0px" }
    );
    ob.observe(el);

    return () => ob.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${visible ? animations[from] || animations.up : "opacity-0"} ${className}`}
      style={visible ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
