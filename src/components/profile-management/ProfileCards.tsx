import type { CardResponse } from '../../types/card'
import { useState } from 'react'
import styles from '../../styles/ProfileManagementPage.module.css'
import { updateCard } from '../../api/cardApi'
import type { CardUpdateRequest } from '../../types/card'
import type { Profile } from '../../types/profile'

type ProfileCardsProps = {
    cards : CardResponse[];
    profiles: Profile[];
    setCards: React.Dispatch<React.SetStateAction<CardResponse[]>>;
    setSuccessMessage: (message: string) => void;
    setError: (message: string) => void;
}

export default function ProfileCards({ cards, profiles, setCards, setSuccessMessage, setError }: ProfileCardsProps) {
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [cardNameInput, setCardNameInput] = useState("");
    const [cardToDeactivate, setCardToDeactivate] = useState<CardResponse | null>(null);
    const [cardLost, setCardLost] = useState<CardResponse | null>(null);
    const [cardStatusToEdit, setCardStatusToEdit] = useState<CardResponse | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [cardToReassign, setCardToReassign] = useState<CardResponse | null>(null);
    const [newProfileId, setNewProfileId] = useState("");


    async function handleSaveCardName(cardId: string) {
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (cardNameInput.trim() === "") {
            setError("Card name cannot be empty.");
            return;
        }

        if (cardNameInput.length > 50) {
            setError("Card name cannot exceed 50 characters.");
            return;
        }

        if (cardNameInput === cards.find(card => card.card_id === cardId)?.card_name) {
            setEditingCardId(null);
            setCardNameInput("");
            setIsSubmitting(false);
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
            setIsSubmitting(false);
            setError(error instanceof Error ? error.message : "Failed to update card name. Please try again.");
            setTimeout(() => setError(""), 3000);
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleCancelEditCard() {
        if (isSubmitting) return;
        setEditingCardId(null);
        setCardNameInput("");
    }

    async function handleUpdateCardStatus(cardId: string, newStatus: string) {
        if (isSubmitting) return;
        setIsSubmitting(true);

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
            setCardToDeactivate(null);
            setCardLost(null);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            setIsSubmitting(false);
            setError(error instanceof Error ? error.message : "Failed to update card status. Please try again.");
            setTimeout(() => setError(""), 3000);
        } finally {
            setIsSubmitting(false);
        }
    }


    async function handleReassignCard(cardId: string, newProfileId: string) {
        if (isSubmitting) return;
        setIsSubmitting(true);
        
        const cardToUpdate: CardUpdateRequest = {
            profile_id: newProfileId,
        };

        try {
            await updateCard(cardId, cardToUpdate);

            setCards(currentCards =>
                currentCards.filter(currentCard =>
                    currentCard.card_id !== cardId
                )
            );

            setSuccessMessage(`Card reassigned to profile successfully.`);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            setIsSubmitting(false);
            setError(error instanceof Error ? error.message : "Failed to reassign card. Please try again.");
            setTimeout(() => setError(""), 3000);
        } finally {
            setIsSubmitting(false);
            setCardToReassign(null);
            setNewProfileId("");
        }
    }

    return (
        <section className={styles.itemPanel}>
                <div className={styles.sectionHeader}>
                    <div>
                        <h2>Cards - {cards.length}</h2>
                        <p>Manage the cards associated with this profile.</p>
                    </div>
                    
                    {/* <button
                        className={styles.primaryButton}
                    >
                        + Request New Card
                    </button> */}
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
                                                disabled={isSubmitting}
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
                                                        disabled={isSubmitting}
                                                        onClick={() => handleSaveCardName(card.card_id)}
                                                    >
                                                        Save
                                                    </button>

                                                    <button
                                                        className={styles.editBioButton}
                                                        disabled={isSubmitting}
                                                        onClick={() => handleCancelEditCard()}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className={styles.editBioButton}
                                                        disabled={isSubmitting}
                                                        onClick={() => {
                                                            setEditingCardId(card.card_id);
                                                            setCardNameInput(card.card_name);
                                                        }}
                                                    >
                                                        Edit Name
                                                    </button>

                                                    <button
                                                        className={styles.editBioButton}
                                                        disabled={isSubmitting}
                                                        onClick={() => {
                                                            setCardToReassign(card);
                                                        }}
                                                    >
                                                        Reassign
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

                {cardToReassign && (
                    <div className={styles.modalBackdrop}>
                        <div className={styles.confirmModal}>
                            <h3>Reassign Card</h3>
                            <p>
                                Choose a new profile to reassign <strong>{cardToReassign.card_name}</strong> to:
                            </p>

                            <select
                                className={styles.modalSelect}
                                value={newProfileId}
                                onChange={(e) => setNewProfileId(e.target.value)}
                            >
                                <option value="">Select a profile</option>

                                {profiles.filter(profile => 
                                        profile.profile_id !== cardToReassign.profile_id
                                    ).map(profile => (
                                        <option 
                                            key={profile.profile_id} 
                                            value={profile.profile_id}
                                        >
                                            {profile.profile_name}
                                        </option>
                                    ))}
                            </select>

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    disabled={isSubmitting}
                                    onClick={() => {
                                        setCardToReassign(null)
                                        setNewProfileId("");
                                        setIsSubmitting(false);
                                        }
                                    }
                                >
                                    Cancel
                                </button>

                                <button 
                                    className={styles.primaryButton}
                                    disabled={!newProfileId || isSubmitting}
                                    onClick={() => {
                                        handleReassignCard(cardToReassign.card_id, newProfileId);
                                    }}
                                >
                                    Reassign
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                                    disabled={isSubmitting}
                                    onClick={() => setCardToDeactivate(cardStatusToEdit)}
                                >
                                    Inactive
                                </button>

                                <button
                                    className={styles.statusOptionButton}
                                    disabled={isSubmitting}
                                    onClick={() => setCardLost(cardStatusToEdit)}
                                >
                                    Lost
                                </button>
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    disabled={isSubmitting}
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
                                    disabled={isSubmitting}
                                    onClick={() => setCardToDeactivate(null)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className={styles.deleteConfirmButton}
                                    disabled={isSubmitting}
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
                                    disabled={isSubmitting}
                                    onClick={() => setCardLost(null)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className={styles.deleteConfirmButton}
                                    disabled={isSubmitting}
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