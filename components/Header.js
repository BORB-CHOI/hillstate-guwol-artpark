import { site } from "@/lib/site";
import { PhoneIcon } from "./Icons";

export default function Header() {
  return (
    <header className="animate-header-in sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur-md">
      <div className="container-content flex h-14 items-center justify-between sm:h-16">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="text-lg font-extrabold tracking-tight text-brand sm:text-xl">
            힐스테이트 구월아트파크
          </span>
          <span className="hidden text-[11px] font-medium tracking-widest text-gold sm:inline">
            HILLSTATE
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-ink/70 md:flex">
          <a href="#benefits" className="nav-link hover:text-brand">입지와 장점</a>
          <a href="#why" className="nav-link hover:text-brand">방문 이유</a>
          <a href="#info" className="nav-link hover:text-brand">궁금증 해결</a>
          <a href="#reserve" className="nav-link hover:text-brand">방문예약</a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${site.phoneRaw}`}
            className="hidden items-center gap-1.5 text-sm font-semibold text-brand sm:flex"
          >
            <PhoneIcon className="h-4 w-4" />
            {site.phone}
          </a>
          <a href="#reserve" className="btn-cta !px-4 !py-2 text-sm">
            방문예약
          </a>
        </div>
      </div>
    </header>
  );
}
