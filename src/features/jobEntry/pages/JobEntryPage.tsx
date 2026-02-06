import JobListPage from "../../jobsList/pages/JobListPage";
import { JobEntryForm } from "./JobEntryForm";
import styles from "./JobEntryPage.module.css";

export function JobEntryPage() {
    return (
        <div className={styles.layout}>
            <div className={styles.formPane}>
                <JobEntryForm />
            </div>

            {/* 
            <div className={styles.listPane}>
                <JobListPage />
            </div> */}
        </div>
    );
}
