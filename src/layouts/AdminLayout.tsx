import { NavLink, Outlet } from "react-router-dom";
import styles from "../styles/admin/AdminLayout.module.css";

const adminNavigationItems = [
    {
        label: "Overview",
        path: "/admin",
        end: true,
    },
    {
        label: "Users",
        path: "/admin/users",
    },
    {
        label: "Profiles",
        path: "/admin/profiles",
    },
    {
        label: "Cards",
        path: "/admin/cards",
    },
    {
        label: "Beta Feedback",
        path: "/admin/feedback",
    },
    {
        label: "Card Requests",
        path: "/admin/card-requests",
    },
    {
        label: "Analytics",
        path: "/admin/analytics",
    },
    {
        label: "System",
        path: "/admin/system",
    }
]

function AdminLayout() {
    return (
        <div className={styles.adminLayout}>
            <aside className={styles.adminSidebar}>
                <header className={styles.sidebarHeader}>
                    <span className={styles.brandName}>TapIt</span>
                    <span className={styles.adminLabel}>Admin</span>
                </header>

                <nav className={styles.adminNavigation} aria-label="Admin Navigation">
                    {adminNavigationItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => isActive ? `${styles.navigationLink} ${styles.activeNavigationLink}` : styles.navigationLink}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <footer className={styles.sidebarFooter}>
                    <NavLink to="/dashboard" className={styles.returnLink}>
                        Return to TapIt Dashboard
                    </NavLink>
                </footer>
            </aside>

            <main className={styles.adminContent}>
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;