"use client";

// 관리자 화면의 준비도 체크 목록.
//
// 열 순서는 담당자가 전화를 걸기 전에 확인하는 순서를 따른다.
// 결과 → 주택 보유 → 신용불량 이력 → 기존대출 → 가족구성 → 희망타입.
// 결과 유형은 고객 화면에 코드로 노출하지 않지만, 담당자에게는 분류가
// 필요하므로 여기서는 라벨로 보여준다.

import { questions, answerLabel, results } from "@/lib/selfCheck";

// 담당자가 우선 연락할 순서를 색으로 구분한다.
const RESULT_STYLE = {
  ready: "bg-brand/10 text-brand",
  owner: "bg-gold/20 text-[#8A6A34]",
  credit: "bg-cta/10 text-cta",
};

const resultLabel = (type) => results[type]?.label || type || "-";

export default function SelfCheckTable({ rows, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-card">
      <table className="w-full min-w-[900px] text-sm">
        <thead className="bg-ivory text-left text-ink/60">
          <tr>
            <th className="px-4 py-3 font-semibold">접수일시</th>
            <th className="px-4 py-3 font-semibold">결과</th>
            <th className="px-4 py-3 font-semibold">이름</th>
            <th className="px-4 py-3 font-semibold">연락처</th>
            <th className="px-4 py-3 font-semibold">희망방문일시</th>
            <th className="px-4 py-3 font-semibold">주택 보유</th>
            <th className="px-4 py-3 font-semibold">신용불량 이력</th>
            <th className="px-4 py-3 font-semibold">기존대출</th>
            <th className="px-4 py-3 font-semibold">가족구성</th>
            <th className="px-4 py-3 font-semibold">희망타입</th>
            <th className="px-4 py-3 font-semibold">유입경로</th>
            <th className="px-4 py-3 font-semibold">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {rows.map((r) => {
            const a = r.answers || {};
            return (
              <tr key={r.id} className="hover:bg-ivory/50">
                <td className="whitespace-nowrap px-4 py-3 text-ink/70">
                  {new Date(r.created_at).toLocaleString("ko-KR")}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      RESULT_STYLE[r.result_type] || RESULT_STYLE.ready
                    }`}
                  >
                    {resultLabel(r.result_type)}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-ink">{r.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink/80">{r.phone}</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink/80">
                  {`${r.visit_date || ""} ${r.visit_time || ""}`.trim() || "-"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink/80">
                  {answerLabel("own", a.own)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {/* 신용 이력이 있으면 상담 방향이 달라져서 눈에 띄게 둔다 */}
                  <span
                    className={
                      a.credit === "no" ? "text-ink/80" : "font-semibold text-cta"
                    }
                  >
                    {answerLabel("credit", a.credit)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink/80">
                  {answerLabel("loan", a.loan)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink/80">
                  {answerLabel("family", a.family)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink/80">
                  {answerLabel("type", a.type)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink/70">
                  {[r.utm_source, r.utm_medium, r.utm_campaign].filter(Boolean).join(" / ") || "-"}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onDelete(r)}
                    className="rounded-lg border border-cta/30 px-2.5 py-1 text-xs font-semibold text-cta hover:bg-cta hover:text-white"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={12} className="px-4 py-10 text-center text-ink/50">
                접수된 진단 결과가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// CSV로 내보낼 때 쓰는 행 변환. 문항 답변을 모두 펼쳐서 담는다.
export const selfCheckCsv = (rows) => {
  const header = [
    "접수일시",
    "결과",
    "이름",
    "연락처",
    "희망방문일시",
    ...questions.map((q) => q.title),
    "유입경로",
  ];
  const lines = rows.map((r) =>
    [
      new Date(r.created_at).toLocaleString("ko-KR"),
      resultLabel(r.result_type),
      r.name,
      r.phone,
      `${r.visit_date || ""} ${r.visit_time || ""}`.trim(),
      ...questions.map((q) => answerLabel(q.id, (r.answers || {})[q.id])),
      [r.utm_source, r.utm_medium, r.utm_campaign].filter(Boolean).join(" / "),
    ]
      .map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`)
      .join(",")
  );
  return "﻿" + [header.join(","), ...lines].join("\n");
};
