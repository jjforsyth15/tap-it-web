import { Link } from "react-router-dom";
import styles from "../../styles/DashboardPage.module.css";
import type { DashboardProfile } from "../../types/profile";

type ProfileCardProps = {
    profile: DashboardProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
    const statusClassMap = {
        active: styles.statusActive,
        inactive: styles.statusInactive,
        archived: styles.statusArchived,
        disabled: styles.statusDisabled,
    }

    return (
        <article className={styles.profileCard}>
            <div className={styles.profileCardHeader}>
                <div className={styles.profileCardIdentity}>
                    {profile.profile_image_url ? (
                        <img
                            className={styles.profileCardAvatar}
                            src={profile.profile_image_url}
                            alt={`${profile.profile_name} profile`}
                        />
                    ) : (
                        <div className={styles.profileCardAvatarFallback}>
                            {profile.profile_name.charAt(0).toUpperCase()}
                        </div>
                    )}
                

                    <div>
                        <p className={styles.profileCardEyebrow}>Profile</p>
                        <h2 className={styles.profileName}>{profile.profile_name}</h2>
                    </div>
                </div>
            

                <span className={`${styles.statusBadge} ${statusClassMap[profile.profile_status]}`}>
                    {profile.profile_status}
                </span>
            </div>

            <div className={styles.profileCardStats}>
                <div className={styles.profileCardStat}>
                    <span className={styles.profileCardStatValue}>
                        {profile.link_count ?? 0}
                    </span>
                    <span className={styles.profileCardStatLabel}>Links</span>
                </div>

                <div className={styles.profileCardStat}>
                    <span className={styles.profileCardStatValue}>
                        {profile.card_count ?? 0}
                    </span>
                    <span className={styles.profileCardStatLabel}>Cards</span>
                </div>
            </div>

            <div className={styles.profileCardActions} onKeyDown={(event) => event.stopPropagation() } onPointerDown={(event) => event.stopPropagation()}>
                <Link 
                    className={styles.primaryButton}
                    to={`/public/${profile.profile_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View
                </Link>

                <Link
                    className={styles.primaryButton}
                    to={`/dashboard/profiles/${profile.profile_id}`}
                >
                    Manage
                </Link>
            </div>
        </article>
    )

}