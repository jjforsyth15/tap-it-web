import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ProfileCard from "./ProfileCard";
import type { DashboardProfile } from "../../types/profile";
import styles from "../../styles/DashboardPage.module.css";

type SortableProfileCardProps = {
    profile: DashboardProfile;
}

export default function SortableProfileCard({ profile }: SortableProfileCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: profile.profile_id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <article
            ref={setNodeRef}
            style={style}
            className={`${styles.sortableProfileCard} ${isDragging ? styles.draggingProfileCard : ""}`}
        >
            <div
                className={styles.profileDragHandle}
                {...attributes}
                {...listeners}
                aria-label={`Reorder ${profile.profile_name}`}
            >
                <ProfileCard profile={profile} />
            </div>

            
        </article>
    );
}