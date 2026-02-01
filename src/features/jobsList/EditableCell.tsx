import type { JobListItem } from "../../types/dataverse";
import { Td } from "./Td";



export type ActiveCell = { rowId: string; key: keyof JobListItem } | null;

export function EditableCell({
    rowId,
    cellKey,
    value,
    isEditingRow,
    activeCell,
    setActiveCell,
    mono,
    onChange,
}: {
    rowId: string;
    cellKey: keyof JobListItem;
    value: string;
    isEditingRow: boolean;
    activeCell: ActiveCell;
    setActiveCell: (c: ActiveCell) => void;
    mono?: boolean;
    onChange: (v: string) => void;
}) {
    const isActive =
        isEditingRow &&
        activeCell?.rowId === rowId &&
        activeCell?.key === cellKey;

    return (
        <Td mono={mono}>
            {isActive ? (
                <input
                    autoFocus
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={() => setActiveCell(null)}
                    style={{
                        width: "100%",
                        fontSize: 13,
                        padding: "4px 6px",
                        border: "1px solid #c7d2fe",
                        borderRadius: 4,
                    }}
                />
            ) : (
                <div
                    onClick={() => isEditingRow && setActiveCell({ rowId, key: cellKey })}
                    style={{ cursor: isEditingRow ? "text" : "default" }}
                >
                    {value || "—"}
                </div>
            )}
        </Td>
    );
}
