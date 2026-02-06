import React from "react";
import styles from "./TextField.module.css";

type BaseProps<T extends string> = {
    label: string;
    name: T;
    value: string;
    onChange: (name: T, value: string) => void;
    fullWidth?: boolean;
    required?: boolean;
};

type InputProps<T extends string> = BaseProps<T> & {
    kind?: "input";
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
};

type SelectOption = { value: string; label: string; disabled?: boolean };

type SelectProps<T extends string> = BaseProps<T> & {
    kind: "select";
    options: SelectOption[];
};

type TextFieldProps<T extends string> = InputProps<T> | SelectProps<T>;

export function TextField<T extends string>(props: TextFieldProps<T>) {
    const { label, name, value, onChange, fullWidth = false, required = false } = props;

    return (
        <div className={`${styles.field} ${fullWidth ? styles.fullWidth : ""}`}>
            <label className={styles.label}>{label}</label>

            {props.kind === "select" ? (
                <select
                    className={styles.control}
                    value={value}
                    onChange={(e) => onChange(name, e.target.value)}
                    required={required}
                >
                    {props.options.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    className={styles.control}
                    type={props.type ?? "text"}
                    value={value}
                    placeholder={props.placeholder}
                    onChange={(e) => onChange(name, e.target.value)}
                    required={required}
                />
            )}
        </div>
    );
}
