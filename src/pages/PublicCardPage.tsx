import { useParams, useNavigate } from "react-router-dom";
import { use, useEffect, useState } from "react";
import type { PublicCardResponse } from "../types/card";
import { getPublicCard } from "../api/cardApi";

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
        if (cardData?.card_status === "inactive")
            navigate(`/activate-card/${cardData.card_code}`);

        if (cardData?.card_status === "active") 
            navigate(`/public/${cardData.profile_id}`);

        }, [cardData, navigate]);


    if (isLoading) 
        return <p>Loading...</p>;

    if (error) 
        return <p>{error}</p>;

    if (cardData?.card_status === "lost" || cardData?.card_status === "disabled" || cardData?.card_status === "deactivated") {
        return (
            <main>
                <h1>{cardData?.card_name}</h1>
                <p>This TapIt card is unavailable.</p>
            </main>
        );
    }

    return <p>Redirecting...</p>;
}

export default PublicCardPage;