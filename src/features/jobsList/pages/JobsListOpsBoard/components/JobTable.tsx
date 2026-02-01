import React from "react";
import type { JobListItem } from "../../../../../types/dataverse";
import type { JobColumn } from "../../../columns";

import { JobRow, type ActiveCell } from "../../../JobRow";



type Props = {
    title: string;

    jobs: JobListItem[];
    columns: JobColumn[];

    loading: boolean;
    error: string;

    onRefresh: () => void | Promise<void>;

    // editing state (lifted from parent)
    editingId: string | null;
    setEditingId: (id: string | null) => void;

    draft: Partial<JobListItem> | null;
    setDraft: React.Dispatch<React.SetStateAction<Partial<JobListItem> | null>>;

    activeCell: ActiveCell;
    setActiveCell: (c: ActiveCell) => void;

    // row actions
    onCopyToExcel: (job: JobListItem) => void | Promise<void>;
    onEmailToTech?: (job: JobListItem) => void | Promise<void>;
    onSaveDraft?: (jobId: string, draft: Partial<JobListItem>) => void | Promise<void>;
};

export function JobTable({
    title,
    jobs,
    columns,
    loading,
    error,
    onRefresh,
    editingId,
    setEditingId,
    draft,
    setDraft,
    activeCell,
    setActiveCell,
    onCopyToExcel,
    onEmailToTech,
    onSaveDraft,
}: Props) {
    return (
        <div style={{ paddingBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h2 style={{ margin: 0 }}>
                    {title} ({loading ? "…" : jobs.length})

                </h2>

                <button onClick={onRefresh} disabled={loading}>
                    {loading ? "Loading…" : "Refresh"}
                </button>
            </div>

            {error && (
                <div style={{ marginTop: 12 }}>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>
                    <button onClick={onRefresh}>Retry</button>
                </div>
            )}

            {!loading && !error && jobs.length === 0 && (
                <p style={{ marginTop: 12 }}>No jobs found.</p>
            )}

            {!error && jobs.length > 0 && (
                <div
                    style={{
                        marginTop: 12,
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        overflow: "auto",
                        maxHeight: "70vh",
                    }}
                >
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1500 }}>
                        <thead>
                            <tr>
                                {columns.map((c) => (
                                    <Th key={String(c.key)} minWidth={c.minWidth}>
                                        {c.label}
                                    </Th>
                                ))}
                                <Th minWidth={120}>Actions</Th>
                            </tr>
                        </thead>

                        <tbody>
                            {jobs.map((j, idx) => {
                                const rowBg = idx % 2 === 0 ? "#fff" : "#fafafa";

                                return (
                                    <JobRow
                                        key={j.id}
                                        job={j}
                                        rowBg={rowBg}
                                        columns={columns}
                                        editingId={editingId}
                                        setEditingId={setEditingId}
                                        draft={draft}
                                        setDraft={setDraft}
                                        activeCell={activeCell}
                                        setActiveCell={setActiveCell}
                                        onCopyToExcel={onCopyToExcel}
                                        onEmailToTech={onEmailToTech}
                                        onSaveDraft={onSaveDraft}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function Th({ children, minWidth }: { children: React.ReactNode; minWidth?: number }) {
    return (
        <th
            style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                textAlign: "left",
                padding: "10px 12px",
                background: "#f3f4f6",
                borderBottom: "1px solid #ddd",
                fontWeight: 700,
                fontSize: 13,
                whiteSpace: "nowrap",
                minWidth,
            }}
        >
            {children}
        </th>
    );
}
