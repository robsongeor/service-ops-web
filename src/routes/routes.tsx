import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../layout/AppShell/AppShell";
import { JobEntryPage } from "../features/jobEntry/pages/JobEntryPage";
import JobListPage from "../features/jobsList/pages/JobListPage";
import JobListOpsBoard from "../features/jobsList/pages/JobsListOpsBoard/JobListOpsBoard";

// Placeholder pages (you’ll replace these later)
const Page = ({ title }: { title: string }) => (
    <div style={{ fontSize: 20, fontWeight: 700 }}>{title}</div>
);

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<AppShell />}>


                <Route
                    path="/job-entry"
                    element={<JobEntryPage />}
                    handle={{ title: "Job Entry" }}
                />

                <Route
                    path="/job-list"
                    element={<JobListPage />}
                    handle={{ title: "Job List" }}
                />

                <Route
                    path="/ops-board"
                    element={<JobListOpsBoard />}
                    handle={{ title: "Ops Board" }}
                />



                <Route path="*" element={<Page title="Not found" />} />
            </Route>
        </Routes>
    );
}
