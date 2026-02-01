// app/lib/api.ts
import type { MachineLookupResponse } from "../types/dataverse";

import type { CreateContactPayload, CreateContactResponse, CreateJobPayload, CreateJobResponse, CreateMachinePayload, CreateMachineResponse } from "../types/submit";

const FLOW_CREATE_JOB_URL = import.meta.env.VITE_FLOW_CREATE_JOB_URL as string;
const FLOW_CREATE_MACHINE_URL = import.meta.env.VITE_FLOW_CREATE_MACHINE_URL as string;
const FLOW_CREATE_CONTACT_URL = import.meta.env.VITE_FLOW_CREATE_CONTACT_URL as string;
const FLOW_LOOKUP_URL = import.meta.env.VITE_FLOW_LOOKUP_MACHINE_URL as string;

function assertEnv(name: string, value: string | undefined): asserts value is string {
    if (!value) throw new Error(`Missing env var: ${name}`);
}

export async function getMachineByFleetNumber(fleetNumber: string): Promise<MachineLookupResponse> {
    assertEnv("VITE_FLOW_LOOKUP_MACHINE_URL", FLOW_LOOKUP_URL);

    const fn = fleetNumber.trim().toUpperCase();
    if (!fn) {
        return { machine: null, contacts: [] };
    }

    const res = await fetch(FLOW_LOOKUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fleetNumber: fn }),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Lookup failed (${res.status}): ${text}`);
    }

    return (await res.json()) as MachineLookupResponse;
}

export async function createJob(payload: CreateJobPayload): Promise<CreateJobResponse> {
    assertEnv("VITE_FLOW_CREATE_JOB_URL", FLOW_CREATE_JOB_URL);

    console.log(JSON.stringify(payload))

    const res = await fetch(FLOW_CREATE_JOB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`CreateJob failed (${res.status}): ${text}`);
    }

    return (await res.json()) as CreateJobResponse;
}

export async function createMachine(payload: CreateMachinePayload): Promise<CreateMachineResponse> {
    assertEnv("VITE_FLOW_CREATE_MACHINE_URL", FLOW_CREATE_MACHINE_URL);

    console.log(JSON.stringify(payload))

    const res = await fetch(FLOW_CREATE_MACHINE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`CreateMachine failed (${res.status}): ${text}`);
    }

    return (await res.json()) as CreateMachineResponse;
}

export async function createContact(
    payload: CreateContactPayload
): Promise<CreateContactResponse> {
    assertEnv("VITE_FLOW_CREATE_CONTACT_URL", FLOW_CREATE_CONTACT_URL);

    const res = await fetch(FLOW_CREATE_CONTACT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`CreateContact failed (${res.status}): ${text}`);
    }

    return (await res.json()) as CreateContactResponse; // { contactId }
}

