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
        <main>
            <h1>{profile.profile_name}</h1>

            <p>Status: {profile.profile_status}</p>

            {successMessage && <p className="success-message">{successMessage}</p>}

            {profile.bio && <p>{profile.bio}</p>}

            <section>
                <h2>Links</h2>

                {links.length === 0 ? (
                    <div>
                        <p>No links added yet.</p>
                        <p>Add one here.</p>
                    </div>
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
                                <button onClick={() => setLinkToDelete(link.link_id)}>
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                <button className="add-link-button" onClick={() => setShowAddLinkModal(true)}>
                    + Add Link
                </button>

                {showAddLinkModal && (
                    <div className="modal-backdrop">
                        <div className="confirm-modal">
                            <h2>Add New Link</h2>

                            {formError && <p className="form-error">{formError}</p>}

                            <select
                                value={selectedLabel}
                                onChange={(e) => {
                                    setSelectedLabel(e.target.value);
                                }}
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
                                onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                            />
                            <div className="modal-actions">
                                <button className="cancel-button" onClick={() => {
                                    setShowAddLinkModal(false); 
                                    setNewLink({label: "", url: ""})
                                    setFormError("");
                                    setCustomLabel("");
                                    setSelectedLabel(linkLabelOptions[0]);
                                    }
                                }
                                >
                                    Cancel
                                </button>
                                <button className="save-button" onClick={() => {
                                    handleAddLink();
                                }}>
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
                                <button className="cancel-button" onClick={() => setLinkToDelete(null)}>
                                    Cancel
                                </button>
                                <button className="delete-confirm-button" onClick={() => handleDeleteLink(linkToDelete)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}