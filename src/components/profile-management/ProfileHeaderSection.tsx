import styles from '../../styles/ProfileManagementPage.module.css'
import type { Profile } from '../../types/profile'
import { useRef, useState } from 'react'
import { deleteProfileAvatar, updateProfile, uploadAvatar } from '../../api/profileApi'

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

    const currentAvatar = avatarPreview || profile.profile_image_url;

    const [showRemoveAvatarModal, setShowRemoveAvatarModal] = useState(false);

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

    async function handleRemoveAvatar() {
        try {
            const updatedProfile = await deleteProfileAvatar(profile.profile_id);

            setAvatarPreview("");
            onProfileUpdated(updatedProfile.profile);

            setSuccessMessage("Profile picture removed successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to remove profile picture");
            setTimeout(() => setError(""), 3000);
        }
    }

    return (
        <>
            <section className={styles.profileManagementHeader}>
                <div className={styles.profileHeaderContent}>
                    <div className={styles.headerSection}>
                        <div className={styles.avatarSection}>
                            <div 
                                className={styles.avatarContainer}
                                onClick={() => {
                                    if (!isUploadingAvatar)
                                        fileInputRef.current?.click();
                                }}
                            >
                                {currentAvatar ? (
                                    <img
                                        src={currentAvatar}
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
                            </div>

                            {currentAvatar && (
                                <button 
                                    type="button"
                                    className={styles.removeAvatarButton}
                                    onClick={() => setShowRemoveAvatarModal(true)}
                                >
                                    Remove Photo
                                </button>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className={styles.hiddenFileInput}
                                onChange={handleAvatarChange}
                            />
                        </div>
                    </div>

                    <div className={styles.headerSection}>
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
                    </div>

                    <div className={styles.headerSection}>
                        <h2 className={styles.bioHeader}>Bio</h2>
                        {isEditingBio ? (
                                <textarea
                                    className={styles.bioTextarea}
                                    value={bioInput}
                                    onChange={(e) => setBioInput(e.target.value)}
                                    maxLength={1000}
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
                    </div>

                    <div className={styles.headerActionSection}>
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
                </div>

                <span className={`${styles.statusBadge} ${statusClassMap[profile.profile_status]}`}>
                    {profile.profile_status}
                </span>
            </section>

            {showRemoveAvatarModal && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.confirmModal}>
                        <h2>Remove Profile Picture?</h2>
                        <p>
                            Are you sure you want to remove your profile picture? 
                            This action cannot be undone.
                        </p>

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={() => setShowRemoveAvatarModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className={styles.deleteConfirmButton}
                                onClick={async () => {
                                    await handleRemoveAvatar();
                                    setShowRemoveAvatarModal(false);
                                }}
                            >
                                Remove Picture
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}