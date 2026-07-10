import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CreateProfileRequest } from "../types/profile";
import { createProfile } from "../api/profileApi";
import styles from "../styles/CreateProfilePage.module.css";
import { useSearchParams } from "react-router-dom";

export default function CreateProfilePage() {
    const [profileData, setProfileData] = useState<CreateProfileRequest>({profile_name: "", bio: "", profile_image_url: ""});
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();


    async function handleCreateProfile(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const response = await createProfile(profileData);

            const next = searchParams.get("next")  || `/dashboard/profiles/${response.profile.profile_id}`;
            setSuccessMessage(`Profile created successfully!`);
            navigate(next);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } 
        } finally {
            setIsLoading(false);
        }
    }

        return (
        <div className={styles.createPage}>
            <div className={styles.createCard}>
                <h1>Create Profile</h1>

                {successMessage && <p className={styles.createSuccess}>{successMessage}</p>}

                <form onSubmit={handleCreateProfile} className={styles.createForm}>
                    <input
                        className={styles.profileName}
                        type="text"
                        placeholder="Profile Name"
                        value={profileData.profile_name}
                        onChange={(e) => setProfileData({...profileData, profile_name: e.target.value})}
                        required
                    />
                    <textarea
                        className={styles.profileBio}
                        placeholder="Bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    />
                    <input
                        className={styles.profileImageUrl}
                        type="text"
                        placeholder="Profile Image URL"
                        value={profileData.profile_image_url}
                        onChange={(e) => setProfileData({...profileData, profile_image_url: e.target.value})}
                    />

                    {error && <p className={styles.profileError}>{error}</p>}

                    <button 
                    type="submit" 
                    disabled={isLoading} 
                    className={styles.createButton}>
                        {isLoading ? "Creating profile..." : "Create Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
}