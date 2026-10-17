import { Icon } from "@/components/Icon";
import { t } from "@/lib/text";
import type { Language } from "@/lib/types";
import type { ViewName } from "@/components/HomeView";

export function BottomNav({
  language,
  view,
  onHome,
  onSathi,
  onServices,
  onMore,
}: {
  language: Language;
  view: ViewName;
  onHome: () => void;
  onSathi: () => void;
  onServices: () => void;
  onMore: () => void;
}) {
  const items = [
    { id: "home", label: t(language, "Home", "होम"), active: view === "home", onClick: onHome, icon: <Icon name="home" /> },
    { id: "sathi", label: "Sathi AI", active: view === "grievance", onClick: onSathi, icon: <BotIcon /> },
    { id: "services", label: t(language, "Services", "सेवाएँ"), active: false, onClick: onServices, icon: <GridIcon /> },
    { id: "more", label: t(language, "More", "और"), active: view === "more", onClick: onMore, icon: <DotsIcon /> },
  ];

  return (
    <nav className="shrink-0 border-t border-[#d7e6de] bg-white" aria-label={t(language, "Main", "मुख्य")}>
      <div className="mx-auto grid max-w-lg grid-cols-4 px-2 py-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            aria-current={item.active ? "page" : undefined}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-semibold ${item.active ? "text-[#1f9a57]" : "text-[#7b8794]"}`}
          >
            <span className={`flex h-8 w-12 items-center justify-center rounded-2xl ${item.active ? "bg-[#e7f8ee]" : ""}`}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function BotIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="6" y="8" width="12" height="10" rx="4" />
      <path d="M12 8V5" />
      <circle cx="12" cy="4" r="1" fill="currentColor" stroke="none" />
      <path d="M9 13h.01M15 13h.01" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <circle cx="6" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="18" cy="12" r="1.6" />
    </svg>
  );
}
