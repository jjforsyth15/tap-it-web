import styles from "../../styles/admin/AdminStatCard.module.css";

type AdminStatCardProps = {
    label: string;
    value: string | number;
    description?: string;
};

function AdminStatCard({ label, value, description }: AdminStatCardProps) {
    return (
        <article className={styles.statCard}>
            <p className={styles.statLabel}>{label}</p>

            <p className={styles.statValue}>{value.toLocaleString()}</p>

            {description && 
                <p className={styles.statDescription}>{description}</p>
            }
        </article>
    );
}

export default AdminStatCard;