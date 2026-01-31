import { NavLink } from "react-router-dom";
import { navItems } from "./navConfig";

export function Sidebar() {
    return (
        <aside style={styles.sidebar}>
            <div style={styles.brand}>Service Ops</div>

            <nav>
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        style={({ isActive }) => ({
                            ...styles.link,
                            ...(isActive ? styles.linkActive : null),
                        })}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

const styles: Record<string, React.CSSProperties> = {
    sidebar: {
        width: 140,
        height: "100vh",
        borderRight: "1px solid #e5e7eb",
        padding: 16,
        background: "#fff",

    },
    brand: {

    },
    link: {
        display: "block",
        textDecoration: "none",
        color: "inherit",
        padding: 4,

    },
    linkActive: {
        backgroundColor: "#f4f4f4"
    },
};
