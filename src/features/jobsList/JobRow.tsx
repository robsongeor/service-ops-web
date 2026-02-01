// JobRow.tsx
import React from "react";
import type { JobListItem } from "../../types/dataverse";
import { EditableCell } from "./EditableCell";
import { formatNZDate } from "../../lib/utils/date";

import { ActionButton } from "../../components/table/ActionButton/ActionButton";
import { Check, FileSpreadsheet, Mail, Pencil, X } from "lucide-react";
import { Td } from "./Td";


export type ActiveCell = { rowId: string; key: keyof JobListItem } | null;

export function JobRow({
    job,
    rowBg,

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
}: {
    job: JobListItem;
    rowBg: string;

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

    return (
        <tr
            style={{
                background: isEditingRow ? "#eef2ff" : rowBg,
                outline: isEditingRow ? "2px solid #6366f1" : "none",
                outlineOffset: "-2px",
            }}
        >
            <EditableCell
                rowId={job.id}
                cellKey="jobNumber"
                mono
                isEditingRow={isEditingRow}
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                value={row.jobNumber}
                onChange={(v) => setDraft((d) => ({ ...(d ?? job), jobNumber: v }))}
            />

            <EditableCell
                rowId={job.id}
                cellKey="date"
                isEditingRow={isEditingRow}
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                value={formatNZDate(row.date)}
                onChange={(v) => setDraft((d) => ({ ...(d ?? job), date: v }))}
            />

            <EditableCell
                rowId={job.id}
                cellKey="mechanic"
                isEditingRow={isEditingRow}
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                value={row.mechanic}
                onChange={(v) => setDraft((d) => ({ ...(d ?? job), mechanic: v }))}
            />

            <EditableCell
                rowId={job.id}
                cellKey="model"
                isEditingRow={isEditingRow}
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                value={row.model}
                onChange={(v) => setDraft((d) => ({ ...(d ?? job), model: v }))}
            />

            <EditableCell
                rowId={job.id}
                cellKey="fleetNumber"
                mono
                isEditingRow={isEditingRow}
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                value={row.fleetNumber}
                onChange={(v) => setDraft((d) => ({ ...(d ?? job), fleetNumber: v }))}
            />

            <EditableCell
                rowId={job.id}
                cellKey="companyName"
                isEditingRow={isEditingRow}
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                value={row.companyName}
                onChange={(v) => setDraft((d) => ({ ...(d ?? job), companyName: v }))}
            />

            <EditableCell
                rowId={job.id}
                cellKey="description"
                isEditingRow={isEditingRow}
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                value={row.description}
                onChange={(v) => setDraft((d) => ({ ...(d ?? job), description: v }))}
            />

            <EditableCell
                rowId={job.id}
                cellKey="siteAddress"
                isEditingRow={isEditingRow}
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                value={row.siteAddress}
                onChange={(v) => setDraft((d) => ({ ...(d ?? job), siteAddress: v }))}
            />

            <EditableCell
                rowId={job.id}
                cellKey="siteSuburb"
                isEditingRow={isEditingRow}
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                value={row.siteSuburb}
                onChange={(v) => setDraft((d) => ({ ...(d ?? job), siteSuburb: v }))}
            />

            <EditableCell
                rowId={job.id}
                cellKey="siteCity"
                isEditingRow={isEditingRow}
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                value={row.siteCity}
                onChange={(v) => setDraft((d) => ({ ...(d ?? job), siteCity: v }))}
            />

            <EditableCell
                rowId={job.id}
                cellKey="customerPo"
                mono
                isEditingRow={isEditingRow}
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                value={row.customerPo}
                onChange={(v) => setDraft((d) => ({ ...(d ?? job), customerPo: v }))}
            />

            <EditableCell
                rowId={job.id}
                cellKey="contactName"
                isEditingRow={isEditingRow}
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                value={row.contactName}
                onChange={(v) => setDraft((d) => ({ ...(d ?? job), contactName: v }))}
            />

            <EditableCell
                rowId={job.id}
                cellKey="contactPhone"
                mono
                isEditingRow={isEditingRow}
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                value={row.contactPhone}
                onChange={(v) => setDraft((d) => ({ ...(d ?? job), contactPhone: v }))}
            />

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
                            <ActionButton
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
                            />
                            <ActionButton
                                title="Email to Technician"
                                icon={<Mail size={14} />}
                                bg="#fef3c7"
                                hoverBg="#fde68a"
                                onClick={() => onEmailToTech?.(job)}
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
