import styles from "../../styles/admin/AdminDashboardPage.module.css";

function AdminDashboardPage() {
    return (
        <section className={styles.adminDashboard}>
            <header className={styles.pageHeader}>
                <div>
                    <p className={styles.eyebrow}>
                        Administration
                    </p>
                    <h1>Dashboard Overview</h1>
                    <p className={styles.pageDescription}>
                        Monitor TapIt users, profiles, cards, feedback, requests, and system health.
                    </p>
                </div>
            </header>

            <section className={styles.dashboardPlaceholder} aria-labelledby="admin-dashboard-placeholder">
                <h2 id="admin-dashboard-placeholder">Admin dashboard ready</h2>

                <p>
                    This section will display key metrics and insights for administrators to manage the TapIt platform effectively.
                </p>
            </section>
        </section>
    );
}

export default AdminDashboardPage;