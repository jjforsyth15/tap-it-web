import type { AdminHealthResponse, ServiceHealthStatus } from "../../types/admin";
import styles from "../../styles/admin/AdminHealthCard.module.css";

type AdminHealthCardProps = {
    health: AdminHealthResponse;
};

function formatStatus(status: ServiceHealthStatus) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function AdminHealthCard({ health }: AdminHealthCardProps) {
    return (
        <article className={styles.healthCard}>
            <header className={styles.healthHeader}>
                <div>
                    <p className={styles.healthEyebrow}>Current Status</p>

                    <h2>System Health</h2>
                </div>

                <span className={`${styles.statusBadge} ${styles[health.overall_status]}`}>
                    {formatStatus(health.overall_status)}
                </span>
            </header>

            <dl className={styles.healthDetails}>
                <div className={styles.healthRow}>
                    <dt>API Status</dt>
                    <dd>
                        <span className={`${styles.statusIndicator} ${styles[health.api_status]}`}/>
                        {formatStatus(health.api_status)}
                    </dd>
                </div>

                <div className={styles.healthRow}>
                    <dt>Database Status</dt>
                    <dd>
                        <span className={`${styles.statusIndicator} ${styles[health.database_status]}`}/>
                        {formatStatus(health.database_status)}
                    </dd>
                </div>

                <div className={styles.healthRow}>
                    <dt>Version</dt>
                    <dd>{health.version}</dd>
                </div>
                
                <div className={styles.healthRow}>
                    <dt>Environment</dt>
                    <dd>{health.environment}</dd>
                </div>
            </dl>
        </article>
    );
}

export default AdminHealthCard;