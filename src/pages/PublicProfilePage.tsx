import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicProfile, getProfileVCardUrl } from "../api/profileApi";
import styles from "../styles/PublicProfilePage.module.css";
import type { PublicProfile, PublicProfileContact } from "../types/profile";

const CONTACT_TYPE_LABELS: Record<PublicProfileContact["contact_type"], string> = {
    phone: "Phone",
    email: "Email",
};

// primary contacts sort first within their type -- every type has at most one
// primary, so a stable sort on is_primary alone puts each type's primary
// ahead of the rest of that type without needing to group by type
function sortContactsPrimaryFirst(contacts: PublicProfileContact[]): PublicProfileContact[] {
    return contacts
        .slice()
        .sort((a, b) => Number(b.is_primary) - Number(a.is_primary));
}

function contactKey(contact: PublicProfileContact): string {
    return `${contact.contact_type}-${contact.value}`;
}

export default function PublicProfilePage() {
    const { profileId } = useParams();
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [revealedContacts, setRevealedContacts] = useState<Set<string>>(new Set());
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [linksOpen, setLinksOpen] = useState(false);
    const [contactsOpen, setContactsOpen] = useState(false);

    function toggleContactReveal(key: string) {
        setRevealedContacts((prev) => {
            const next = new Set(prev);

            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }

            return next;
        });
    }

    async function handleCopyContact(key: string, value: string) {
        try {
            await navigator.clipboard.writeText(value);

            setCopiedKey(key);
            setTimeout(() => setCopiedKey((current) => (current === key ? null : current)), 1500);
        } catch {
            // clipboard unavailable -- the revealed tel:/mailto: link still works as a fallback
        }
    }

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
        return <div className={styles.profileNotFound}>{"Profile not found"}</div>;

    return (
        <div className={styles.publicProfilePage}>
            <div className={styles.publicProfileContent}>

                <div className={styles.avatarFrame}>
                    {profile.profile_image_url ? (
                        <img
                            src={profile.profile_image_url}
                            alt={`${profile.profile_name} profile picture`}
                            className={styles.publicProfileAvatar}
                        />
                    ) : (
                        <div className={styles.publicProfileAvatarFallback}>
                            {profile.profile_name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

            <h1>{profile.profile_name}</h1>

            {profile.subtitle && (
                <p className={styles.profileSubtitle}>{profile.subtitle}</p>
            )}

            {profile.organization && (
                <p className={styles.profileOrganization}>{profile.organization}</p>
            )}

            {profile.bio && (
                <p className={styles.profileBio}>{profile.bio}</p>
            )}

            <a
                href={getProfileVCardUrl(profile.profile_id)}
                className={styles.profileMainLink}
            >
                Save Contact
            </a>

            {profile.contact_info && profile.contact_info.length > 0 && (
                <section className={styles.profileSection}>
                    <h2 className={styles.sectionHeadingWrapper}>
                        <button
                            type="button"
                            className={styles.sectionHeading}
                            aria-expanded={contactsOpen}
                            aria-controls="public-profile-contacts"
                            onClick={() => setContactsOpen((open) => !open)}
                        >
                            Contact
                        </button>
                    </h2>

                    <div
                        id="public-profile-contacts"
                        className={`${styles.collapsible} ${contactsOpen ? styles.collapsibleOpen : ""}`}
                    >
                        <div className={styles.collapsibleInner}>
                            <div className={styles.profileContacts}>
                                {sortContactsPrimaryFirst(profile.contact_info).map((contact) => {
                                    const key = contactKey(contact);
                                    const title = contact.label || CONTACT_TYPE_LABELS[contact.contact_type];
                                    const isRevealed = revealedContacts.has(key);
                                    const valueId = `contact-value-${key}`;

                                    return (
                                        <div key={key} className={styles.contactItem}>
                                            <button
                                                type="button"
                                                className={`${styles.profileLink} ${styles.profileLinkButton}`}
                                                aria-expanded={isRevealed}
                                                aria-controls={valueId}
                                                onClick={() => toggleContactReveal(key)}
                                            >
                                                {title}
                                            </button>

                                            <div
                                                id={valueId}
                                                className={`${styles.collapsible} ${isRevealed ? styles.collapsibleOpen : ""}`}
                                            >
                                                <div className={styles.collapsibleInner}>
                                                    <div className={styles.contactValueRow}>
                                                        <a
                                                            href={`${contact.contact_type === "phone" ? "tel:" : "mailto:"}${contact.value}`}
                                                            className={styles.contactValueLink}
                                                        >
                                                            {contact.value}
                                                        </a>

                                                        <button
                                                            type="button"
                                                            className={styles.copyButton}
                                                            aria-label={copiedKey === key ? "Copied" : `Copy ${title.toLowerCase()}`}
                                                            onClick={() => handleCopyContact(key, contact.value)}
                                                        >
                                                            {copiedKey === key ? "✓" : "⧉"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {profile.links && profile.links.length > 0 && (
                <section className={styles.profileSection}>
                    <h2 className={styles.sectionHeadingWrapper}>
                        <button
                            type="button"
                            className={styles.sectionHeading}
                            aria-expanded={linksOpen}
                            aria-controls="public-profile-links"
                            onClick={() => setLinksOpen((open) => !open)}
                        >
                            Links
                        </button>
                    </h2>

                    <div
                        id="public-profile-links"
                        className={`${styles.collapsible} ${linksOpen ? styles.collapsibleOpen : ""}`}
                    >
                        <div className={styles.collapsibleInner}>
                            <div className={styles.profileLinks}>
                                {profile.links.map((link) => (
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
                </section>
            )}
        </div>
    </div>
    );
}