import type { CardResponse } from '../../types/card'
import styles from '../../styles/ProfileManagementPage.module.css'

type ProfileCardsProps = {
    cards : CardResponse[];
}

export default function ProfileCards({ cards }: ProfileCardsProps) {
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
                            {cards.map(card => (
                                <article className={styles.itemCard} key={card.card_id}>
                                    <div>
                                        <h3>{card.card_name}</h3>
                                        <p className={styles.cardCode}>Card Code: {card.card_code}</p>
                                        <span
                                            className={`${styles.statusBadge} ${styles[`status${card.card_status}`]}`}
                                            >
                                                {card.card_status}
                                            </span>          
                                    </div>

                                    <button
                                        className={styles.dangerTextButton}
                                    >
                                        Deactivate
                                    </button>
                                </article>
                            ))}
                        </div>
                    )} 
            </section>
    )

}