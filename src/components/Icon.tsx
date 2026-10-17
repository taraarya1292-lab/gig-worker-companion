export function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: "leaf" | "wallet" | "shield" | "scale" | "file" | "path" | "mic" | "home";
  className?: string;
}) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  if (name === "leaf") {
    return (
      <svg {...props}>
        <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Z" />
        <path d="M8 16c2-3 5-6 9-8" />
      </svg>
    );
  }
  if (name === "wallet") {
    return (
      <svg {...props}>
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18" />
        <circle cx="16.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === "shield") {
    return (
      <svg {...props}>
        <path d="M12 3 5 6v6c0 4.5 3 7 7 9 4-2 7-4.5 7-9V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }
  if (name === "scale") {
    return (
      <svg {...props}>
        <path d="M12 3v18" />
        <path d="M8 21h8" />
        <path d="m12 6 7 3-7 4-7-4 7-3Z" />
      </svg>
    );
  }
  if (name === "file") {
    return (
      <svg {...props}>
        <path d="M7 3h7l5 5v13H7V3Z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6M9 17h6" />
      </svg>
    );
  }
  if (name === "path") {
    return (
      <svg {...props}>
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="18" r="2" />
        <path d="M8 7c6 1 8 8 8 9" />
      </svg>
    );
  }
  if (name === "mic") {
    return (
      <svg {...props}>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M6 11a6 6 0 0 0 12 0" />
        <path d="M12 17v4" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="m4 11 8-7 8 7" />
      <path d="M7 10v9h10v-9" />
    </svg>
  );
}
