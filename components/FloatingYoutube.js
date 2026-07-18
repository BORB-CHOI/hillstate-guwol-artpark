import { site } from "@/lib/site";
import { YoutubeIcon } from "./Icons";

// 우측 하단 유튜브 채널 바로가기.
//
// 인스타 아이콘(kittychat의 iframe.ppc-widget) 바로 위 칸에 12px 띄워 세운다.
// 스택 값은 app/globals.css의 플로팅 스택 블록과 함께 맞춘다.
//   데스크톱: 인스타 20 + 80 + 12 = bottom 112px
//   모바일  : 인스타 84 + 80 + 12 = bottom 176px
//
// 가로 정렬: 인스타 iframe은 80px 폭이고 이 버튼은 56px이라, 오른쪽 여백을
// 똑같이 주면 가운데가 12px 어긋난다. 중심을 맞추려면 right: 32px이어야 한다.
//   (뷰포트 430 기준: 인스타 중심 370, 32px일 때 유튜브 중심 370)

export default function FloatingYoutube() {
  return (
    <a
      href={site.youtubeUrl}
      target="_blank"
      rel="noopener"
      aria-label="유튜브 채널 박진과장 새 창으로 열기"
      className="fixed bottom-[176px] right-8 z-[9999999] grid h-14 w-14 place-items-center rounded-xl bg-[#FF0000] text-white shadow-soft transition-transform duration-200 hover:scale-105 active:scale-95 md:bottom-[112px]"
    >
      <YoutubeIcon className="h-9 w-9" />
    </a>
  );
}
