import styles from '../../styles/ProfileManagementPage.module.css'
import type { Profile } from '../../types/profile'
import { useRef, useState } from 'react'
import { updateProfile, uploadAvatar } from '../../api/profileApi'

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

    const [avatarPreview, setAvatarPreview] = useState(profile.profile_image_url || "");
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const statusClassMap = {
        active: styles.statusActive,
        inactive: styles.statusInactive,
        disabled: styles.statusDisabled,
        archived: styles.statusArchived,
    };

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
    ]

    async function handleSaveBio() {
        if (bioInput.length > 1000) {
            setError("Bio cannot exceed 1000 characters");
            setTimeout(() => setError(""), 3000);
            return;
        }

        try {
            const updatedProfile = await updateProfile(profile.profile_id, { bio: bioInput });

            onProfileUpdated(updatedProfile.profile);
            setIsEditingBio(false);
            
            setSuccessMessage("Bio updated successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update bio");
            setTimeout(() => setError(""), 3000);
        }
    }

    async function handleSaveName() {
        if (!nameInput.trim()) {
            setError("Profile name cannot be empty");
            setTimeout(() => setError(""), 3000);
            return;
        }

        if (nameInput.length > 100) {
            setError("Profile name cannot exceed 100 characters");
            setTimeout(() => setError(""), 3000);
            return;
        }
        
        try {
            const updatedProfile = await updateProfile(profile.profile_id, {profile_name: nameInput});

            onProfileUpdated(updatedProfile.profile);
            setIsEditingName(false);
            setSuccessMessage("Profile name updated successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update profile name");
            setTimeout(() => setError(""), 3000);
        }
    }

    async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!allowedTypes.includes(file.type)) {
            setError("Please upload a valid image file (JPEG, PNG, JPG, or WEBP)");
            setTimeout(() => setError(""), 3000);
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError("Image must not be bigger than 5MB");
            setTimeout(() => setError(""), 3000);
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);

        try {
            setIsUploadingAvatar(true);

            const updatedProfile = await uploadAvatar(profile.profile_id, file);
            onProfileUpdated(updatedProfile.profile);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload image");
            setTimeout(() => setError(""), 3000);
        } finally {
            setIsUploadingAvatar(false);
            event.target.value = "";
        }
    }

    return (
        <section className={styles.profileManagementHeader}>
            <div>
                <div 
                    className={styles.avatarContainer}
                    onClick={() => {
                        if (!isUploadingAvatar)
                            fileInputRef.current?.click();
                    }}
                >
                    {avatarPreview ? (
                        <img
                            src={avatarPreview}
                            alt={`${profile.profile_name} avatar`}
                            className={styles.profileAvatar}
                        />
                    ) : (
                        <div className={styles.avatarFallback}>
                            {profile.profile_name.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <div className={styles.avatarOverlay}>
                        {isUploadingAvatar ? "Uploading..." : "Change Photo"}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className={styles.hiddenFileInput}
                        onChange={handleAvatarChange}
                    />
                </div>

            
                <h2 className={styles.bioHeader}>Profile Name</h2>
                {isEditingName ? (
                    <input
                        className={styles.profileNameInput}
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
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
                            
                            {/* Added character limit info */}
                            <p className={styles.characterLimitInfo}>
                                {nameInput.length} / 100 characters
                            </p>
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

                            <p className={styles.characterLimitInfo}>
                                {bioInput.length} / 1000 characters
                            </p>
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