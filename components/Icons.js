// 가벼운 인라인 SVG 아이콘 모음 (외부 아이콘 라이브러리 미사용)

export function PhoneIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5 5L15.5 11l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 6.2 2 2 0 0 1 6.5 3Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ChatIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.8c-4.7 0-8.5 2.9-8.5 6.5 0 2.3 1.6 4.3 4 5.5-.2.7-.6 1.9-.7 2.2-.1.4.2.4.4.3.3-.2 2.1-1.4 2.9-1.9.6.1 1.3.2 1.9.2 4.7 0 8.5-2.9 8.5-6.3S16.7 3.8 12 3.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CalendarIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrainIcon({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="3.5" width="12" height="13" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 11h12M9 20l-2 1.5M15 20l2 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="9" cy="13.5" r="1.1" fill="currentColor" />
      <circle cx="15" cy="13.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function BuildingIcon({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 21V6l7-3 7 3v15" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 21v-4h6v4M9 9h1.5M9 12.5h1.5M13.5 9H15M13.5 12.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function StoreIcon({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9l1-4.5h14L20 9M4 9v10.5h16V9M4 9h16M9 19.5v-5h6v5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function LayersIcon({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l8 4.5-8 4.5-8-4.5L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4 12l8 4.5L20 12M4 16.5L12 21l8-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function MapPinIcon({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21c4-4.2 6.5-7.4 6.5-10.5A6.5 6.5 0 0 0 5.5 10.5C5.5 13.6 8 16.8 12 21Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="10.3" r="2.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function AwardIcon({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 13.5L7.5 21l4.5-2.5 4.5 2.5-1.5-7.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9.3 9.3l1.9 1.9 3.5-3.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
