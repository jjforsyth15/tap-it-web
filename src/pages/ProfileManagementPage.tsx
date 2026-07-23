import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMyProfiles, getProfile, getProfileLinks } from "../api/profileApi";
import type { Profile, ProfileLink } from "../types/profile";
import type { CardResponse } from "../types/card";
import styles from "../styles/ProfileManagementPage.module.css";
import { getActiveProfileCards } from "../api/cardApi";
import ProfileHeader from "../components/profile-management/ProfileHeaderSection";
import ProfileLinks from "../components/profile-management/ProfileLinks";
import ProfileCards from "../components/profile-management/ProfileCards";
import { useTimeoutMessage } from "../utils/messaging";

export default function ProfileManagementPage() {
    const { profileId } = useParams();
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [profile, setProfile] = useState<Profile | null>(null);
    const [links, setLinks] = useState<ProfileLink[]>([]);
    const [cards, setCards] = useState<CardResponse[]>([]);
    const [profiles, setProfiles] = useState<Profile[]>([]);

    const {
        message: successMessage,
        showMessage: showSuccessMessage
    } = useTimeoutMessage(3000);
    

    useEffect(() => {
        loadProfile();
    }, [profileId]);

    async function loadProfile() {
            if(!profileId) {
                setError("Profile ID is missing");
                setLoading(false);
                return;
            }

            try {
                const [profileData, linksData, cardsData, profilesData] = await Promise.all([
                    getProfile(profileId),
                    getProfileLinks(profileId),
                    getActiveProfileCards(profileId),
                    getMyProfiles()
                ]);
                setProfile(profileData);
                setLinks(linksData);
                setCards(cardsData);
                setProfiles(profilesData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load profile");
            } finally {
                setLoading(false);
            }
    }

    function handleProfileUpdate(updatedProfile: Profile) {
        setProfile(updatedProfile);
    }


    if (loading) 
        return <p>Loading Profile...</p>;

    if (!profile)
        return <p>Profile not found</p>;

    return (
        <main className={styles.profileManagementPage}>

            <ProfileHeader
                profile={profile}
                onProfileUpdated={handleProfileUpdate}
                setSuccessMessage={showSuccessMessage}
                setError={setError}
            />

            {successMessage && (
                <p className={styles.successMessage}>{successMessage}</p>
            )}

            {error && (
                <p className={styles.errorMessage}>{error}</p>
            )}

            <ProfileLinks
                profileId={profile.profile_id}
                links={links}
                loadProfile={loadProfile}
                setSuccessMessage={showSuccessMessage}
                setError={setError}
            />

            <ProfileCards 
                cards={cards} 
                profiles={profiles}
                setCards={setCards}
                setSuccessMessage={showSuccessMessage}
                setError={setError}
            />

        </main>
    );
}