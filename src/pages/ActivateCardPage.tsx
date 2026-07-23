import { useParams, useNavigate } from "react-router-dom";
import { activateCard, getCardActivationStatus } from "../api/cardApi";
import type { CardActivationStatus } from "../types/card";
import type { Profile } from "../types/profile";
import { useState, useEffect } from "react";
import styles from "../styles/ActivateCardPage.module.css";
import { getMyProfiles } from "../api/profileApi";
import { useTimeoutMessage } from "../utils/messaging";


export default function ActivateCardPage() {
    const { cardCode } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [card, setCard] = useState<CardActivationStatus | null>(null);
    const [activating, setActivating] = useState(false);

    const {
        message: successMessage,
        showMessage: showSuccessMessage
    } = useTimeoutMessage(3000);

    const [profiles, setProfiles] = useState<Profile[] | null>([]);
    const [selectedProfileId, setSelectedProfileId] = useState("");
    const [assignedProfile, setAssignedProfile] = useState<Profile | null>(null);

    const [loadingProfiles, setLoadingProfiles] = useState(false);

    useEffect(() => {
        loadProfiles();
        checkActivationStatus();
    }, [cardCode]);

    useEffect(() => {
        if (!card?.profile_id || profiles?.length === 0) return;

        const profileData = profiles?.find(p => p.profile_id === card?.profile_id) || null;

        setAssignedProfile(profileData);
        setSelectedProfileId(profileData?.profile_id || "");
    }, [card, profiles]);

    async function loadProfiles() {
            try {
                setLoadingProfiles(true);
                const profileData = await getMyProfiles();
                setProfiles(profileData)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load profiles");
            } finally {
                setLoadingProfiles(false);
            }
        }

    async function checkActivationStatus() {
        if (!cardCode) {
            setError("Missing card code");
            setIsLoading(false);
            return;
        }

        try {
            const activateStatus = await getCardActivationStatus(cardCode);
            setCard(activateStatus);
        } catch (err) {
            err instanceof Error ? setError(err.message) : setError("Unable to load card activation details");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleActivateCard() {
        if (!cardCode) {
            setError("Card code is missing");
            return;
        }

        if (!selectedProfileId) {
            setError("Please select a profile to activate this card");
            return;
        }

        setActivating(true);
        setError("");

        try {
            setIsLoading(true);

            const data = await activateCard({card_code: cardCode, new_profile_id: selectedProfileId});
            showSuccessMessage("Card activated successfully! Redirecting to your profile...");

            setTimeout(() => {
                navigate(`/dashboard/profiles/${data.card.profile_id}`);
            }, 1500);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to activate card");
        } finally {
            setIsLoading(false);
            setActivating(false);
        }
    };

    if (isLoading || loadingProfiles) {
        return (
            <main className={styles.activatePage}>
                <section className={styles.activateCard}>
                    <h1>Loading card details...</h1>
                </section>
            </main>
        );
    }

     if (successMessage) {
        return (
            <main className={styles.activatePage}>
                <section className={styles.activateCard}>
                    <h1>Card Activated</h1> 
                    <p className={styles.activateSubtitle}>{successMessage}</p>
                </section>
            </main>
        );
    }

    if (!profiles?.length) {
        return (
            <main className={styles.activatePage}>
                <section className={styles.activateCard}>
                    <h1>Create a profile first</h1>
                    <p className={styles.description}>You don't have any profiles yet. Please create a profile to activate your card.</p>

                    <button 
                        className={styles.activateButton}
                        onClick={() => {
                        navigate(`/profiles/new?next=${encodeURIComponent(location.pathname)}`)
                    }}>
                        Create Profile
                    </button>
                </section>
            </main>
        );
    }

    return (
        <main className={styles.activatePage}>
            <section className={styles.activateCard}>
                <h1 className={styles.eyebrow}>Activate TapIt Card</h1>
                
                {card?.profile_id && (
                    <p className={styles.activateSubtitle}>
                        This card is assigned to <strong>{assignedProfile?.profile_name}</strong> and is ready to be activated.
                    </p>
                )}


                {!card?.profile_id && !assignedProfile && (
                    <>
                    <p className={styles.activateSubtitle}>
                        Please select a profile or create a new one to activate this card.
                    </p>

                    <select
                        className={styles.profileSelect}
                        value={selectedProfileId}
                        onChange={(e) => setSelectedProfileId(e.target.value)}
                        >
                        <option value="">Select a profile</option>
                        {profiles?.map((profile) => (
                            <option key={profile.profile_id} value={profile.profile_id}>
                                {profile.profile_name}
                            </option>
                        ))}
                        </select>
                    </>
                )}
                

                <div className={styles.cardCodeBox}>
                    <p className={styles.cardCodeLabel}>Card Code:</p>
                    <p className={styles.cardCode}>{card?.card_code}</p>
                </div>

                {card?.card_name && (
                    <div className={styles.cardCodeBox}>
                        <p className={styles.cardCodeLabel}>Card Name:</p>
                        <p className={styles.cardCode}>{card?.card_name}</p>
                    </div>
                )}

                {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                {error && <p className={styles.errorMessage}>{error}</p>}

                {card?.can_activate && (
                        <button 
                            className={styles.activateButton}
                            onClick={handleActivateCard} 
                            disabled={activating}
                        >
                            {activating ? "Activating..." : error ? "Try Again" : "Activate this card"}
                        </button>
                )}
        </section>
    </main>
    );
}