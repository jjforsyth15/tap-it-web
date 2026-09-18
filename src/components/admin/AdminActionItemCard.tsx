import { Link } from "react-router-dom";
import type { AdminActionItem } from "../../types/admin";
import styles from "../../styles/admin/AdminActionItemCard.module.css";

type AdminActionItemCardProps = {
    actionItem: AdminActionItem;
};

function AdminActionItemCard({ actionItem }: AdminActionItemCardProps) {
    return (
        <Link to={actionItem.target_path} className={styles.actionItem}>
            <div className={styles.actionDetails}>
                <div className={styles.actionHeader}>
                    <h3>{actionItem.label}</h3>

                    <span className={`${styles.priorityBadge} ${styles[actionItem.priority]}`}>
                        {actionItem.priority}
                    </span>
                </div>

                <p>
                    {actionItem.count.toLocaleString()}{" "}
                    {actionItem.count === 1 ? "item" : "items"} require attention.
                </p>
            </div>

            <span className={styles.actionCount} aria-label={`${actionItem.count} items`}>
                {actionItem.count.toLocaleString()}
            </span>
        </Link>
    );
}

export default AdminActionItemCard;