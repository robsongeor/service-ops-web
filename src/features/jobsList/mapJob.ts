import type { JobListItem, RawJob } from "../../types/dataverse";


export function mapRawJob(j: RawJob): JobListItem {
    return {
        id: j.gr_jobsid,

        jobNumber: j.gr_jobnumber ?? "",
        date:
            j["gr_date@OData.Community.Display.V1.FormattedValue"] ??
            j.gr_date ??
            "—",
        mechanic: j.gr_technician ?? "",

        model: j.gr_modelsnap ?? "",
        fleetNumber:
            j.gr_fleetnumbersnap ??
            j["_gr_machine_value@OData.Community.Display.V1.FormattedValue"] ??
            "",
        companyName: j.gr_customersnap ?? "",

        description: j.gr_description ?? "",

        siteAddress: j.gr_siteaddresssnap ?? "",
        siteSuburb: j.gr_sitesuburbsnap ?? "",
        siteCity: j.gr_sitecitysnap ?? "",

        customerPo: j.gr_customerpo ?? "",
        contactName: j.gr_contactnamesnap ?? "",
        contactPhone: j.gr_contactphonesnap ?? "",

        status: j.gr_status ?? ""
    };
}
