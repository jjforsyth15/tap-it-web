import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { createProfileLink, deleteProfileLink, getProfile, getProfileLinks } from "../api/profileApi";
import type { Profile, ProfileLink, ProfileLinkCreate } from "../types/profile";
import "../styles/ProfileManagementPage.css";

export default function ProfileManagementPage() {
    const { profileId } = useParams();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [links, setLinks] = useState<ProfileLink[]>([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
    const [showAddLinkModal, setShowAddLinkModal] = useState(false);
    const [newLink, setNewLink] = useState<ProfileLinkCreate>({label: "", url: ""});
    const [formError, setFormError] = useState("");

    const linkLabelOptions = [
        "LinkedIn",
        "GitHub",
        "Instagram",
        "X (Twitter)",
        "Facebook",
        "Portfolio",
        "Other"
    ];
    const [selectedLabel, setSelectedLabel] = useState(linkLabelOptions[0]);
    const [customLabel, setCustomLabel] = useState("");


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

    async function handleAddLink() {
        newLink.label = selectedLabel === "Other" ? customLabel : selectedLabel;

        if (!profile?.profile_id) return;
        
        if (!newLink.url.trim()) {
            setFormError("Link URL cannot be empty");
            return;
        }

        if (!newLink.label.trim()) {
            setFormError("Link label cannot be empty");
            return;
        }

        try {
            setFormError("");

            await createProfileLink(profile?.profile_id, newLink);

            setShowAddLinkModal(false);
            setNewLink({label: "", url: ""});
            setFormError("");
            setSelectedLabel(linkLabelOptions[0]);
            setCustomLabel("");
            await loadProfile();
            setSuccessMessage("Link added successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Failed to add link");
        }
    }

    async function handleDeleteLink(linkId: string) {
        if (!linkToDelete) return;
        setLinkToDelete(null);

        try {
            await deleteProfileLink(linkId);
            await loadProfile();

            setSuccessMessage("Link deleted successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete link");
        }
    }

    if (loading) 
        return <p>Loading... Profile</p>;

    if (error)
        return <p>Error: {error}</p>;

    if (!profile)
        return <p>Profile not found</p>;

    return (
    <main className="profile-management-page">
        <section className="profile-management-header">
            <div>
                <p className="eyebrow">Profile Management</p>
                <h1>{profile.profile_name}</h1>

                {profile.bio && (
                    <p className="profile-bio">{profile.bio}</p>
                )}

                <a 
                    href={`/public/${profile.profile_id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="view-public-profile-button"
                    onClick={(e) => e.stopPropagation()}
                    >
                        View Public Page
                </a>
            </div>

            <span className={`status-badge status-${profile.profile_status}`}>
                {profile.profile_status}
            </span>
        </section>

        {successMessage && (
            <p className="success-message">{successMessage}</p>
        )}

        <section className="links-panel">
            <div className="section-header">
                <div>
                    <h2>Links</h2>
                    <p>Manage the links shown on this public profile.</p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => setShowAddLinkModal(true)}
                >
                    + Add Link
                </button>
            </div>

            {links.length === 0 ? (
                <div className="empty-state">
                    <h3>No links added yet</h3>
                    <p>Add your first link to start building this profile.</p>
                </div>
            ) : (
                <div className="link-list">
                    {links.map(link => (
                        <article className="link-card" key={link.link_id}>
                            <div>
                                <h3>{link.label}</h3>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {link.url}
                                </a>
                            </div>

                            <button
                                className="danger-text-button"
                                onClick={() => setLinkToDelete(link.link_id)}
                            >
                                Delete
                            </button>
                        </article>
                    ))}
                </div>
            )}
        </section>

        {showAddLinkModal && (
            <div className="modal-backdrop">
                <div className="confirm-modal">
                    <h2>Add New Link</h2>

                    {formError && <p className="form-error">{formError}</p>}

                    <select
                        value={selectedLabel}
                        onChange={(e) => setSelectedLabel(e.target.value)}
                    >
                        {linkLabelOptions.map((label) => (
                            <option key={label} value={label}>
                                {label}
                            </option>
                        ))}
                    </select>

                    {selectedLabel === "Other" && (
                        <input
                            type="text"
                            placeholder="Custom Link Label"
                            value={customLabel}
                            onChange={(e) => setCustomLabel(e.target.value)}
                        />
                    )}

                    <input
                        type="url"
                        placeholder="Link URL"
                        value={newLink.url}
                        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    />

                    <div className="modal-actions">
                        <button
                            className="cancel-button"
                            onClick={() => {
                                setShowAddLinkModal(false);
                                setNewLink({ label: "", url: "" });
                                setFormError("");
                                setCustomLabel("");
                                setSelectedLabel(linkLabelOptions[0]);
                            }}
                        >
                            Cancel
                        </button>

                        <button className="save-button" onClick={handleAddLink}>
                            Save Link
                        </button>
                    </div>
                </div>
            </div>
        )}

        {linkToDelete && (
            <div className="modal-backdrop">
                <div className="confirm-modal">
                    <h2>Delete link?</h2>
                    <p>Are you sure you want to delete this link? This action cannot be undone.</p>

                    <div className="modal-actions">
                        <button
                            className="cancel-button"
                            onClick={() => setLinkToDelete(null)}
                        >
                            Cancel
                        </button>

                        <button
                            className="delete-confirm-button"
                            onClick={() => handleDeleteLink(linkToDelete)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        )}
    </main>
);
}