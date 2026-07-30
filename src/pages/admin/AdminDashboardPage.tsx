import styles from "../../styles/admin/AdminDashboardPage.module.css";

function AdminDashboardPage() {
    return (
        <section className={styles.dashboardPage}>
            <header className={styles.pageHeader}>
                <div>
                    <p className={styles.eyebrow}>Administration</p>
                    <h2>Dashboard Overview</h2>
                    <p>
                        Monitor TapIt users, cards, feedback, requests, and system health.
                    </p>
                </div>
            </header>

            <div className={styles.placeholder}>
                <h3>Admin dashboard connected successfully</h3>
            </div>
        </section>
    );
}

export default AdminDashboardPage;