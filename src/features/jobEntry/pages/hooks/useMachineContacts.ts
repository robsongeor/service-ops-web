import React from "react";
import type { JobEntryFormType } from "../JobEntryForm";
import type { MachineRow, SiteContactRow } from "../../../../types/dataverse";
import { createContact, getMachineByFleetNumber } from "../../../../lib/api";


type Args = {
    form: JobEntryFormType;
    setForm: React.Dispatch<React.SetStateAction<JobEntryFormType>>;
};

export function useMachineLookupAndContacts({ form, setForm }: Args) {
    const [machineId, setMachineId] = React.useState<string | null>(null);
    const [machineNotFound, setMachineNotFound] = React.useState(false);
    const [loadingMachine, setLoadingMachine] = React.useState(false);

    const [contacts, setContacts] = React.useState<SiteContactRow[]>([]);
    const [selectedContactId, setSelectedContactId] = React.useState<string | null>(null);

    // Call this when user clicks "Lookup fleet"
    async function lookupFleetAndHydrateForm() {
        setLoadingMachine(true);
        try {
            const data = await getMachineByFleetNumber(form.fleetNumber);

            if (!data.machine) {
                setMachineId(null);
                setMachineNotFound(true);
                setContacts([]);
                setSelectedContactId(null);
                return null;
            }

            const mid = data.machine.gr_machinesid;

            setMachineNotFound(false);
            setMachineId(mid);

            // Prefill machine/customer fields
            setForm((prev) => ({
                ...prev,
                customer: data.machine?.gr_customer ?? prev.customer,
                model: data.machine?.gr_model ?? prev.model,
                siteAddress: data.machine?.gr_siteaddress ?? prev.siteAddress,
                siteAddressSuburb: data.machine?.gr_siteaddresssuburb ?? prev.siteAddressSuburb,
                siteAddressCity: data.machine?.gr_siteaddresscity ?? prev.siteAddressCity,
                tyreFront: data.machine?.gr_fronttyres ?? prev.tyreFront,
                tyreRear: data.machine?.gr_reartyres ?? prev.tyreRear,
            }));

            // Contacts (already returned from lookup flow)
            const list = data.contacts ?? [];
            setContacts(list);

            if (list.length > 0) {
                const newest = list[0]; // flow orders by createdon desc
                setSelectedContactId(newest.gr_sitecontactsid);

                // Prefill contact fields
                setForm((prev) => ({
                    ...prev,
                    siteContact: newest.gr_contactactualname ?? newest.gr_contactname ?? "",
                    siteContactPhone: newest.gr_contactphone ?? "",
                    siteContactEmail: newest.gr_contactemail ?? "",
                }));
            } else {
                setSelectedContactId(null);
                setForm((prev) => ({
                    ...prev,
                    siteContact: "",
                    siteContactPhone: "",
                    siteContactEmail: "",
                }));
            }

            return data.machine as MachineRow;
        } finally {
            setLoadingMachine(false);
        }
    }

    // Used in submit: create a contact only if user typed one and none selected
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
                machineId: mid,
            },
        });

        // optimistic add
        setContacts((prev) => [
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

    function resetMachineAndContacts() {
        setMachineId(null);
        setMachineNotFound(false);
        setContacts([]);
        setSelectedContactId(null);
    }

    return {
        // state
        machineId,
        machineNotFound,
        loadingMachine,
        contacts,
        selectedContactId,

        // setters you still need in UI
        setSelectedContactId,
        setContacts,
        setMachineId,

        // actions
        lookupFleetAndHydrateForm,
        ensureContactId,
        resetMachineAndContacts,
    };
}
