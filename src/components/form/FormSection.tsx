import styles from "./FormSection.module.css";

type FormSectionProps = {
    title: string;
    children: React.ReactNode;
};

export function FormSection({ title, children }: FormSectionProps) {
    return (
        <section className={styles.section}>
            <h3 className={styles.title}>{title}</h3>

            <div className={styles.content}>
                {children}
            </div>
        </section>
    );
}
