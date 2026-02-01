import type { SiteContactRow } from "./dataverse";

export type CreateMachinePayload = {
    machine: {
        fleetNumber: string;
        model?: string;
        customer?: string;
        siteAddress?: string;
        siteAddressSuburb?: string;
        siteAddressCity?: string;
    }

};


export type CreateJobPayload = {
    job: {
        jobNumber?: string;
        date: string;
        technician?: string;
        description: string;
        jobType: string;
        customerPO?: string;

        machineId: string;
        contactId?: string | null;

        fleetNumber: string;
        model?: string;
        customer?: string;
        siteAddress?: string;
        siteAddressSuburb?: string;
        siteAddressCity?: string;

        contactName?: string;
        contactPhone?: string;
        contactEmail?: string;

        tyrecoverinra?: boolean;
        tyreFront?: string;
        tyreRear?: string;

        scheduledDate?: string;
        scheduledDateEnd?: string;
    };
};

export type CreateJobResponse = {
    jobId: string;
};

export type CreateMachineResponse = {
    machineId: string;
    created?: boolean;
    updated?: boolean;
};


export type CreateContactPayload = {
    contact: {
        name?: string;
        phone?: string;
        email?: string;
        machineId: string; // required for option B
    };
};

export type CreateContactResponse = {
    contactId: string;
};

export type ContactsByMachineResponse = {
    contacts: SiteContactRow[];
};
