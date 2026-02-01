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


