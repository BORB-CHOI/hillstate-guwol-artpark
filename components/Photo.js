// 사진 플레이스홀더 컴포넌트
// 실제 조감도/투시도/유니트 사진으로 교체할 위치를 명확히 표시합니다.
//
// 사용법:
//   1) PDF·공식 자료에서 아래 label 에 맞는 사진을 고른다.
//   2) public/images/ 에 파일명(hint)대로 저장한다.  예: public/images/hero.jpg
// hint 로 지정한 파일이 public/images/ 에 실제로 존재하면 자동으로 그 사진을
// 쓰고, 없으면 스켈레톤을 보여준다 (서버에서 fs.existsSync 로 직접 확인 —
// src 를 일일이 손으로 지정할 필요 없음). src 를 명시하면 그 값이 우선한다.
//
// overlay 캡션(번호+제목+설명)을 넘기면, 실제 사진 위/스켈레톤 위 모두에
// 한국식 상세페이지 특유의 "이미지 + 큰 카피 오버레이" 형태로 렌더링됩니다.
// — 큰 배너형 이미지(21:9, 16:10 등 폭이 넓은 컷) 전용. 작은 썸네일에
//   overlay를 쓰면 글자가 사진을 다 가리므로, 그리드에 나열되는 작은
//   사진에는 overlay 대신 caption(이미지 아래 텍스트)을 사용하세요.

import fs from "node:fs";
import path from "node:path";

function resolveSrc(explicitSrc, hint) {
  if (explicitSrc) return explicitSrc;
  if (!hint) return null;
  const filePath = path.join(process.cwd(), "public", "images", hint);
  return fs.existsSync(filePath) ? `/images/${hint}` : null;
}

const gradients = {
  green: "from-brand via-brand-light to-[#3f6f5c]",
  gold: "from-[#8a7143] via-gold to-[#d8c39c]",
  slate: "from-[#3a4a44] via-[#55706651] to-[#7d8f88]",
  charcoal: "from-brand via-brand-light to-[#54493f]",
};

export default function Photo({
  src,
  alt = "",
  label = "이미지 준비 중",
  hint, // 저장할 파일명 힌트. 예: "hero.jpg"
  ratio = "4/3",
  tone = "charcoal",
  className = "",
  priority = false,
  overlay, // { no, title, desc } - 큰 배너형 이미지 전용, 사진 위 오버레이 캡션
  caption, // 작은 썸네일용 - 사진 "아래"에 표시되는 짧은 캡션 텍스트
  fit = "cover", // 로고나 도면처럼 잘리면 안 되는 이미지는 fit="contain" 사용
  frame = "photo", // "photo": 사진용 큰 라운딩, "diagram": 도면용 얇은 테두리, "flat": 라운딩 없음(로고 등)
}) {
  const resolvedSrc = resolveSrc(src, hint);
  const frameClass =
    frame === "diagram"
      ? "rounded-2xl border border-black/10"
      : frame === "flat"
        ? ""
        : "rounded-3xl";

  // 한 화면(뷰포트 높이)을 넘지 않게 하되, 잘림은 만들지 않는다.
  // maxHeight + object-cover는 오히려 잘림을 만들기 때문에, 비율은 그대로 두고
  // 폭을 비율에 맞춰 제한해서(높이 <= 82vh) 박스가 항상 실측 비율을 유지하게 한다.
  const [rw, rh] = String(ratio).split("/").map(Number);
  const aspect = rw && rh ? rw / rh : 1;

  const imageBox = (
    <div
      className={`group relative mx-auto w-full overflow-hidden ${frameClass} ${fit === "contain" ? "bg-white" : ""}`}
      style={{ aspectRatio: ratio, maxWidth: `calc(82vh * ${aspect})` }}
    >
      {resolvedSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          className={`photo-motion h-full w-full object-${fit} ${fit === "contain" ? "p-3" : ""} ${className}`}
        />
      ) : (
        <div
          role="img"
          aria-label={alt || label}
          className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br ${gradients[tone]} ${className}`}
        >
          <div className="absolute inset-3 rounded-2xl border-2 border-dashed border-white/35" aria-hidden="true" />
          <div
            className="absolute inset-0 opacity-20"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,.45), transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,.25), transparent 40%)",
            }}
          />
          <div className="relative z-10 max-w-[85%] text-center text-white/90">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-white/70">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="8.5" cy="10" r="1.6" />
                <path d="M21 17l-5-5-9 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold leading-snug tracking-wide">{label}</p>
            {hint && (
              <p className="mt-1.5 inline-block rounded-md bg-black/25 px-2 py-0.5 font-mono text-[11px] text-white/80">
                public/images/{hint}
              </p>
            )}
            <p className="mt-1 text-[11px] text-white/60">실제 사진으로 교체할 영역</p>
          </div>
        </div>
      )}

      {overlay && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/55 to-transparent p-5 pt-24 transition-transform duration-500 group-hover:translate-y-[-4px] sm:p-9 sm:pt-32">
          {overlay.no && (
            <span className="text-2xl font-extrabold text-gold-light sm:text-3xl">{overlay.no}</span>
          )}
          <h3 className="text-lg font-bold text-white drop-shadow-md sm:text-2xl md:text-3xl">{overlay.title}</h3>
          {overlay.desc && (
            <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-white/90 drop-shadow-md sm:text-base">{overlay.desc}</p>
          )}
        </div>
      )}
    </div>
  );

  if (!caption) return imageBox;

  return (
    <figure>
      {imageBox}
      <figcaption className="mt-2.5 text-sm font-bold text-ink sm:text-base">{caption}</figcaption>
    </figure>
  );
}
