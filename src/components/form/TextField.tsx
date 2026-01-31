import styles from "./TextField.module.css";

type TextFieldProps<T extends string> = {
    label: string;
    name: T;
    value: string;
    onChange: (name: T, value: string) => void;
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
};

export function TextField<T extends string>({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
}: TextFieldProps<T>) {
    return (
        <div className={styles.field}>
            <label className={styles.label}>{label}</label>

            <input
                className={styles.input}
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(name, e.target.value)}
            />
        </div>
    );
}
