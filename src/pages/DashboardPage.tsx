import { useEffect, useState } from "react";
import { getCurrentUser} from "../api/userApi";
import type { User } from "../types/user";
import type { Profile } from "../types/profile";
import { getMyProfiles } from "../api/profileApi";
import { useNavigate } from "react-router-dom";
import styles from "../styles/DashboardPage.module.css";

function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [profiles, setProfiles] = useState<Profile[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function loadUser() {
            try {
                const [userData, profileData] = await Promise.all([
                    getCurrentUser(),
                    getMyProfiles()
                ]);
                setUser(userData);
                setProfiles(profileData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load dashboard");
            } finally {
                setIsLoading(false);
            }
        }

        loadUser();
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <section className={styles.dashboardPage}>
            <h1>Dashboard</h1>

            {user && (
                <>
                    <h2>My Profiles</h2>

                    <div className={styles.profileGrid}>
                        {profiles.length === 0 ? (
                            <p>You don't have any profiles yet. Create one now!</p>
                        ) : (
                            profiles.map((profile) => (
                                <div 
                                key={profile.profile_id} 
                                className={styles.profileCard}
                                onClick={() => navigate(`/dashboard/profiles/${profile.profile_id}`)}
                                >
                                    <h2>{profile.profile_name}</h2>

                                    <span className={styles.profileStatus}>
                                        {profile.profile_status}
                                    </span>

                                    {profile.bio && <p className={styles.profileBio}>{profile.bio}</p>}

                                    <a 
                                    href={`/public/${profile.profile_id}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={styles.viewPublicProfileButton}
                                    onClick={(e) => e.stopPropagation()}
                                    >
                                        View Public Page
                                    </a>
                                </div>
                            ))
                        )}
                    </div>

                    <button
                        className={styles.createProfileButton}
                        onClick={() => navigate("/profiles/new")}
                    >
                        + Create Profile
                    </button>
                </>
            )}
        </section>
    );
}

export default DashboardPage;