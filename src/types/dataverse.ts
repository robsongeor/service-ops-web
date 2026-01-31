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
};

export type SiteContactRow = {
    // update these once you add columns to SiteContacts
    // example:
    // gr_sitecontactsid: string;
    // gr_contactname?: string;
    // gr_contactphone?: string;
    // gr_contactemail?: string;
    [key: string]: any;
};

export type MachineLookupResponse = {
    machine: MachineRow | null;
    contacts: SiteContactRow[];
};


