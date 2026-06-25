import styles from '../../styles/ProfileManagementPage.module.css'
import type { Profile } from '../../types/profile'
import { useState } from 'react'
import { updateProfile } from '../../api/profileApi'

type ProfileHeaderProps = {
    profile: Profile;
    onProfileUpdated: (profile: Profile) => void;
    setSuccessMessage: (message: string) => void;
    setError: (message: string) => void;
};

export default function ProfileHeader({profile, onProfileUpdated, setSuccessMessage, setError}: ProfileHeaderProps) {
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioInput, setBioInput] = useState(profile.bio || "");

    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(profile.profile_name || "");

    const statusClassMap = {
        active: styles.statusActive,
        inactive: styles.statusInactive,
        disabled: styles.statusDisabled,
        archived: styles.statusArchived,
    };

    async function handleSaveBio() {
        try {
            const updatedProfile = await updateProfile(profile.profile_id, { bio: bioInput });

            onProfileUpdated(updatedProfile.profile);
            setIsEditingBio(false);
            
            setSuccessMessage("Bio updated successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update bio");
        }
    }

    async function handleSaveName() {
        try {
            const updatedProfile = await updateProfile(profile.profile_id, {profile_name: nameInput});

            onProfileUpdated(updatedProfile.profile);
            setIsEditingName(false);
            setSuccessMessage("Profile name updated successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update profile name");
        }
    }

    return (
        <section className={styles.profileManagementHeader}>
                <div>
                    <h2 className={styles.bioHeader}>Profile Name</h2>
                    {isEditingName ? (
                        <input
                            className={styles.profileNameInput}
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            placeholder="Enter a name for your profile..."
                        />
                    ) : (
                        <h1>{profile.profile_name}</h1>
                    )}

                    <div className={styles.nameActions}>
                        {isEditingName ? (
                            <>
                                <button
                                    className={styles.editBioButton}
                                    onClick={handleSaveName}
                                >
                                    Save
                                </button>

                                <button
                                    className={styles.editBioButton}
                                    onClick={() => {
                                        setNameInput(profile.profile_name || "");
                                        setIsEditingName(false);
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                className={styles.editBioButton}
                                onClick={() => setIsEditingName(true)}
                            >
                                Edit Name
                            </button>
                        )}
                    </div>

                    <h2 className={styles.bioHeader}>Bio</h2>
                    {isEditingBio ? (
                            <textarea
                                className={styles.bioTextarea}
                                value={bioInput}
                                onChange={(e) => setBioInput(e.target.value)}
                                placeholder="Write a short bio to describe your profile..."
                            />
                    ) : (
                        <>
                            <p className={styles.profileBio}>
                                {profile.bio || "No bio added yet."}
                            </p>
                        </>
                    )}

                    <div className={styles.bioEditActions}>
                        {isEditingBio ? (
                            <>
                                <button 
                                    type="button"
                                    className={styles.editBioButton}
                                    onClick={handleSaveBio}
                                >
                                    Save
                                </button>

                                <button 
                                    type="button"
                                    className={styles.editBioButton}
                                    onClick={() => {
                                        setBioInput(profile.bio || "");
                                        setIsEditingBio(false);
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button 
                                type="button"
                                className={styles.editBioButton}
                                onClick={() => setIsEditingBio(true)}
                            >
                                {profile.bio ? "Edit Bio" : "Add Bio"}
                            </button>
                        )}
                    </div>

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

                <span className={`${styles.statusBadge} ${statusClassMap[profile.profile_status]}`}>
                    {profile.profile_status}
                </span>
            </section>
    )
}