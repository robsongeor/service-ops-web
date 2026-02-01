// columns.ts
import type { JobListItem } from "../../types/dataverse";
import { formatNZDate } from "../../lib/utils/date";

export type JobColumn = {
    key: keyof JobListItem;
    label: string;

    mono?: boolean;
    minWidth?: number;

    getValue?: (row: JobListItem) => string;
    parse?: (input: string, currentRow: JobListItem) => any;

    // ✅ new
    kind?: "text" | "select";
    options?: { label: string; value: string }[];

    alwaysEditable?: boolean;
};

export const jobColumnsBasic: JobColumn[] = [
    {
        key: "status",
        label: "Status",
        minWidth: 120,
        kind: "select",
        alwaysEditable: true,
        options: [
            { label: "Created", value: "created" },
            { label: "Allocated", value: "allocated" },
            { label: "In Progress", value: "in_progress" },
            { label: "Done", value: "done" },
        ],
    },

    { key: "jobNumber", label: "Job", mono: true, minWidth: 90 },
    { key: "date", label: "Date", minWidth: 110, getValue: (r) => formatNZDate(r.date) },
    { key: "mechanic", label: "Technician", minWidth: 100 },
    { key: "model", label: "Model", minWidth: 140 },
    { key: "fleetNumber", label: "Fleet", mono: true, minWidth: 110 },
    { key: "companyName", label: "Customer", minWidth: 180 },
    { key: "description", label: "Description of the Job", minWidth: 280 },
    {
        key: "siteAddress",
        label: "Address",
        minWidth: 320,
        getValue: (r) => [r.siteAddress, r.siteSuburb, r.siteCity].filter(Boolean).join(", "),
    },
];



export const jobColumnsFull: JobColumn[] = [
    { key: "jobNumber", label: "Job", mono: true, minWidth: 90 },
    { key: "date", label: "Date", minWidth: 110, getValue: (r) => formatNZDate(r.date) },
    { key: "mechanic", label: "Technician", minWidth: 140 },
    { key: "model", label: "Model", minWidth: 140 },
    { key: "fleetNumber", label: "Fleet", mono: true, minWidth: 110 },
    { key: "companyName", label: "Customer", minWidth: 180 },
    { key: "description", label: "Description of the Job", minWidth: 280 },
    { key: "siteAddress", label: "Address", minWidth: 220 },
    { key: "siteSuburb", label: "Suburb", minWidth: 140 },
    { key: "siteCity", label: "City", minWidth: 140 },
    { key: "customerPo", label: "Customer PO", mono: true, minWidth: 140 },
    { key: "contactName", label: "Contact Name", minWidth: 160 },
    { key: "contactPhone", label: "Phone", mono: true, minWidth: 140 },
];