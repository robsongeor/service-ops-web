import React from "react";
import { TextField } from "../../../components/form/TextField";
import { FormSection } from "../../../components/form/FormSection";
import { Button } from "../../../components/ui/Button/Button";
import { createContact, createMachine, getMachineByFleetNumber } from "../../../lib/api";
import { createJob } from "../../../lib/api";
import type { SiteContactRow } from "../../../types/dataverse";

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

    //tyre conditional
    tyreFront?: string;
    tyreRear?: string;
    tyresCoveredInRentalAgreement?: boolean;

    //conditional
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

    // Conditional fields are intentionally NOT set here
    // tyreFront
    // tyreRear
    // tyresCoveredInRentalAgreement
    // scheduledDate
    // scheduledDateEnd
};


export function JobEntryPage() {
    const [form, setForm] = React.useState<JobEntryForm>(initialForm);

    const [machineId, setMachineId] = React.useState<string | null>(null);
    const [machineNotFound, setMachineNotFound] = React.useState(false);
    const [loadingMachine, setLoadingMachine] = React.useState(false);

    const [submitting, setSubmitting] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | null>(null);

    const [contacts, setContacts] = React.useState<SiteContactRow[]>([]);
    const [loadingContacts, setLoadingContacts] = React.useState(false);
    const [selectedContactId, setSelectedContactId] = React.useState<string | null>(null);

    function escapeForTSV(value: unknown) {
        // Keep it simple: replace tabs/newlines so paste doesn't break columns/rows
        return String(value ?? "")
            .replace(/\t/g, " ")
            .replace(/\r?\n/g, " ");
    }

    async function copyToExcel() {
        // Choose the column order you want in Excel:


        const columns = [

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






        ].map(escapeForTSV);

        const tsvRow = columns.join("\t");

        try {
            await navigator.clipboard.writeText(tsvRow);
            // optional: toast / alert
            console.log("Copied row to clipboard for Excel");
        } catch {
            // Fallback for some browsers/security contexts
            const ta = document.createElement("textarea");
            ta.value = tsvRow;
            ta.style.position = "fixed";
            ta.style.left = "-9999px";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            console.log("Copied row (fallback) to clipboard for Excel");
        }
    }




    async function ensureContactId(mid: string): Promise<string | null> {
        if (selectedContactId) return selectedContactId;

        const name = form.siteContact.trim();
        const phone = form.siteContactPhone.trim();
        const email = form.siteContactEmail.trim();

        const hasAny = !!name || !!phone || !!email;
        if (!hasAny) return null;

        const created = await createContact({
            contact: {
                name: name || undefined,
                phone: phone || undefined,
                email: email || undefined,
                machineId: mid, // lookup link
            },
        });

        setContacts(prev => [
            {
                gr_sitecontactsid: created.contactId,
                gr_contactactualname: name || undefined,
                gr_contactname: name || undefined,
                gr_contactphone: phone || undefined,
                gr_contactemail: email || undefined,
                createdon: new Date().toISOString(),
            },
            ...prev,
        ]);

        setSelectedContactId(created.contactId);

        return created.contactId;
    }


    async function handleFleetLookup() {
        setLoadingMachine(true);
        try {
            const data = await getMachineByFleetNumber(form.fleetNumber);

            if (!data.machine) {
                setMachineId(null);
                setMachineNotFound(true);
                return;
            }

            setMachineNotFound(false);
            setMachineId(data.machine.gr_machinesid);


            setContacts(data.contacts ?? []);

            const list = data.contacts ?? [];
            if (list.length > 0) {
                const newest = list[0];
                setSelectedContactId(newest.gr_sitecontactsid);

                setForm(prev => ({
                    ...prev,
                    siteContact: newest.gr_contactactualname ?? newest.gr_contactname ?? "",
                    siteContactPhone: newest.gr_contactphone ?? "",
                    siteContactEmail: newest.gr_contactemail ?? "",
                }));
            } else {
                setSelectedContactId(null);
                setForm(prev => ({
                    ...prev,
                    siteContact: "",
                    siteContactPhone: "",
                    siteContactEmail: "",
                }));
            }





            setForm((prev) => ({
                ...prev,
                customer: data.machine?.gr_customer ?? prev.customer,
                model: data.machine?.gr_model ?? prev.model,
                siteAddress: data.machine?.gr_siteaddress ?? prev.siteAddress,
                siteAddressSuburb: data.machine?.gr_siteaddresssuburb ?? prev.siteAddressSuburb,
                siteAddressCity: data.machine?.gr_siteaddresscity ?? prev.siteAddressCity,
            }));
        } finally {
            setLoadingMachine(false);
        }
    }

    const handleChange = (
        name: keyof JobEntryForm,
        value: string
    ) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        setSubmitting(true);


        try {
            // basic validation (adjust as you like)
            if (!form.fleetNumber.trim()) throw new Error("Fleet Number is required.");
            if (!form.date) throw new Error("Date is required.");
            if (!form.description.trim()) throw new Error("Description is required.");
            if (!form.jobType.trim()) throw new Error("Job Type is required.");

            let ensuredMachineId = machineId;

            const machineRes = await createMachine({
                machine: {
                    fleetNumber: form.fleetNumber,
                    model: form.model,
                    customer: form.customer,
                    siteAddress: form.siteAddress,
                    siteAddressSuburb: form.siteAddressSuburb,
                    siteAddressCity: form.siteAddressCity,
                },
            });

            ensuredMachineId = machineRes.machineId;

            // keep local state in sync
            setMachineId(ensuredMachineId);
            setMachineNotFound(false);

            const contactId = await ensureContactId(ensuredMachineId);

            const payload = {
                job: {
                    jobNumber: form.jobNumber || undefined,
                    date: form.date,
                    technician: form.technician || undefined,
                    description: form.description,
                    jobType: form.jobType,
                    customerPO: form.customerPO || undefined,

                    // ✅ USE ensuredMachineId (not machineId state)
                    machineId: ensuredMachineId,
                    contactId, // later

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

            // reset after success
            setForm(initialForm);
            setMachineId(null);
            setMachineNotFound(false);
        } catch (err: any) {
            console.log("failed")
            setSubmitError(err?.message ?? "Failed to create job.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <header>
                {/* <p>Create a new service request / job card intake.</p> */}
            </header>

            <form onSubmit={handleSubmit}>
                <FormSection title="Job details">
                    <TextField<keyof JobEntryForm>
                        label="Job Number"
                        name="jobNumber"
                        value={form.jobNumber}
                        onChange={handleChange}
                    />

                    <TextField<keyof JobEntryForm>
                        label="Date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        type="date"
                    />

                    <TextField<keyof JobEntryForm>
                        label="Technician"
                        name="technician"
                        value={form.technician}
                        onChange={handleChange}
                    />

                    <TextField<keyof JobEntryForm>
                        label="Job Type"
                        name="jobType"
                        value={form.jobType}
                        onChange={handleChange}
                    />

                    <TextField<keyof JobEntryForm>
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        fullWidth
                    />



                    <TextField<keyof JobEntryForm>
                        label="Customer PO"
                        name="customerPO"
                        value={form.customerPO}
                        onChange={handleChange}
                    />
                </FormSection>

                <FormSection title="Machine">
                    <TextField<keyof JobEntryForm>
                        label="Fleet Number"
                        name="fleetNumber"
                        value={form.fleetNumber}
                        onChange={handleChange}
                    />

                    <TextField<keyof JobEntryForm>
                        label="Model"
                        name="model"
                        value={form.model}
                        onChange={handleChange}
                    />

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleFleetLookup}
                    >
                        {loadingMachine ? "Looking up..." : "Lookup fleet"}
                    </Button>

                    {machineNotFound && (
                        <p style={{ marginTop: 8 }}>Machine not found — you can create it.</p>
                    )}



                </FormSection>

                <FormSection title="Customer">
                    <TextField<keyof JobEntryForm>
                        label="Customer"
                        name="customer"
                        value={form.customer}
                        onChange={handleChange}
                    />

                    <TextField<keyof JobEntryForm>
                        label="Address"
                        name="siteAddress"
                        value={form.siteAddress}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField<keyof JobEntryForm>
                        label="Suburb"
                        name="siteAddressSuburb"
                        value={form.siteAddressSuburb}
                        onChange={handleChange}
                    />

                    <TextField<keyof JobEntryForm>
                        label="City"
                        name="siteAddressCity"
                        value={form.siteAddressCity}
                        onChange={handleChange}
                    />


                </FormSection>

                <FormSection title="Site contact">
                    {loadingContacts ? (
                        <p>Loading contacts...</p>
                    ) : (
                        <>
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
                                                    // ✅ manual/new contact
                                                    setForm(prev => ({
                                                        ...prev,
                                                        siteContact: "",
                                                        siteContactPhone: "",
                                                        siteContactEmail: "",
                                                    }));
                                                    return;
                                                }

                                                const c = contacts.find(x => x.gr_sitecontactsid === id);

                                                console.log(c)
                                                if (c) {
                                                    setForm(prev => ({
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
                                            {contacts.map(c => (
                                                <option key={c.gr_sitecontactsid} value={c.gr_sitecontactsid}>
                                                    {(c.gr_contactactualname ?? c.gr_contactname ?? "Unnamed")}
                                                    {c.gr_contactphone ? ` (${c.gr_contactphone})` : ""}
                                                </option>
                                            ))}

                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Manual entry fields (always available) */}
                            <TextField<keyof JobEntryForm>
                                label="Name"
                                name="siteContact"
                                value={form.siteContact}
                                onChange={(name, value) => {
                                    // if they type, treat as “new/manual”
                                    setSelectedContactId(null);
                                    handleChange(name, value);
                                }}
                            />

                            <TextField<keyof JobEntryForm>
                                label="Phone"
                                name="siteContactPhone"
                                value={form.siteContactPhone}
                                onChange={(name, value) => {
                                    setSelectedContactId(null);
                                    handleChange(name, value);
                                }}
                                type="tel"
                            />

                            <TextField<keyof JobEntryForm>
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
                        </>
                    )}
                </FormSection>



                {/* ---- Conditional sections ---- */}

                {form.jobType === "Tyres" && (
                    <FormSection title="Tyres">
                        <TextField<keyof JobEntryForm>
                            label="Front Tyre"
                            name="tyreFront"
                            value={form.tyreFront ?? ""}
                            onChange={handleChange}
                        />

                        <TextField<keyof JobEntryForm>
                            label="Rear Tyre"
                            name="tyreRear"
                            value={form.tyreRear ?? ""}
                            onChange={handleChange}
                        />
                    </FormSection>
                )}

                {form.jobType === "Scheduled" && (
                    <FormSection title="Scheduling">
                        <TextField<keyof JobEntryForm>
                            label="Scheduled Start Date"
                            name="scheduledDate"
                            value={form.scheduledDate ?? ""}
                            onChange={handleChange}
                            type="date"
                        />

                        <TextField<keyof JobEntryForm>
                            label="Scheduled End Date"
                            name="scheduledDateEnd"
                            value={form.scheduledDateEnd ?? ""}
                            onChange={handleChange}
                            type="date"
                        />
                    </FormSection>


                )}

                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "1.25rem",
                    gap: "0.5rem",
                }}>
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



