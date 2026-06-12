import { useEffect, useState } from "react";
import { getCurrentUser} from "../api/userApi";
import type { User } from "../types/user";
import type { Profile } from "../types/profile";
import { getMyProfiles } from "../api/profileApi";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardPage.css";

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
        <section>
            <h1>Dashboard</h1>

            {user && (
                <>
                    <p>Welcome, {user.first_name}</p>

                    <h2>My Profiles</h2>

                    <div className="profile-grid">
                        {profiles.length === 0 ? (
                            <p>You don't have any profiles yet. Create one now!</p>
                        ) : (
                            profiles.map((profile) => (
                                <div 
                                key={profile.profile_id} 
                                className="profile-card"
                                onClick={() => navigate(`/dashboard/profiles/${profile.profile_id}`)}
                                >
                                    <h3>{profile.profile_name}</h3>

                                    <span className="profile-status">
                                        {profile.profile_status}
                                    </span>

                                    {profile.bio && <p className="profile-bio">{profile.bio}</p>}
                                </div>
                            ))
                        )}
                    </div>

                    <button
                        className="create-profile-button"
                        onClick={() => navigate("/dashboard/profiles/create")}
                    >
                        + Create Profile
                    </button>
                </>
            )}
        </section>
    );
}

export default DashboardPage;