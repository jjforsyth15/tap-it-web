import { useNavigate, Link } from "react-router-dom";
import styles from "../../styles/DashboardPage.module.css";

export default function CreateProfileCard() {
    const navigate = useNavigate();

    return (
        <Link
            className={`${styles.profileCard} ${styles.createProfileCard}`}
            to="/profiles/new"
        >
            <div className={styles.createProfileIcon}>+</div>

            <div className={styles.createProfileCardIcon}>
                <h2>Create New Profile</h2>
                <p>Start a new TapIt profile</p>
            </div>
        </Link>
    );
}