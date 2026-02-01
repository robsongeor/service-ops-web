export type NavItem = {
    label: string;
    to: string;
};

export const navItems: NavItem[] = [
    { label: "Job Entry", to: "/job-entry" },
    { label: "Job List", to: "/job-list" },
];
