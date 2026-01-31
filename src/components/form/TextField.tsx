import styles from "./TextField.module.css";

type TextFieldProps<T extends string> = {
    label: string;
    name: T;
    value: string;
    onChange: (name: T, value: string) => void;
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
    fullWidth?: boolean;
    required?: boolean;

};

export function TextField<T extends string>({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    fullWidth = false,
    required = false,

}: TextFieldProps<T>) {
    return (
        <div
            className={`${styles.field} ${fullWidth ? styles.fullWidth : ""}`}
        >
            <label className={styles.label}>{label}</label>

            <input
                className={styles.input}
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(name, e.target.value)}
                required={required}
            />
        </div>
    );
}
