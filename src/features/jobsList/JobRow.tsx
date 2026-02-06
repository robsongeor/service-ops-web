// JobRow.tsx
import React from "react";
import type { JobListItem } from "../../types/dataverse";
import { EditableCell } from "./EditableCell";
import { ActionButton } from "../../components/table/ActionButton/ActionButton";
import { Check, FileSpreadsheet, Mail, Pencil, X } from "lucide-react";
import { Td } from "./Td";
import type { JobColumn } from "./columns";
import { SelectCell } from "./SelectCell";

export type ActiveCell = { rowId: string; key: keyof JobListItem } | null;

export function JobRow({
    job,
    rowBg,
    columns,

    // editing state
    editingId,
    setEditingId,
    draft,
    setDraft,

    // cell state
    activeCell,
    setActiveCell,

    // actions
    onCopyToExcel,
    onEmailToTech,
    onSaveDraft,

    editable,
}: {
    job: JobListItem;
    rowBg: string;
    columns: JobColumn[];

    editable?: boolean;
    editingId: string | null;
    setEditingId: (id: string | null) => void;

    draft: Partial<JobListItem> | null;
    setDraft: React.Dispatch<React.SetStateAction<Partial<JobListItem> | null>>;

    activeCell: ActiveCell;
    setActiveCell: (c: ActiveCell) => void;

    onCopyToExcel: (job: JobListItem) => void | Promise<void>;
    onEmailToTech?: (job: JobListItem) => void | Promise<void>;
    onSaveDraft?: (jobId: string, draft: Partial<JobListItem>) => void | Promise<void>;


}) {
    const isEditingRow = editingId === job.id;
    const row = (isEditingRow ? (draft ?? job) : job) as JobListItem;

    function emailToTech(job: JobListItem) {
        console.log(job)
    }

    console.log(editable)

    return (
        <tr
            style={{
                background: isEditingRow ? "#eef2ff" : rowBg,
                outline: isEditingRow ? "2px solid #6366f1" : "none",
                outlineOffset: "-2px",
            }}
        >
            {columns.map((col) => {
                const raw = row[col.key];
                const value = col.getValue ? col.getValue(row) : (raw == null ? "" : String(raw));

                const common = {
                    key: `${job.id}-${String(col.key)}`,
                    rowId: job.id,
                    cellKey: col.key,
                    isEditingRow,
                    activeCell,
                    setActiveCell,
                    minWidth: col.minWidth,
                };

                if (col.kind === "select" && col.options) {
                    const current = raw == null ? "" : String(raw);

                    return (
                        <SelectCell
                            key={`${job.id}-${String(col.key)}`}
                            value={current}
                            options={col.options}
                            minWidth={col.minWidth}
                            disabled={false} // or some rule
                            onChange={(v) => {
                                const fullRow = { ...job, status: v };
                                onSaveDraft?.(job.id, fullRow);
                            }}
                        />
                    );
                }

                return (
                    <EditableCell
                        {...common}
                        mono={col.mono}
                        value={value}
                        onChange={(v) =>
                            setDraft((d) => {
                                const base = (d ?? job) as JobListItem;
                                const nextValue = col.parse ? col.parse(v, base) : v;
                                return { ...base, [col.key]: nextValue } as Partial<JobListItem>;
                            })
                        }
                    />
                );
            })}


            <Td>
                <div style={{ display: "flex", gap: 6 }}>
                    <ActionButton
                        title="JobBook Copy"
                        icon={<FileSpreadsheet size={14} />}
                        bg="#ecfdf5"
                        hoverBg="#d1fae5"
                        onClick={() => onCopyToExcel(job)}
                    />

                    {!isEditingRow && (
                        <>
                            {editable && <ActionButton
                                title="Edit"
                                icon={<Pencil size={14} />}
                                bg="#eff6ff"
                                hoverBg="#dbeafe"
                                onClick={() => {
                                    setEditingId(job.id);
                                    setDraft({ ...job });
                                    setActiveCell(null);
                                }}
                                disabled={editingId !== null}
                            />}
                            <ActionButton
                                title="Email to Technician"
                                icon={<Mail size={14} />}
                                bg="#fef3c7"
                                hoverBg="#fde68a"
                                onClick={() => emailToTech(job)}
                            />
                        </>
                    )}

                    {isEditingRow && (
                        <>
                            <ActionButton
                                title="Cancel"
                                icon={<X size={14} />}
                                bg="#fef2f2"
                                hoverBg="#fee2e2"
                                onClick={() => {
                                    setEditingId(null);
                                    setDraft(null);
                                    setActiveCell(null);
                                }}
                            />
                            <ActionButton
                                title="Save"
                                icon={<Check size={14} />}
                                bg="#ecfdf5"
                                hoverBg="#d1fae5"
                                onClick={() => {
                                    const d = draft ?? {};
                                    onSaveDraft?.(job.id, d);
                                    setEditingId(null);
                                    setDraft(null);
                                    setActiveCell(null);
                                }}
                            />
                        </>
                    )}
                </div>
            </Td>
        </tr>
    );
}
