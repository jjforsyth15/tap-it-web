import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { PublicCardResponse } from "../types/card";
import { getPublicCard } from "../api/cardApi";
import styles from "../styles/PublicCardPage.module.css";
import BetaFeedback from "../components/beta-features/BetaFeedback";


function PublicCardPage() { 
    const { card_code } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [cardData, setCardData] = useState<PublicCardResponse | null>(null);

    useEffect(() => {
        async function fetchCard() {
            if (!card_code) {
                setError("Card code is missing");
                setIsLoading(false);
                return;
            }

            try {
                const data = await getPublicCard(card_code);
                setCardData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load card");
            } finally {
                setIsLoading(false);
            }
        }

        fetchCard();
    }, [card_code]);

    useEffect(() => {
        if (!cardData) return;

        if (cardData?.card_status === "inactive")
            navigate(`/activate-card/${cardData.card_code}`);

        if (cardData?.card_status === "active") 
            navigate(`/public/${cardData.profile_id}`);

        }, [cardData, navigate]);


    if (isLoading) 
        return (
            <main className={styles.publicCardPage}>
                <section className={styles.publicCardBox}>
                    <div className={styles.tapitLogo}>TapIt</div>
                    <div className={styles.loadingSpinner}/>
                    <h1>Loading card...</h1>
                    <p>Getting this TapIt card ready.</p>
                </section>
            </main>
        );

    if (error) 
        return (
            <main className={styles.publicCardPage}>
                <section className={styles.publicCardBox}>
                    <div className={styles.tapitLogo}>TapIt</div>
                    <h1>Unable to load card</h1>
                    <p>{error}</p>
                </section>
            </main>
        );

    if (cardData?.card_status === "lost" || cardData?.card_status === "disabled" || cardData?.card_status === "deactivated") {
        return (
            <main className={styles.publicCardPage}>
                <section className={styles.publicCardBox}>
                    <div className={styles.tapitLogo}>TapIt</div>
                    <h1>This card is unavailable</h1>

                    {cardData.card_name && <p className={styles.publicCardName}>{cardData.card_name}</p>}
                    <p>
                        This TapIt card is currently {cardData.card_status}.
                    </p>

                    <p className={styles.publicCardMuted}>
                        Please contact the card owner or support for more information.
                    </p>
                </section>
                <BetaFeedback />
            </main>
        );
    }

    return (
        <main className={styles.publicCardPage}>
            <section className={styles.publicCardBox}>
                <div className={styles.tapitLogo}>TapIt</div>
                <h1>Redirecting...</h1>
                <p>Taking you to the right place.</p>
            </section>
        </main>
    );            
}

export default PublicCardPage;