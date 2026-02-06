import React from "react";
import { TextField } from "../../../components/form/TextField";
import { FormSection } from "../../../components/form/FormSection";
import { Button } from "../../../components/ui/Button/Button";
import { createMachine, createJob } from "../../../lib/api";
import { copyRowToClipboard } from "../../../lib/excel";
import { useMachineLookupAndContacts } from "./hooks/useMachineContacts";
import { todayISO, toISODateOnly } from "../../../lib/utils/date";
import styles from "./JobEntryForm.module.css";



export type JobEntryFormType = {
    jobNumber: string;
    date: string;
    technician: string;
    description: string;
    model: string;
    fleetNumber: string;
    customer: string;
    siteAddress: string;
    siteAddressSuburb: string;
    siteAddressCity: string;
    siteContact: string;
    siteContactPhone: string;
    siteContactEmail: string;
    customerPO: string;
    jobType: string;

    tyreFront: string;
    tyreRear: string;
    tyresCoveredInRentalAgreement?: boolean;

    scheduledDate?: string;
    scheduledDateEnd?: string;
};

export const initialForm: JobEntryFormType = {
    jobNumber: "",
    date: todayISO(),
    technician: "",
    description: "",
    model: "",
    fleetNumber: "",
    customer: "",
    siteAddress: "",
    siteAddressSuburb: "",
    siteAddressCity: "",
    siteContact: "",
    siteContactPhone: "",
    siteContactEmail: "",
    customerPO: "",
    jobType: "",
    tyreFront: "",
    tyreRear: "",

};

export function JobEntryForm() {
    const [form, setForm] = React.useState<JobEntryFormType>(initialForm);
    const [submitting, setSubmitting] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | null>(null);
    const JOB_TYPES = ["", "Breakdown", "Maintenance", "Tyres", "Transport", "Prep", "Workshop"] as const;

    const [scheduled, setScheduled] = React.useState<boolean>(true);

    const [pasteText, setPasteText] = React.useState("");
    // ✅ all machine + contacts logic now lives in the hook
    const {
        machineId,
        machineNotFound,
        loadingMachine,
        contacts,
        selectedContactId,
        setSelectedContactId,
        lookupFleetAndHydrateForm,
        ensureContactId,
        resetMachineAndContacts,
    } = useMachineLookupAndContacts({ form, setForm });

    const handleChange = (name: keyof JobEntryFormType, value: string) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    async function copyToExcel() {
        await copyRowToClipboard([
            form.date,
            form.technician,
            form.model,
            form.fleetNumber,
            form.customer,
            form.description,
            form.siteAddress,
            form.siteAddressSuburb,
            form.siteAddressCity,
            form.customerPO,
        ]);
    }

    async function handleFleetLookup() {
        await lookupFleetAndHydrateForm();
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        setSubmitting(true);

        try {
            if (!form.fleetNumber.trim()) throw new Error("Fleet Number is required.");
            if (!form.date) throw new Error("Date is required.");
            if (!form.description.trim()) throw new Error("Description is required.");
            if (!form.jobType.trim()) throw new Error("Job Type is required.");

            // 1) create/update machine
            const machineRes = await createMachine({
                machine: {
                    fleetNumber: form.fleetNumber,
                    model: form.model,
                    customer: form.customer,
                    siteAddress: form.siteAddress,
                    siteAddressSuburb: form.siteAddressSuburb,
                    siteAddressCity: form.siteAddressCity,
                    tyrecoverinra: form.tyresCoveredInRentalAgreement,
                    tyreFront: form.tyreFront,
                    tyreRear: form.tyreRear
                },
            });

            const ensuredMachineId = machineRes.machineId;
            console.log("ensuredMachineId:", ensuredMachineId);


            // 2) ensure contact if needed
            const contactId = await ensureContactId(ensuredMachineId);

            // 3) create job
            const payload = {
                job: {
                    jobNumber: form.jobNumber || undefined,
                    date: form.date,
                    technician: form.technician || undefined,
                    description: form.description,
                    jobType: form.jobType,
                    customerPO: form.customerPO || undefined,

                    machineId: ensuredMachineId,
                    contactId,

                    fleetNumber: form.fleetNumber,
                    model: form.model || undefined,
                    customer: form.customer || undefined,
                    siteAddress: form.siteAddress || undefined,
                    siteAddressSuburb: form.siteAddressSuburb || undefined,
                    siteAddressCity: form.siteAddressCity || undefined,

                    contactName: form.siteContact || undefined,
                    contactPhone: form.siteContactPhone || undefined,
                    contactEmail: form.siteContactEmail || undefined,

                    ...(form.tyresCoveredInRentalAgreement !== undefined && {
                        tyrecoverinra: form.tyresCoveredInRentalAgreement,
                    }),

                    tyreFront: form.tyreFront || undefined,
                    tyreRear: form.tyreRear || undefined,

                    scheduledDate: form.scheduledDate || undefined,
                    scheduledDateEnd: form.scheduledDateEnd || undefined,
                },
            };

            const jobRes = await createJob(payload);
            console.log("Created job:", jobRes.jobId);

            // reset
            setForm(initialForm);
            resetMachineAndContacts();
        } catch (err: any) {
            console.error(err);
            setSubmitError(err?.message ?? "Failed to create job.");
        } finally {
            setSubmitting(false);
        }
    };

    function parseExcelRow(tsv: string): Partial<JobEntryFormType> | null {
        const text = (tsv ?? "").replace(/\r\n/g, "\n").trim();
        if (!text) return null;

        // If they paste header + row, take the LAST non-empty line as the data row.
        const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) return null;

        const row = lines[lines.length - 1];

        // Excel row is typically tab-separated
        const cols = row.split("\t").map(c => (c ?? "").trim());

        const [
            jobNumber,
            date,
            mechanic,
            model,
            fleetNumber,
            companyName,
            description,
            siteAddress,
            siteSuburb,
            siteCity,
            customerPO,
        ] = cols;

        const patch: Partial<JobEntryFormType> = {
            jobNumber: jobNumber || undefined,
            date: date ? toISODateOnly(date) : undefined,
            technician: mechanic || undefined,
            model: model || undefined,
            fleetNumber: fleetNumber || undefined,
            customer: companyName || undefined,
            description: description || undefined,
            siteAddress: siteAddress || undefined,
            siteAddressSuburb: siteSuburb || undefined,
            siteAddressCity: siteCity || undefined,
            customerPO: customerPO || undefined,
        };

        // Remove undefined so we don’t overwrite existing fields accidentally
        Object.keys(patch).forEach((k) => {
            const key = k as keyof JobEntryFormType;
            if (patch[key] === undefined) delete patch[key];
        });

        return patch;
    }

    function handlePasteFromExcel(e: React.ClipboardEvent<HTMLTextAreaElement>) {
        const pasted = e.clipboardData.getData("text/plain");
        if (!pasted) return;

        // We prevent default so we fully control the textarea value
        e.preventDefault();

        // ✅ show the pasted content in the textarea
        setPasteText(pasted);

        const patch = parseExcelRow(pasted);
        if (!patch) return;

        setForm((prev) => ({ ...prev, ...patch }));

        // ✅ optional: clear it shortly after so it's ready for next paste
        setTimeout(() => setPasteText(""), 1200);

        // Optional: if fleet number was included, you could auto-lookup:
        if (patch.fleetNumber) lookupFleetAndHydrateForm();
    }

    return (
        <div className={styles.page}>
            <div className={styles.pasteBox}>

                <label className={styles.pasteLabel}>Paste from Excel</label>
                <textarea
                    value={pasteText}
                    placeholder="Copy a row from Excel and paste here…"
                    onChange={(e) => setPasteText(e.target.value)}
                    onPaste={handlePasteFromExcel}
                    className={styles.pasteTextarea}
                />

                <small className={styles.pasteHelp}>
                    Paste a single row (or header + row). It will auto-fill the form.
                </small>

            </div>

            <form onSubmit={handleSubmit}>
                {submitError && <p className={styles.error}>{submitError}</p>}

                <FormSection title="Job Details">
                    <div className={styles.jobAtGlance}>
                        <TextField
                            label="Job Number"
                            name="jobNumber"
                            value={form.jobNumber}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Technician"
                            name="technician"
                            value={form.technician}
                            onChange={handleChange}
                        />

                        <TextField
                            kind="select"
                            label="Job Type"
                            name="jobType"
                            value={form.jobType}
                            onChange={handleChange}
                            required
                            options={[
                                { value: "", label: "— Select job type —", disabled: true },
                                ...JOB_TYPES.filter((t) => t !== "").map((t) => ({ value: t, label: t })),
                            ]}
                        />

                        <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth />

                        <TextField label="Customer PO" name="customerPO" value={form.customerPO} onChange={handleChange} />
                        <TextField label="Date" name="date" value={form.date} onChange={handleChange} type="date" />
                    </div>
                </FormSection>

                <div className={styles.twoCol}>
                    <FormSection title="Machine">
                        <div className={styles.twoCol}>
                            <TextField label="Fleet Number" name="fleetNumber" value={form.fleetNumber} onChange={handleChange} fullWidth />
                            <TextField label="Model" name="model" value={form.model} onChange={handleChange} fullWidth />

                            <Button type="button" variant="secondary" onClick={handleFleetLookup}>
                                {loadingMachine ? "Looking up..." : "Lookup fleet"}
                            </Button>

                            {machineNotFound && <p className={styles.machineNotFound}>Machine not found — you can create it.</p>}
                        </div>

                    </FormSection>

                    <FormSection title="Customer">
                        <div className={styles.twoCol}>


                            <TextField label="Customer" name="customer" value={form.customer} onChange={handleChange} fullWidth />
                            <TextField label="Address" name="siteAddress" value={form.siteAddress} onChange={handleChange} fullWidth />
                            <TextField label="Suburb" name="siteAddressSuburb" value={form.siteAddressSuburb} onChange={handleChange} />
                            <TextField label="City" name="siteAddressCity" value={form.siteAddressCity} onChange={handleChange} />
                        </div>
                    </FormSection>
                </div>

                {/* Site Contact UI still here for now — step 3 will extract this into a component */}
                <FormSection title="Site contact">
                    <div className={styles.twoCol}>
                        {machineId && (
                            <div className={styles.contactRow}>
                                <div className={styles.contactCol}>
                                    <label className={styles.contactLabel}>Existing contacts</label>
                                    <select
                                        value={selectedContactId ?? ""}
                                        onChange={(e) => {
                                            const id = e.target.value || null;
                                            setSelectedContactId(id);

                                            if (!id) {
                                                setForm((prev) => ({
                                                    ...prev,
                                                    siteContact: "",
                                                    siteContactPhone: "",
                                                    siteContactEmail: "",
                                                }));
                                                return;
                                            }

                                            const c = contacts.find((x) => x.gr_sitecontactsid === id);
                                            if (c) {
                                                setForm((prev) => ({
                                                    ...prev,
                                                    siteContact: c.gr_contactactualname ?? c.gr_contactname ?? "",
                                                    siteContactPhone: c.gr_contactphone ?? "",
                                                    siteContactEmail: c.gr_contactemail ?? "",
                                                }));
                                            }
                                        }}
                                        className={styles.select}
                                    >
                                        <option value="">— New contact / Manual entry —</option>
                                        {contacts.map((c) => (
                                            <option key={c.gr_sitecontactsid} value={c.gr_sitecontactsid}>
                                                {(c.gr_contactactualname ?? c.gr_contactname ?? "Unnamed")}
                                                {c.gr_contactphone ? ` (${c.gr_contactphone})` : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}


                        <TextField
                            label="Name"
                            name="siteContact"
                            value={form.siteContact}
                            onChange={(name, value) => {
                                setSelectedContactId(null);
                                handleChange(name, value);
                            }}
                        />

                        <TextField
                            label="Phone"
                            name="siteContactPhone"
                            value={form.siteContactPhone}
                            onChange={(name, value) => {
                                setSelectedContactId(null);
                                handleChange(name, value);
                            }}
                            type="tel"
                        />

                        <TextField
                            label="Email"
                            name="siteContactEmail"
                            value={form.siteContactEmail}
                            onChange={(name, value) => {
                                setSelectedContactId(null);
                                handleChange(name, value);
                            }}
                            type="email"
                            fullWidth
                        />
                    </div>
                </FormSection>

                {/* conditionals unchanged */}
                {form.jobType === "Tyres" && (
                    <FormSection title="Tyres">
                        <TextField label="Front Tyre" name="tyreFront" value={form.tyreFront ?? ""} onChange={handleChange} />
                        <TextField label="Rear Tyre" name="tyreRear" value={form.tyreRear ?? ""} onChange={handleChange} />
                    </FormSection>
                )}

                {scheduled && (
                    <FormSection title="Scheduling">
                        <TextField label="Scheduled Start Date" name="scheduledDate" value={form.scheduledDate ?? ""} onChange={handleChange} type="date" />
                        <TextField label="Scheduled End Date" name="scheduledDateEnd" value={form.scheduledDateEnd ?? ""} onChange={handleChange} type="date" />
                    </FormSection>
                )}

                <div className={styles.actions}>
                    <Button type="button" onClick={copyToExcel} variant="secondary">
                        Copy to Excel
                    </Button>

                    <Button type="submit" variant="primary">
                        {submitting ? "Creating..." : "Create Job"}
                    </Button>
                </div>

            </form>
        </div>
    );
}
