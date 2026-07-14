"use client";

// 스크롤로 보이는 순간 숫자가 0부터 목표값까지 올라가는 카운터.
// isanghan.co.kr의 counterup 패턴을 라이브러리 없이 재구현했다.
// prefers-reduced-motion 환경에서는 애니메이션 없이 최종값을 바로 보여준다.
import { useEffect, useRef, useState } from "react";

export default function CountUp({ end, duration = 1600, suffix = "", className = "" }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || typeof IntersectionObserver === "undefined") {
      setValue(end);
      setDone(true);
      return;
    }

    let raf;
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        ob.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          // ease-out: 마지막에 천천히 멈춘다
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(end * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
          else setDone(true);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    ob.observe(el);

    return () => {
      ob.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [end, duration]);

  return (
    <span ref={ref} className={className} aria-label={`${end}${suffix}`}>
      {done ? end.toLocaleString() : value.toLocaleString()}
      {suffix}
    </span>
  );
}
