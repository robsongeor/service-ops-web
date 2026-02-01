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