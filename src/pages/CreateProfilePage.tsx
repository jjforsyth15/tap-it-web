import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { CreateProfileRequest } from "../types/profile";
import { createProfile, uploadAvatar, updateProfile } from "../api/profileApi";
import styles from "../styles/CreateProfilePage.module.css";
import { useSearchParams } from "react-router-dom";

export default function CreateProfilePage() {
    const [profileData, setProfileData] = useState<CreateProfileRequest>({profile_name: "", bio: "", profile_image_url: ""});
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
    ]


    async function handleCreateProfile(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const response = await createProfile(profileData);
            const newProfile = response.profile;

            if(selectedImage) {
                try {
                    const imageUrl = await uploadAvatar(newProfile.profile_id, selectedImage);

                    await updateProfile(newProfile.profile_id, { profile_image_url: imageUrl.profile.profile_image_url });
                } catch {
                    setError("Profile created, but failed to upload profile image. Try uploading it via the profile management page.");
                    
                    const next = searchParams.get("next")  || `/dashboard/profiles/${response.profile.profile_id}`;
                    navigate(next);
                    return;
                }
            } 

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

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) {
            setSelectedImage(null);
            setImagePreview(null);
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            setError("Please select a valid image file (jpg, jpeg, png, webp).");
            e.target.value = ""; 
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setError("Image size cannot exceed 5MB.");
            e.target.value = "";
            return;
        }

        if (imagePreview) 
            URL.revokeObjectURL(imagePreview);

        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
        setError(""); 
    }

    function handleRemoveAvatar() {
        if (imagePreview) 
            URL.revokeObjectURL(imagePreview);

        setSelectedImage(null);
        setImagePreview(null);

        if (fileInputRef.current) 
            fileInputRef.current.value = "";
    }

        return (
        <div className={styles.createPage}>
            <div className={styles.createCard}>
                <h1>Create Profile</h1>

                {error && <p className={styles.profileError}>{error}</p>}
                {successMessage && <p className={styles.createSuccess}>{successMessage}</p>}

                <form onSubmit={handleCreateProfile} className={styles.createForm}>
                    <div className={styles.formGroup}>
                        <label>Profile Image</label>

                        <div className={styles.avatarSection}>
                            <div 
                                className={styles.avatarContainer}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Profile Image Preview"
                                        className={styles.profileAvatar}
                                    />
                                ) : (
                                    <div className={styles.avatarFallback}>
                                        {profileData.profile_name.trim() ? profileData.profile_name.trim().charAt(0).toUpperCase() : "?"}
                                    </div>
                                )}

                                <div className={styles.avatarOverlay}>
                                    {selectedImage ? "Change Image" : "Upload Image"}
                                </div>
                            </div>
                            
                            {selectedImage && (
                                    <button
                                        type="button"
                                        className={styles.removeAvatarButton}
                                        onClick={handleRemoveAvatar}
                                    >
                                        Remove
                                    </button>
                                )}

                            <div className={styles.profileImageActions}>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                    onChange={handleAvatarChange}
                                    className={styles.hiddenFileInput}
                                />

                                <p className={styles.imageHelpText}>
                                    JPG, PNG, or WEBP. Max file size: 5MB.
                                </p>
                            </div>
                        </div>
                    </div>

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