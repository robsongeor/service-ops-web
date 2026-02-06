import styles from "./FormSection.module.css";

type FormSectionProps = {
    title: string;
    children: React.ReactNode;
};

export function FormSection({ title, children }: FormSectionProps) {
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>{title}</h2>

            <div className={styles.content}>
                {children}
            </div>
        </section>
    );
}
