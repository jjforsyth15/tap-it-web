import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "../../styles/ProfileManagementPage.module.css";
import type { ProfileContact } from "../../types/profile";

type SortableContactCardProps = {
    contact: ProfileContact;
    isSubmitting: boolean;
    onDelete: (contactId: string) => void;
    onEdit: (contact: ProfileContact) => void;
    onSetPrimary: (contactId: string) => void;
};

const CONTACT_TYPE_LABELS: Record<ProfileContact["contact_type"], string> = {
    phone: "Phone",
    email: "Email",
};

export default function SortableContactCard({ contact, isSubmitting, onDelete, onEdit, onSetPrimary }: SortableContactCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: contact.contact_id });
    const sortableStyle = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

    const title = contact.label || CONTACT_TYPE_LABELS[contact.contact_type];

    return (
        <article
            ref={setNodeRef}
            style={sortableStyle}
            className={`${styles.itemCard} ${isDragging ? styles.draggingItem : ""}`}
        >
            <button
                type="button"
                className={styles.dragHandle}
                {...attributes}
                {...listeners}
                aria-label={`Reorder ${title}`}
            >
                &#x2630;
            </button>

            <div className={styles.itemCardContent}>
                <div className={styles.itemCardTitleRow}>
                    <h3>{title}</h3>
                    {contact.is_primary && <span className={styles.primaryBadge}>Primary</span>}
                </div>

                <p className={styles.cardCode}>{CONTACT_TYPE_LABELS[contact.contact_type]} · {contact.value}</p>
            </div>

            <div className={styles.itemCardActions}>
                {!contact.is_primary && (
                    <button
                        type="button"
                        className={styles.textActionButton}
                        disabled={isSubmitting}
                        onClick={() => onSetPrimary(contact.contact_id)}
                    >
                        Set primary
                    </button>
                )}

                <button
                    type="button"
                    className={styles.textActionButton}
                    disabled={isSubmitting}
                    onClick={() => onEdit(contact)}
                >
                    Edit
                </button>

                <button
                    type="button"
                    className={styles.dangerTextButton}
                    disabled={isSubmitting}
                    onClick={() => onDelete(contact.contact_id)}
                >
                    Delete
                </button>
            </div>
        </article>
    );
}
