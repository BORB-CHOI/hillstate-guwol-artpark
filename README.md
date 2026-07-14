# 힐스테이트 구월아트파크 — 홍보관 방문예약 랜딩페이지

광고 클릭 → **홍보관 방문예약** 전환을 목표로 하는 Next.js 랜딩페이지입니다.
"우리 아파트 최고" 식이 아니라 **고객이 궁금한 점을 먼저 해결하고**,
가격·할인 문구 없이 자연스럽게 방문예약으로 유도하는 구성입니다.

> 개발 범위: **Premium** (Standard + 카카오 알림 연동 + 커스텀 기능)

---

## 핵심 구성

| 섹션 | 내용 |
|------|------|
| Hero | "구월동 중심, 브랜드 신축 주거공간" + 방문예약/전화상담 |
| 실거주 장점 | 입지·브랜드·인프라·교통·타입 (큰 사진) |
| 왜 방문해야 하나 | 실제 유니트 관람·타입 비교·옵션·계약 절차 안내 |
| 궁금증 해결 Q&A | 분양가·계약금·중도금·GTX·타입·실거주 (**가격 미노출**, 홍보관 안내로 유도) |
| 예약폼 | 이름·전화·희망일·시간 (짧게) + 개인정보 동의 |
| Floating CTA | 데스크톱 우측 고정 / 모바일 하단 고정바 (전화·카카오·예약) |

### 절대 사용하지 않은 표현
분양가 금액, ○억원, 계약금 액수, 특별분양가, 할인, 선착순 가격 — **일절 노출하지 않습니다.**
가격 관련 질문은 모두 "홍보관 개별 안내"로 연결됩니다.

---

## 프리미엄 기능

- **문의 DB 저장** — Supabase(Postgres). 미설정 시 로컬 JSON 파일로 대체(개발용).
- **문의 내역 조회**
  - 고객: `/lookup` — 전화번호로 본인 예약 확인
  - 관리자: `/admin` — 토큰 입력 후 전체 목록 + CSV 다운로드
- **담당자 알림** — 신규 문의(관심고객 등록·방문예약) 시 담당자에게만 통보.
  카카오톡 "나에게 보내기"(중개 서비스 불필요) 또는 문자(Solapi) 중 설정된
  채널로 발송. 고객에게는 알림을 보내지 않음. 미설정 시 콘솔 로그로 대체.
- **SEO** — 메타데이터/OpenGraph, `robots.txt`, `sitemap.xml`, JSON-LD 구조화 데이터.
- **PDF 자료** — `public/자료.pdf` (플레이스홀더 → 공식 분양 자료로 교체).

---

## 실행 방법

```bash
npm install
cp .env.example .env.local   # 값 채우기 (없어도 로컬 동작함)
npm run dev                  # http://localhost:3000
```

프로덕션 빌드:

```bash
npm run build && npm start
```

---

## 배포 (Vercel)

1. GitHub에 이 저장소를 푸시합니다.
2. [Vercel](https://vercel.com)에서 New Project → 저장소 선택.
3. **Environment Variables**에 `.env.example` 항목을 입력합니다.
   - ⚠️ Vercel은 서버리스라 로컬 JSON 저장이 유지되지 않습니다.
     실제 운영에서는 **반드시 Supabase 환경변수**를 설정하세요.
4. Deploy. 배포 후 `NEXT_PUBLIC_SITE_URL`을 실제 도메인으로 갱신하세요.

### Supabase 설정
`supabase.sql`을 Supabase SQL Editor에서 실행 → `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY` 환경변수 등록.

### 담당자 알림 설정 (둘 중 하나만 해도 됩니다)

**방법 A) 카카오톡 "나에게 보내기" (추천 — 중개 서비스·심사 불필요)**
1. [카카오 디벨로퍼스](https://developers.kakao.com)에서 애플리케이션 생성
2. [앱 설정 > 카카오 로그인] 활성화, Redirect URI에
   `{배포주소}/api/kakao/callback` 등록 (로컬 테스트는 `http://localhost:3000/api/kakao/callback`)
3. [제품 설정 > 카카오 로그인 > 동의항목]에서 "카카오톡 메시지 전송(talk_message)" 활성화
4. `.env.local`에 `KAKAO_REST_API_KEY`, `KAKAO_REDIRECT_URI` 입력
5. 브라우저로 `/api/kakao/authorize?token={ADMIN_TOKEN}` 접속 → 카카오 로그인 동의
6. 콜백 화면에 뜨는 `refresh_token`을 `.env.local`의 `KAKAO_REFRESH_TOKEN`에 저장
7. 설정 완료 후 `/api/kakao/authorize`, `/api/kakao/callback` 라우트는 지워도 됩니다.

**방법 B) 문자(SMS, Solapi)**
[Solapi](https://solapi.com) 가입 → API Key/Secret 발급, 발신번호 등록 →
`SOLAPI_API_KEY`, `SOLAPI_API_SECRET`, `SOLAPI_SENDER`, `ADMIN_PHONE` 환경변수 등록.

---

## 교체 체크리스트 (오픈 전)

- [ ] `lib/site.js` — 대표 전화번호, 카카오 채널 URL, 홍보관 주소/운영시간
- [ ] `public/images/` — 조감도/투시도/유니트 **실제 사진**을 지정된 파일명으로 저장
      (파일이 있으면 자동 인식됨, 코드 수정 불필요)
- [ ] `public/자료.pdf` — **공식 분양 자료**로 교체
- [ ] `.env.local` / Vercel 환경변수 — Supabase, 담당자 알림(카카오 또는 Solapi), ADMIN_TOKEN
- [ ] `NEXT_PUBLIC_SITE_URL` — 실제 배포 도메인

---

## 기술 스택
Next.js 15 (App Router) · React 19 · Tailwind CSS 3 · Supabase(REST) · 카카오/Solapi

## 주요 경로
```
app/
  page.js                 랜딩 (Hero → 장점 → 단지상세 → 왜방문 → Q&A → 예약폼)
  lookup/page.js          고객 예약 조회
  admin/page.js           관리자 문의 목록 + CSV
  api/reservations/       접수(POST)·목록(GET)·lookup
  api/kakao/              카카오 "나에게 보내기" 최초 설정용 (authorize·callback)
lib/
  site.js                 사이트 공통 설정 (전화/카카오/주소)
  db.js                   저장소 (Supabase ↔ 로컬 JSON)
  kakao.js                담당자 알림 (카카오 나에게 보내기 / Solapi SMS)
  kakaoSelf.js             카카오 "나에게 보내기" 토큰 발급·갱신·발송
components/               섹션별 UI 컴포넌트
```
