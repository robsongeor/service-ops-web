export function SelectCell({
    value,
    options,
    onChange,
    minWidth,
    disabled,
}: {
    value: string;
    options: { label: string; value: string }[];
    onChange: (v: string) => void;
    minWidth?: number;
    disabled?: boolean;
}) {
    return (
        <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", minWidth }}>
            <select
                value={value ?? ""}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    background: "white",
                    opacity: disabled ? 0.6 : 1,
                    cursor: disabled ? "not-allowed" : "pointer",
                }}
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </td>
    );
}
