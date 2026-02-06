export function formatNZDate(value?: string) {
    if (!value) return "—";

    const d = new Date(value);
    if (isNaN(d.getTime())) return "—";

    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function todayISO() {
    return new Date().toISOString().split("T")[0];
}

export function nzDateToISO(value?: string) {
    if (!value) return value;
    const [dd, mm, yyyy] = value.split("/");
    if (!dd || !mm || !yyyy) return value;
    return `${yyyy}-${mm}-${dd}T00:00:00Z`;
}

export function toISODateOnly(input: string): string {
    const s = (input ?? "").trim();
    if (!s) return "";

    // already yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

    // dd/mm/yyyy
    const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) {
        const dd = String(m[1]).padStart(2, "0");
        const mm = String(m[2]).padStart(2, "0");
        const yyyy = m[3];
        return `${yyyy}-${mm}-${dd}`;
    }

    // fallback: let Date try (best-effort)
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) {
        // date input wants date-only
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }

    return "";
}

// lib/utils/date.ts
export function toDataverseDateTime(input: unknown): string {
    // Empty → now
    if (input == null || input === "") {
        return new Date().toISOString();
    }

    // Epoch ms (number or numeric string)
    if (typeof input === "number" || (typeof input === "string" && /^\d+$/.test(input))) {
        const ms = typeof input === "number" ? input : Number(input);
        const d = new Date(ms);
        return Number.isNaN(d.getTime())
            ? new Date().toISOString()
            : d.toISOString();
    }

    if (typeof input === "string") {
        // ISO or parseable date string
        const parsed = new Date(input);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed.toISOString();
        }

        // NZ format DD/MM/YYYY
        const m = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (m) {
            const [, dd, mm, yyyy] = m;
            const d = new Date(Date.UTC(
                Number(yyyy),
                Number(mm) - 1,
                Number(dd)
            ));
            return d.toISOString();
        }
    }

    // 🚨 Last-resort fallback
    console.warn("Invalid date input, defaulting to now:", input);
    return new Date().toISOString();
}
