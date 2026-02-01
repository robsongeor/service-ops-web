import type { ReactNode } from "react";

export function ActionButton({
    icon,
    title,
    onClick,
    bg = "#ffffff",
    hoverBg = "#f3f4f6",
    disabled,
}: {
    icon: ReactNode;
    title: string;
    onClick?: () => void;
    bg?: string;
    hoverBg?: string;
    disabled?: boolean;
}) {
    return (
        <button
            title={title}
            aria-label={title}
            onClick={onClick}
            disabled={disabled}
            style={{
                width: 28,
                height: 28,
                padding: 0,
                border: "1px solid #d1d5db",
                borderRadius: 4,
                background: bg,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s ease, border-color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
            onMouseLeave={(e) => (e.currentTarget.style.background = bg)}
        >
            {icon}
        </button>
    );
}
