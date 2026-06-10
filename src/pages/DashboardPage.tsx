import { useEffect, useState } from "react";
import { getCurrentUser} from "../api/userApi";
import type { User } from "../types/user";
import type { Profile, PublicProfile } from "../types/profile";
import { getMyProfiles } from "../api/profileApi";

function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [profiles, setProfiles] = useState<Profile[]>([]);

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

                    {profiles.length === 0 ? (
                        <p>You don't have any profiles yet. Create one to get started!</p>
                    ) : (
                        <ul>
                            {profiles.map((profile) => (
                                <li key={profile.profile_id}>
                                    <h3>{profile.profile_name}</h3>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </section>
    );
}

export default DashboardPage;