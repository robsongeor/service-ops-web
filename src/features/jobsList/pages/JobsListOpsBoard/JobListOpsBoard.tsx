import { useEffect, useState } from "react";
import type { JobListItem, RawJob } from "../../../../types/dataverse";
import { mapRawJob } from "../../mapJob";
import { formatNZDate, toDataverseDateTime } from "../../../../lib/utils/date";
import { copyRowToClipboard } from "../../../../lib/excel";
import { updateJob } from "../../../../lib/api";
import { jobColumnsBasic } from "../../columns";

import type { ActiveCell } from "../../JobRow";
import { JobTable } from "./components/JobTable";

const API_URL = import.meta.env.VITE_JOBS_API_URL;

export default function JobListOpsBoard() {
    const [jobs, setJobs] = useState<JobListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const pending = jobs.filter(j => j.status === "created");
    const allocated = jobs.filter(j => j.status === "allocated");
    const inProgress = jobs.filter(j => j.status === "in_progress");

    const [editingId, setEditingId] = useState<string | null>(null);
    const [draft, setDraft] = useState<Partial<JobListItem> | null>(null);
    const [activeCell, setActiveCell] = useState<ActiveCell>(null);

    async function onEmailToTech(job: JobListItem) {
        console.log("email to tech", job.jobNumber);
    }

    async function onCopyToExcel(job: JobListItem) {
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
        ]);
    }

    async function loadJobs() {
        setLoading(true);
        setError("");
        try {
            const url = `${API_URL}${API_URL.includes("?") ? "&" : "?"}t=${Date.now()}`;
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const rawJobs: RawJob[] = data.value ?? [];
            setJobs(rawJobs.map(mapRawJob));
        } catch (e: any) {
            setError(e.message ?? String(e));
        } finally {
            setLoading(false);
        }
    }

    async function onSaveDraft(id: string, d: Partial<JobListItem>) {
        if (!d || Object.keys(d).length === 0) return;


        try {
            setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...d } : j)));

            const payload: Record<string, any> = {};

            if (d.status !== undefined) payload.status = String(d.status);
            if (d.jobNumber !== undefined) payload.jobNumber = String(d.jobNumber);
            if (d.date !== undefined) payload.date = toDataverseDateTime(d.date);
            if (d.mechanic !== undefined) payload.technician = String(d.mechanic);
            if (d.model !== undefined) payload.model = String(d.model);
            if (d.fleetNumber !== undefined) payload.fleetNumber = String(d.fleetNumber);
            if (d.companyName !== undefined) payload.customer = String(d.companyName);
            if (d.description !== undefined) payload.description = String(d.description);
            if (d.siteAddress !== undefined) payload.siteAddress = String(d.siteAddress);
            if (d.siteSuburb !== undefined) payload.siteSuburb = String(d.siteSuburb);
            if (d.siteCity !== undefined) payload.siteCity = String(d.siteCity);
            if (d.customerPo !== undefined) payload.customerPo = String(d.customerPo);

            if (Object.keys(payload).length === 0) return;

            await updateJob({ id, ...payload });
            await loadJobs();
        } catch (err) {
            console.error(err);
            await loadJobs();
        }
    }

    useEffect(() => {
        loadJobs();
    }, []);

    return (
        <>
            <JobTable
                title="Created"
                jobs={pending}
                columns={jobColumnsBasic}
                loading={loading}
                error={error}
                onRefresh={loadJobs}
                editingId={editingId}
                setEditingId={setEditingId}
                draft={draft}
                setDraft={setDraft}
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                onCopyToExcel={onCopyToExcel}
                onEmailToTech={onEmailToTech}
                onSaveDraft={onSaveDraft}
                editable={false}
            />
            <JobTable
                title="Allocated"
                jobs={allocated}
                columns={jobColumnsBasic}
                loading={loading}
                error={error}
                onRefresh={loadJobs}
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
            <JobTable
                title="In Progress"
                jobs={inProgress}
                columns={jobColumnsBasic}
                loading={loading}
                error={error}
                onRefresh={loadJobs}
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
        </>


    );
}
