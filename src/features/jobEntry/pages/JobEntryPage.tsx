import React from "react";
import { TextField } from "../../../components/form/TextField";
import { FormSection } from "../../../components/form/FormSection";

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

export const initialForm: JobEntryForm = {
    jobNumber: "",
    date: "",
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

    const handleChange = (
        name: keyof JobEntryForm,
        value: string
    ) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    return (
        <div>
            <header>
                {/* <p>Create a new service request / job card intake.</p> */}
            </header>

            <form>
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
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />

                    <TextField<keyof JobEntryForm>
                        label="Job Type"
                        name="jobType"
                        value={form.jobType}
                        onChange={handleChange}
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
                        label="Model"
                        name="model"
                        value={form.model}
                        onChange={handleChange}
                    />

                    <TextField<keyof JobEntryForm>
                        label="Fleet Number"
                        name="fleetNumber"
                        value={form.fleetNumber}
                        onChange={handleChange}
                    />
                </FormSection>

                <FormSection title="Customer">
                    <TextField<keyof JobEntryForm>
                        label="Customer"
                        name="customer"
                        value={form.customer}
                        onChange={handleChange}
                    />

                    <TextField<keyof JobEntryForm>
                        label="Site Address"
                        name="siteAddress"
                        value={form.siteAddress}
                        onChange={handleChange}
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
                    <TextField<keyof JobEntryForm>
                        label="Site Contact"
                        name="siteContact"
                        value={form.siteContact}
                        onChange={handleChange}
                    />

                    <TextField<keyof JobEntryForm>
                        label="Site Contact Phone"
                        name="siteContactPhone"
                        value={form.siteContactPhone}
                        onChange={handleChange}
                        type="tel"
                    />

                    <TextField<keyof JobEntryForm>
                        label="Site Contact Email"
                        name="siteContactEmail"
                        value={form.siteContactEmail}
                        onChange={handleChange}
                        type="email"
                    />
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
            </form>
        </div>
    );


}



