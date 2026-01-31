import styles from "./Button.module.css";

type ButtonProps = {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary";
    disabled?: boolean;
    onClick?: () => void;
};

export function Button({
    children,
    type = "button",
    variant = "primary",
    disabled = false,
    onClick,
}: ButtonProps) {
    return (
        <button
            type={type}
            className={`${styles.button} ${styles[variant]}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
