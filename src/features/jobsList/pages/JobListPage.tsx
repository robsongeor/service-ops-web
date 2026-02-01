import { useEffect, useMemo, useState } from "react";
import type { JobListItem, RawJob } from "../../../types/dataverse";
import { mapRawJob } from "../mapJob";
import { formatNZDate } from "../../../lib/utils/date";

import { copyRowToClipboard } from "../../../lib/excel";

import { JobRow } from "../JobRow";

const API_URL = import.meta.env.VITE_JOBS_API_URL;

export default function JobListPage() {
    const [raw, setRaw] = useState<RawJob[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const [editingId, setEditingId] = useState<string | null>(null);

    const [draft, setDraft] = useState<Partial<JobListItem> | null>(null);

    type ActiveCell = { rowId: string; key: keyof JobListItem } | null;
    const [activeCell, setActiveCell] = useState<ActiveCell>(null);



    const jobs: JobListItem[] = useMemo(() => raw.map(mapRawJob), [raw]);

    async function copyToExcel(job: JobListItem) {
        await copyRowToClipboard([
            formatNZDate(job.date),
            job.mechanic,
            job.model,
            job.fleetNumber,
            job.companyName,
            job.description,
            job.siteAddress,
            job.siteSuburb,
            job.siteCity,
            job.customerPo,
            job.contactName,
            job.contactPhone,
        ]);
    }


    async function loadJobs() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setRaw(data.value ?? []); // Dataverse uses "value"
        } catch (e: any) {
            setError(e.message ?? String(e));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadJobs();
    }, []);

    return (
        <div >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h2 style={{ margin: 0 }}>Jobs ({jobs.length})</h2>
                <button onClick={loadJobs} disabled={loading}>
                    {loading ? "Loading…" : "Refresh"}
                </button>
            </div>

            {error && (
                <div style={{ marginTop: 12 }}>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>
                    <button onClick={loadJobs}>Retry</button>
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
                                <Th>Job</Th>
                                <Th>Date</Th>
                                <Th>Technician</Th>
                                <Th>Model</Th>
                                <Th>Fleet</Th>
                                <Th>Customer</Th>
                                <Th>Description of the Job</Th>
                                <Th>Address</Th>
                                <Th>Suburb</Th>
                                <Th>City</Th>
                                <Th>Customer PO</Th>
                                <Th>Contact Name</Th>
                                <Th>Phone</Th>
                                <Th>Actions</Th>

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
                                        editingId={editingId}
                                        setEditingId={setEditingId}
                                        draft={draft}
                                        setDraft={setDraft}
                                        activeCell={activeCell}
                                        setActiveCell={setActiveCell}
                                        onCopyToExcel={copyToExcel}
                                        onSaveDraft={(id, d) => {
                                            console.log("SAVE:", id, d);
                                        }}
                                    />
                                );
                            })}
                        </tbody>
                    </table>

                </div>
            )
            }
        </div >
    );
}

/** Table header cell (sticky) */
function Th({ children }: { children: React.ReactNode }) {
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
            }}
        >
            {children}
        </th>
    );
}







function truncate(text: string, max: number) {
    if (!text) return "";
    return text.length > max ? text.slice(0, max - 1) + "…" : text;
}
