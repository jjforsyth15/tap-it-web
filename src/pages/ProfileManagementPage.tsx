import { useParams } from "react-router-dom";
import { useState, useEffect, use } from "react";
import { getProfile, getProfileLinks } from "../api/profileApi";
import type { Profile, ProfileLink } from "../types/profile";

export default function ProfileManagementPage() {
    const { profileId } = useParams();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [links, setLinks] = useState<ProfileLink[]>([]);

    useEffect(() => {
        async function loadProfile() {
            if(!profileId) {
                setError("Profile ID is missing");
                setLoading(false);
                return;
            }

            try {
                const [profileData, linksData] = await Promise.all([
                    getProfile(profileId),
                    getProfileLinks(profileId)
                ]);
                setProfile(profileData);
                setLinks(linksData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load profile");
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [profileId]);

    if (loading) 
        return <p>Loading... Profile</p>;

    if (error)
        return <p>Error: {error}</p>;

    if (!profile)
        return <p>Profile not found</p>;

    return (
        <main>
            <h1>{profile.profile_name}</h1>

            <p>Status: {profile.profile_status}</p>
            
            {profile.bio && <p>{profile.bio}</p>}

            <section>
                <h2>Links</h2>

                {links.length === 0 ? (
                    <p>No links added yet.</p>
                ) : (
                    <ul>
                        {links.map(link => (
                            <li key={link.link_id}>
                                <strong>{link.label}</strong>
                                {" - "}
                                <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                >
                                    {link.url}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}