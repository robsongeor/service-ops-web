import React from "react";
import { TextField } from "../../../components/form/TextField";
import { FormSection } from "../../../components/form/FormSection";
import { Button } from "../../../components/ui/Button/Button";
import { createMachine, createJob } from "../../../lib/api";
import { copyRowToClipboard } from "../../../lib/excel";
import { useMachineLookupAndContacts } from "../../../hooks/useMachineContacts";


export type JobEntryForm = {
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

function todayISO() {
    return new Date().toISOString().split("T")[0];
}

export const initialForm: JobEntryForm = {
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

export function JobEntryPage() {
    const [form, setForm] = React.useState<JobEntryForm>(initialForm);

    const [submitting, setSubmitting] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | null>(null);

    const JOB_TYPES = ["", "Breakdown", "Service", "Maintenance", "Tyres"] as const;


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

    const handleChange = (name: keyof JobEntryForm, value: string) => {
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

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {submitError && <p style={{ color: "red" }}>{submitError}</p>}

                <FormSection title="Job details">
                    <TextField label="Job Number" name="jobNumber" value={form.jobNumber} onChange={handleChange} />
                    <TextField label="Date" name="date" value={form.date} onChange={handleChange} type="date" />
                    <TextField label="Technician" name="technician" value={form.technician} onChange={handleChange} />

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label>Job Type</label>
                        <select
                            value={form.jobType}
                            onChange={(e) => handleChange("jobType", e.target.value)}
                            style={{ width: "100%", padding: 8 }}
                            required
                        >
                            <option value="">— Select job type —</option>
                            {JOB_TYPES.filter(t => t !== "").map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>

                    <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth />
                    <TextField label="Customer PO" name="customerPO" value={form.customerPO} onChange={handleChange} />
                </FormSection>

                <FormSection title="Machine">
                    <TextField label="Fleet Number" name="fleetNumber" value={form.fleetNumber} onChange={handleChange} />
                    <TextField label="Model" name="model" value={form.model} onChange={handleChange} />

                    <Button type="button" variant="secondary" onClick={handleFleetLookup}>
                        {loadingMachine ? "Looking up..." : "Lookup fleet"}
                    </Button>

                    {machineNotFound && <p style={{ marginTop: 8 }}>Machine not found — you can create it.</p>}
                </FormSection>

                <FormSection title="Customer">
                    <TextField label="Customer" name="customer" value={form.customer} onChange={handleChange} />
                    <TextField label="Address" name="siteAddress" value={form.siteAddress} onChange={handleChange} fullWidth />
                    <TextField label="Suburb" name="siteAddressSuburb" value={form.siteAddressSuburb} onChange={handleChange} />
                    <TextField label="City" name="siteAddressCity" value={form.siteAddressCity} onChange={handleChange} />
                </FormSection>

                {/* Site Contact UI still here for now — step 3 will extract this into a component */}
                <FormSection title="Site contact">
                    {machineId && (
                        <div style={{ display: "flex", gap: 8, alignItems: "end" }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", marginBottom: 6 }}>Existing contacts</label>
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
                                    style={{ width: "100%", padding: 8 }}
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
                </FormSection>

                {/* conditionals unchanged */}
                {form.jobType === "Tyres" && (
                    <FormSection title="Tyres">
                        <TextField label="Front Tyre" name="tyreFront" value={form.tyreFront ?? ""} onChange={handleChange} />
                        <TextField label="Rear Tyre" name="tyreRear" value={form.tyreRear ?? ""} onChange={handleChange} />
                    </FormSection>
                )}

                {form.jobType === "Scheduled" && (
                    <FormSection title="Scheduling">
                        <TextField label="Scheduled Start Date" name="scheduledDate" value={form.scheduledDate ?? ""} onChange={handleChange} type="date" />
                        <TextField label="Scheduled End Date" name="scheduledDateEnd" value={form.scheduledDateEnd ?? ""} onChange={handleChange} type="date" />
                    </FormSection>
                )}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "1.25rem",
                        gap: "0.5rem",
                    }}
                >
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
