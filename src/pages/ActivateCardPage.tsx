import { useParams, useNavigate } from "react-router-dom";
import { activateCard } from "../api/cardApi";
import { useState } from "react";


export default function ActivateCardPage() {
    const { cardCode } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleActivateCard() {
        if (!cardCode) {
            setError("Card code is missing");
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            const data = await activateCard(cardCode);

            navigate(`/public/${data.profile_id}`);            
        } catch (error) {
            console.error("Error activating card:", error);
            setError("Failed to activate card. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Activate Card</h1>

            <p>Card Code: {cardCode}</p>

            {error && <p>{error}</p>}
            
            <button onClick={handleActivateCard} disabled={isLoading}>
                {isLoading ? "Activating..." : "Activate this card"}
            </button>
        </div>
    );
}