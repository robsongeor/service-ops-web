// Td.tsx
import React from "react";

export function Td({
    children,
    mono,
    title,
}: {
    children: React.ReactNode;
    mono?: boolean;
    title?: string;
}) {
    return (
        <td
            title={title}
            style={{
                padding: "10px 12px",
                borderBottom: "1px solid #eee",
                fontSize: 13,
                whiteSpace: "nowrap",
                fontFamily: mono
                    ? "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                    : undefined,
            }}
        >
            {children}
        </td>
    );
}
