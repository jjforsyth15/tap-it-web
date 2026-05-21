import { useParams, useNavigate } from "react-router-dom";
import { activateCard } from "../api/cardApi";
import { useState } from "react";
import "../styles/ActivateCardPage.css";


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

            if (error instanceof Error) 
                setError(error.message);
            else 
                setError("Something went wrong while activating the card");

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="activate-page">
            <div className="activate-card">
                <h1>Activate Card</h1>

                <p className="activate-subtitle">
                    Press activate to activate this card and link it to your profile. You can then share your profile with others so they can tap your card and connect with you!
                </p>

                <div className="card-code-box">
                    <p className="card-code-label">Card Code:</p>
                    <p className="card-code">{cardCode}</p>
                </div>

            {error && (
                <p className="activate-error">{error}</p>
            )}

            <button 
                onClick={handleActivateCard} 
                disabled={isLoading}
                className="activate-button"
            >
                {isLoading ? "Activating..." : error ? "Try Again" : "Activate this card"}
            </button>
        </div>
    </div>
    );
}