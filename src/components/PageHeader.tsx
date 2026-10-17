import type { ReactNode } from "react";

export function PageHeader({
  badge,
  icon,
  title,
  detail,
}: {
  badge: string;
  icon: ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <header className="flex items-start gap-3">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${badge}`}>{icon}</span>
      <div>
        <h1 className="text-2xl font-semibold leading-tight text-[#12284d]">{title}</h1>
        <p className="mt-1 text-base leading-6 text-[#314356]">{detail}</p>
      </div>
    </header>
  );
}
