// app/lib/excel.ts
export function escapeForTSV(value: unknown) {
    return String(value ?? "")
        .replace(/\t/g, " ")
        .replace(/\r?\n/g, " ");
}

export async function copyRowToClipboard(values: unknown[]) {
    const tsvRow = values.map(escapeForTSV).join("\t");

    try {
        await navigator.clipboard.writeText(tsvRow);
    } catch {
        const ta = document.createElement("textarea");
        ta.value = tsvRow;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
    }
}
