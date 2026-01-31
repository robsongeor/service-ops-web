import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";

const titleMap: Record<string, string> = {
    "/job-entry": "Job Entry",
};

export function AppShell() {
    const { pathname } = useLocation();
    const currentTitle = titleMap[pathname] ?? "";

    return (
        <div style={styles.shell}>
            <Sidebar />

            <main style={styles.main}>
                <div style={styles.topbar}>
                    <div style={styles.pageTitle}>{currentTitle}</div>
                </div>

                <div style={styles.content}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}


const styles: Record<string, React.CSSProperties> = {
    shell: {
        display: "flex",
        minHeight: "100vh",
        background: "#ffffff",
    },
    main: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
    },
    topbar: {
        height: 64,
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
    },
    pageTitle: {
        fontSize: 16,
        fontWeight: 700
    },
    content: { padding: 20 },
};
