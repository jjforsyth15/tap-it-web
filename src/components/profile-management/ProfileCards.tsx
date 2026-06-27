import type { CardResponse } from '../../types/card'
import { useState } from 'react'
import styles from '../../styles/ProfileManagementPage.module.css'
import { updateCard, deactivateCard } from '../../api/cardApi'
import type { CardUpdateRequest } from '../../types/card'

type ProfileCardsProps = {
    cards : CardResponse[];
    setCards: React.Dispatch<React.SetStateAction<CardResponse[]>>;
    setSuccessMessage: (message: string) => void;
    setError: (message: string) => void;
}

export default function ProfileCards({ cards, setCards, setSuccessMessage, setError }: ProfileCardsProps) {
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [cardNameInput, setCardNameInput] = useState("");
    const [cardToDeactivate, setCardToDeactivate] = useState<CardResponse | null>(null);
    const [cardLost, setCardLost] = useState<CardResponse | null>(null);
    const [cardStatusToEdit, setCardStatusToEdit] = useState<CardResponse | null>(null);

    async function handleSaveCardName(cardId: string) {
        if (cardNameInput.trim() === "") {
            setError("Card name cannot be empty.");
            return;
        }

        const cardToUpdate: CardUpdateRequest = {
            card_name: cardNameInput,
        };

        try {
            const response = await updateCard(cardId, cardToUpdate);

            setCards(prevCards =>
                prevCards.map(card =>
                    card.card_id === cardId ? response.card : card
                )
            );

            setEditingCardId(null);
            setCardNameInput("");
            setSuccessMessage("Card name updated successfully.");
            setTimeout(() => setSuccessMessage(""), 3000);

        } catch (error) {
            setError("Failed to update card name. Please try again.");
            setTimeout(() => setError(""), 3000);
        }
    }

    async function handleDeactivateCard() {
        if (!cardToDeactivate) return;

        try {
            await deactivateCard(cardToDeactivate.card_id);

            setCards(prevCards =>
                prevCards.filter(card =>
                    card.card_id !== cardToDeactivate.card_id
                )
            );

            setCardToDeactivate(null);
            setSuccessMessage("Card deactivated successfully.");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            setError("Failed to deactivate card. Please try again.");
            setTimeout(() => setError(""), 3000);
        }
    }

    function handleCancelEditCard() {
        setEditingCardId(null);
        setCardNameInput("");
    }

    async function handleUpdateCardStatus(cardId: string, newStatus: string) {
        const cardToUpdate: CardUpdateRequest = {
            card_status: newStatus,
        };

        try {
            const response = await updateCard(cardId, cardToUpdate);

            if (newStatus === "deactivated" || newStatus === "lost") {
                setCards(prevCards =>
                    prevCards.filter(card => card.card_id !== cardId)
                );
            }
            else {
                setCards(prevCards =>
                    prevCards.map(card =>
                        card.card_id === cardId ? response.card : card
                    )
                );
            }

            setCardStatusToEdit(null);
            setSuccessMessage("Card status updated successfully.");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            setError("Failed to update card status. Please try again.");
            setTimeout(() => setError(""), 3000);
        }
    }
    
    return (
        <section className={styles.itemPanel}>
                <div className={styles.sectionHeader}>
                    <div>
                        <h2>Cards - {cards.length}</h2>
                        <p>Manage the cards associated with this profile.</p>
                    </div>
                    
                    <button
                        className={styles.primaryButton}
                    >
                        + Request New Card
                    </button>
                </div>

                {cards.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h3>No cards added yet</h3>
                        <p>Add your first card to start sharing this profile.</p>
                    </div>
                    ) : (
                        <div className={styles.itemList}>
                            {cards.map(card => {
                                const isEditing = editingCardId === card.card_id;

                                return (
                                    <article className={styles.itemCard} key={card.card_id}>
                                        <div>
                                            {isEditing ? (
                                                <input
                                                    className={styles.inlineEditInput}
                                                    value={cardNameInput}
                                                    onChange={(e) => setCardNameInput(e.target.value)}
                                                />
                                            ) : (
                                                <h3>{card.card_name}</h3>
                                            )}

                                            <p className={styles.cardCode}>
                                                Card Code: {card.card_code}
                                            </p>

                                            <button
                                                className={`${styles.statusBadgeButton} ${styles[`status${card.card_status}`]}`}
                                                onClick={() => setCardStatusToEdit(card)}
                                            >
                                                {card.card_status}
                                            </button>
                                        </div>

                                        <div className={styles.itemActions}>
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        className={styles.editBioButton}
                                                        onClick={() => handleSaveCardName(card.card_id)}
                                                    >
                                                        Save
                                                    </button>

                                                    <button
                                                        className={styles.editBioButton}
                                                        onClick={() => handleCancelEditCard()}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className={styles.editBioButton}
                                                        onClick={() => {
                                                            setEditingCardId(card.card_id);
                                                            setCardNameInput(card.card_name);
                                                        }}
                                                    >
                                                        Edit Name
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </article>
                                );
                            }
                            )}
                        </div>
                    )
                }

                {cardStatusToEdit && (
                    <div className={styles.modalBackdrop}>
                        <div className={styles.confirmModal}>
                            <h3>Change Card Status</h3>

                            <p>
                                Choose a new status for the card: <strong>{cardStatusToEdit.card_name}</strong>
                            </p>

                            <div className={styles.statusOptionList}>
                                <button
                                    className={styles.statusOptionButton}
                                    onClick={() => setCardToDeactivate(cardStatusToEdit)}
                                >
                                    Inactive
                                </button>

                                <button
                                    className={styles.statusOptionButton}
                                    onClick={() => setCardLost(cardStatusToEdit)}
                                >
                                    Lost
                                </button>
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setCardStatusToEdit(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {cardToDeactivate && (
                    <div className={styles.modalBackdrop}>
                        <div className={styles.confirmModal}>
                            <h3>Deactivate Card?</h3>

                            <p>This will deactivate <strong>{cardToDeactivate.card_name}</strong> and stop it from pointing to your profile until it is reactivated.</p>

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setCardToDeactivate(null)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className={styles.deleteConfirmButton}
                                    onClick={() => handleUpdateCardStatus(cardToDeactivate.card_id, "deactivated")}
                                >
                                    Deactivate
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {cardLost && (
                    <div className={styles.modalBackdrop}>
                        <div className={styles.confirmModal}>
                            <h3>Mark Card as Lost?</h3>

                            <p>This will mark <strong>{cardLost.card_name}</strong> as lost and stop it from pointing to your profile until it is found.</p>

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setCardLost(null)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className={styles.deleteConfirmButton}
                                    onClick={() => handleUpdateCardStatus(cardLost.card_id, "lost")}
                                >
                                    Mark as Lost
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </section>
    );
}