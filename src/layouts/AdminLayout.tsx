import { NavLink, Outlet } from "react-router-dom";
import styles from "../styles/admin/AdminLayout.module.css";

function AdminLayout() {
    return (
        <div className={styles.adminLayout}>
            <aside className={styles.adminSidebar}>
                <div className={styles.sidebarHeader}>
                    <h1>TapIt Admin</h1>
                </div>

                <nav className={styles.adminNavigation} aria-label="Admin Navigation">
                    <NavLink to="/admin" end className={({ isActive }) => isActive ? `${styles.navigationLink} ${styles.active}` : styles.navigationLink}>
                        Overview
                    </NavLink>
                </nav>
            </aside>

            <main className={styles.adminContent}>
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;