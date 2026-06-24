import type { ProfileLink, ProfileLinkCreate } from '../../types/profile';
import styles from '../../styles/ProfileManagementPage.module.css'
import { useState } from 'react';
import { createProfileLink, deleteProfileLink } from '../../api/profileApi';

type ProfileLinksProps = {
    links : ProfileLink[];
    loadProfile: () => Promise<void>;
    profileId: string;
    setSuccessMessage: (message: string) => void;
    setError: (message: string) => void;
}

export default function ProfileLinks({ links, profileId, loadProfile, setSuccessMessage, setError }: ProfileLinksProps) {

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

    async function handleAddLink() {
        const label = selectedLabel === "Other" ? customLabel : selectedLabel;
        
        if (!newLink.url.trim()) {
            setFormError("Link URL cannot be empty");
            return;
        }

        if (!label.trim()) {
            setFormError("Link label cannot be empty");
            return;
        }

        const linkToCreate: ProfileLinkCreate = {
            ...newLink,
            label,
        };

        try {
            setFormError("");

            await createProfileLink(profileId, linkToCreate);

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

        try {
            await deleteProfileLink(linkId);
            await loadProfile();

            setLinkToDelete(null);
            setSuccessMessage("Link deleted successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete link");
        }
    }


    return (
        <>
            <section className={styles.itemPanel}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <h2>Links</h2>
                            <p>Manage the links shown on the public profile.</p>
                        </div>

                        <button
                            className={styles.primaryButton}
                            onClick={() => setShowAddLinkModal(true)}
                        >
                            + Add Link
                        </button>
                    </div>

                    {links.length === 0 ? (
                        <div className={styles.emptyState}>
                            <h3>No links added yet</h3>
                            <p>Add your first link to start building this profile.</p>
                        </div>
                    ) : (
                        <div className={styles.itemList}>
                            {links.map(link => (
                                <article className={styles.itemCard} key={link.link_id}>
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
                                        className={styles.dangerTextButton}
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
                    <div className={styles.modalBackdrop}>
                        <div className={styles.confirmModal}>
                            <h2>Add New Link</h2>

                            {formError && <p className={styles.formError}>{formError}</p>}

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

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
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

                                <button className={styles.saveButton} onClick={handleAddLink}>
                                    Save Link
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {linkToDelete && (
                    <div className={styles.modalBackdrop}>
                        <div className={styles.confirmModal}>
                            <h2>Delete link?</h2>
                            <p>Are you sure you want to delete this link? This action cannot be undone.</p>

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setLinkToDelete(null)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className={styles.deleteConfirmButton}
                                    onClick={() => handleDeleteLink(linkToDelete)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </>
    )
}