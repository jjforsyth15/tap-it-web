import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "../../styles/ProfileManagementPage.module.css";
import type { ProfileLink } from "../../types/profile";

type SortableLinkCardProps = {
    link: ProfileLink;
    onDelete: (linkId: string) => void;
};

export default function SortableLinkCard({ link, onDelete }: SortableLinkCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.link_id });
    const sortableStyle = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

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
                aria-label={`Reorder ${link.label}`}
            >
                &#x2630;
            </button>

            <div className={styles.itemCardContent}>
                <h3>{link.label}</h3>

                <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.url}
                </a>
            </div>

            <button
                type="button"
                className={styles.dangerTextButton}
                onClick={() => onDelete(link.link_id)}
            >
                Delete
            </button>
        </article>
    );
}