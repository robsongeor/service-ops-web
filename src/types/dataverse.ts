// app/types/dataverse.ts

export type MachineRow = {
    gr_machinesid: string;
    gr_fleetnumber: string;
    gr_machinename?: string;
    gr_customer?: string;
    gr_model?: string;
    gr_siteaddress?: string;
    gr_siteaddresssuburb?: string;
    gr_siteaddresscity?: string;
    gr_fronttyres?: string;
    gr_reartyres?: string;
    gr_tyrecoverinra?: boolean;
};

export type SiteContactRow = {
    gr_sitecontactsid: string;
    gr_contactactualname?: string;
    gr_contactname?: string;
    gr_contactphone?: string;
    gr_contactemail?: string;
    createdon?: string;
};



export type MachineLookupResponse = {
    machine: MachineRow | null;
    contacts: SiteContactRow[];
};

// src/types.ts
export type RawJob = Record<string, any>;

export type JobListItem = {
    id: string;

    status?: string

    jobNumber: string;
    date: string;
    mechanic: string;

    model: string;
    fleetNumber: string;
    companyName: string;

    description: string;

    siteAddress: string;
    siteSuburb: string;
    siteCity: string;

    customerPo: string;
    contactName: string;
    contactPhone: string;
};

// app/lib/api/updateJob.ts (or wherever you keep API helpers)

export type UpdateJobPayload = {
    id: string;
    jobNumber?: string;
    date?: string;        // ISO string recommended
    technician?: string;
    model?: string;
    fleetNumber?: string;
    customer?: string;
    description?: string;
    siteAddress?: string;
    siteSuburb?: string;
    siteCity?: string;
    customerPo?: string;
};

