// 한국 휴대폰 번호 입력 정규화 유틸.
// 브라우저 자동완성이 국제표기(+8210...)를 넣거나 사용자가 숫자만 쳐도
// 국내 형식(010-0000-0000)으로 맞춰준다.

// 숫자만 남기고, 국제표기 +82 를 국내 0 으로 치환한다. 최대 11자리.
export function normalizeDigits(raw) {
  let d = String(raw ?? "").replace(/\D/g, "");
  if (d.startsWith("82")) d = "0" + d.slice(2);
  return d.slice(0, 11);
}

// 입력 중에도 자동으로 하이픈을 넣어준다 (010-1234-5678 / 010-123-4567).
export function formatPhone(raw) {
  const d = normalizeDigits(raw);
  if (d.length < 4) return d;
  if (d.length < 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length < 11) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

// 010/011/016/017/018/019 휴대폰 유효성 (하이픈·국제표기 무관).
export const isValidMobile = (raw) => /^01[016789][0-9]{7,8}$/.test(normalizeDigits(raw));
