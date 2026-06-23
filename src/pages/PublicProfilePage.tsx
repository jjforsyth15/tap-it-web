import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicProfile } from "../api/profileApi";
import styles from "../styles/PublicProfilePage.module.css";
import type { PublicProfile } from "../types/profile";

export default function PublicProfilePage() {
    const { profileId } = useParams();
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {

            if (!profileId) 
                return;

            try {
                const data = await getPublicProfile(profileId);

                setProfile(data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProfile();
    }, [profileId]);

    if (isLoading) 
        return <div>Loading...</div>;

    if (!profile) 
        return <div>{"Profile not found"}</div>;

    return (
        <div className={styles.publicProfilePage}>
            <div className={styles.publicProfileContent}>
                <div className={styles.profileAvatar}>
                    {profile.profile_name.charAt(0).toUpperCase()}
                </div>

            <h1>{profile.profile_name}</h1>
            

            {profile.bio && (
                <p className={styles.profileBio}>{profile.bio}</p>
            )}

            {profile.website_url && (
                <a 
                    href={profile.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.profileMainLink}
                >
                    Visit Website
                </a>
            )}

            <div className={styles.profileLinks}> 
                {profile.links?.map((link) => (
                    <a 
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.profileLink}
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </div>
    </div>
    );
}