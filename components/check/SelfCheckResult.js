// 결과 화면. 어두운 섹션 안에 밝은 '결과지'가 한 장 놓인 형태다.
// 인장은 종이 위에서만 물성이 사는 요소(mix-blend-multiply)라 배경을 밝게 쓴다.
//
// 답변이 끝나면 연락처를 받기 전에 결과부터 보여준다. 진단 결과를 인질로
// 잡고 연락처를 요구하면 이탈한다. 결과를 먼저 보여주고, 그 아래에서
// "그럼 이 부분을 같이 정리해 드릴까요"로 상담을 청한다.
//
// 폼 문구는 결과 유형마다 다르다(lib/selfCheck.js의 formTitle, formBody).

import { results, disclaimer } from "@/lib/selfCheck";
import { formatPhone } from "@/lib/phone";
import { site } from "@/lib/site";
import { PhoneIcon, CalendarIcon, ChatIcon, CheckIcon } from "../Icons";
import SelfCheckSeal from "./SelfCheckSeal";

// 방문예약 폼과 같은 기준. 오늘 이전 날짜는 고를 수 없게 한다.
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

export default function SelfCheckResult({
  resultType,
  contact,
  status,
  submitted,
  error,
  onContactChange,
  onSubmit,
}) {
  const r = results[resultType];

  return (
    <div className="step-next mx-auto w-full max-w-2xl rounded-3xl bg-ivory p-6 shadow-soft sm:p-10">
      <p className="text-center text-sm font-semibold tracking-widest text-gold">CHECK COMPLETE</p>
      <h2 className="mt-3 break-keep text-center text-2xl font-extrabold text-brand sm:text-3xl">
        {r.headline}
      </h2>
      <p className="mx-auto mt-4 max-w-xl break-keep text-center text-base leading-relaxed text-ink/65 sm:text-lg">
        {r.body}
      </p>

      {/* 시그니처: 3단 관문 인장 */}
      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5">
        {r.seals.map((s, i) => (
          <div
            key={s.label}
            className="seal-row flex items-center justify-between gap-4 border-b border-black/5 px-5 py-4 last:border-b-0 sm:px-7 sm:py-5"
            style={{ animationDelay: `${i * 180}ms` }}
          >
            <div>
              <p className="text-xs tracking-wide text-ink/45">{s.label}</p>
              <p className="mt-1 break-keep text-lg font-bold text-brand sm:text-xl">{s.value}</p>
            </div>
            <SelfCheckSeal
              className="h-14 w-14 shrink-0 sm:h-16 sm:w-16"
              style={{ animationDelay: `${i * 180 + 120}ms` }}
            />
          </div>
        ))}
      </div>

      {/* 체크리스트 — 인장 카드와 물성을 구분하는 상단 골드 라인 */}
      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5">
        <div className="h-1 w-full bg-gold" />
        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-bold text-brand">방문 시 이것만 확인하면 됩니다</h3>
          <ul className="mt-4 grid gap-3">
            {r.checklist.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-base text-ink/75">
                <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 상담으로 귀결 — 접수 전에는 폼, 접수 후에는 연결 수단 */}
      {submitted ? (
        <div className="mt-10">
          <div className="rounded-2xl bg-brand/5 px-6 py-5 text-center">
            <p className="break-keep font-bold text-brand">
              접수됐습니다. 담당 상담사가 연락드려 일정을 확정해 드립니다.
            </p>
            <p className="mt-2 text-sm text-ink/60">
              희망 방문 <b className="text-brand">{contact.date}</b>
              {contact.time ? ` ${contact.time}` : ""}
            </p>
            <p className="mt-1.5 text-sm text-ink/55">먼저 연락하고 싶으시면 아래를 눌러주세요.</p>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <a href={`tel:${site.phoneRaw}`} className="btn-cta w-full py-4 text-lg">
              <PhoneIcon className="h-5 w-5" />
              지금 전화로 상담받기
            </a>
            <a href="#reserve" className="btn-call w-full py-4 text-lg">
              <CalendarIcon className="h-5 w-5" />
              홍보관 방문예약
            </a>
            <a
              href={site.kakaoUrl}
              target="_blank"
              rel="noopener"
              className="btn-kakao w-full py-4 text-lg"
            >
              <ChatIcon className="h-5 w-5" />
              카카오톡으로 문의
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-10 rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5 sm:p-8">
          <h3 className="break-keep text-xl font-extrabold text-brand sm:text-2xl">{r.formTitle}</h3>
          <p className="mt-2 break-keep text-sm leading-relaxed text-ink/60">{r.formBody}</p>

          <div className="mt-6 grid gap-3">
            <input
              type="text"
              value={contact.name}
              onChange={(e) => onContactChange({ name: e.target.value })}
              placeholder="성함"
              autoComplete="name"
              className="result-input"
            />
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) => onContactChange({ phone: formatPhone(e.target.value) })}
              placeholder="010-0000-0000"
              autoComplete="tel"
              inputMode="numeric"
              maxLength={13}
              className="result-input"
            />

            {/* 방문 일시 — 홍보관 방문예약 폼과 같은 항목을 받는다 */}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold text-ink/50">희망 방문일</span>
                <input
                  type="date"
                  value={contact.date}
                  min={todayStr()}
                  onChange={(e) => onContactChange({ date: e.target.value })}
                  className="result-input"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold text-ink/50">희망 방문시간</span>
                <input
                  type="time"
                  value={contact.time}
                  step="60"
                  onChange={(e) => onContactChange({ time: e.target.value })}
                  className="result-input"
                />
              </label>
            </div>

            <label className="mt-1 flex items-start gap-2 text-sm leading-snug text-ink/55">
              <input
                type="checkbox"
                checked={contact.agree}
                onChange={(e) => onContactChange({ agree: e.target.checked })}
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
              />
              <span>[필수] 개인정보 수집, 이용에 동의합니다. (상담 목적으로만 이용)</span>
            </label>

            {/* 허니팟 (봇 차단) */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={contact.company}
              onChange={(e) => onContactChange({ company: e.target.value })}
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-cta w-full py-4 text-lg disabled:opacity-60"
            >
              {status === "loading" ? "접수 중..." : "상담 신청하기"}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-center text-sm font-medium text-cta" role="alert">
              {error}
            </p>
          )}

          {/* 연락처를 남기지 않아도 바로 연결될 수 있게 둔다 */}
          <div className="mt-5 flex items-center justify-center gap-5 border-t border-black/5 pt-5 text-sm">
            <a href={`tel:${site.phoneRaw}`} className="nav-link font-semibold text-brand">
              바로 전화하기
            </a>
            <a
              href={site.kakaoUrl}
              target="_blank"
              rel="noopener"
              className="nav-link font-semibold text-brand"
            >
              카카오톡 문의
            </a>
          </div>
        </form>
      )}

      <p className="mx-auto mt-6 max-w-md break-keep text-center text-xs leading-relaxed text-ink/45">
        {disclaimer}
      </p>
    </div>
  );
}
