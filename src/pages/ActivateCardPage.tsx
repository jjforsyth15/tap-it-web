import { useParams, useNavigate } from "react-router-dom";
import { activateCard, getCardActivationStatus } from "../api/cardApi";
import type { CardActivationStatus } from "../types/card";
import { useState, useEffect } from "react";
import styles from "../styles/ActivateCardPage.module.css";


export default function ActivateCardPage() {
    const { cardCode } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [card, setCard] = useState<CardActivationStatus | null>(null);
    const [activating, setActivating] = useState(false);
    const [success, setSuccess] = useState("");

    useEffect(() => {
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

        checkActivationStatus();
    }, [cardCode]);

    async function handleActivateCard() {
        if (!cardCode) {
            setError("Card code is missing");
            return;
        }

        setActivating(true);
        setError("");
        setSuccess("");

        try {
            setIsLoading(true);

            const data = await activateCard(cardCode);
            setSuccess("Card activated successfully! Redirecting to your profile...");

            setTimeout(() => {
                navigate(`/public/${data.profile_id}`);
            }, 1500);
        } catch (error) {
            console.error("Error activating card:", error);

            if (error instanceof Error) 
                setError(error.message);
            else 
                setError("Something went wrong while activating the card");

        } finally {
            setIsLoading(false);
            setActivating(false);
        }
    };

    if (isLoading) {
        return (
            <main className={styles.activatePage}>
                <section className={styles.activateCard}>
                    <h1>Loading card details...</h1>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main className={styles.activatePage}>
                <section className={styles.activateCard}>
                    <h1>Unable to activate card</h1>
                    <p className={styles.activateSubtitle}>{error}</p>
                </section>
            </main>
        );
    }

     if (success) {
        return (
            <main className={styles.activatePage}>
                <section className={styles.activateCard}>
                    <h1>Card Activated</h1>
                    <p className={styles.activateSubtitle}>{success}</p>
                </section>
            </main>
        );
    }

    return (
        <main className={styles.activatePage}>
            <section className={styles.activateCard}>
                <h1>Activate TapIt Card</h1>

                <p className={styles.activateSubtitle}>
                    This card is assigned to your account and is ready to be activated.
                </p>

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

                {success && <p className={styles.activateSubtitle}>{success}</p>}
                {error && <p className={styles.activateError}>{error}</p>}

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