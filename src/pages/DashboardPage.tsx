import { useEffect, useState } from "react";
import { getCurrentUser} from "../api/userApi";
import type { User } from "../types/user";
import type { Profile } from "../types/profile";
import { getMyProfiles, reorderProfiles } from "../api/profileApi";
import { useNavigate } from "react-router-dom";
import styles from "../styles/DashboardPage.module.css";
import ProfileCard from "../components/dashboard/ProfileCard";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";

import SortableProfileCard from "../components/dashboard/SortableProfileCards";
import CreateProfileCard from "../components/dashboard/CreateProfileCard";

function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [profiles, setProfiles] = useState<Profile[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function loadUser() {
            try {
                const [userData, profileData] = await Promise.all([
                    getCurrentUser(),
                    getMyProfiles()
                ]);
                setUser(userData);
                setProfiles(profileData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load dashboard");
            } finally {
                setIsLoading(false);
            }
        }

        loadUser();
    }, []);

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if(!over || active.id === over.id) return;

        const oldIndex = profiles.findIndex(profile => profile.profile_id === active.id);
        const newIndex = profiles.findIndex(profile => profile.profile_id === over.id);

        const reorderedProfiles = arrayMove(profiles, oldIndex, newIndex);

        setProfiles(reorderedProfiles);

        try { 
            await reorderProfiles(reorderedProfiles.map((profile, index) => ({
                profile_id: profile.profile_id,
                display_order: index,
            })));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to reorder profiles");
        }
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <section className={styles.dashboardPage}>
            <h1>Dashboard</h1>

            {user && (
                <>
                    <h2>My Profiles</h2>

                    <div className={styles.profileGrid}>

                        <CreateProfileCard />

                        <DndContext
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={profiles.map(profile => profile.profile_id)}
                                strategy={rectSortingStrategy}
                            >
                                {profiles.map(profile => (
                                    <SortableProfileCard
                                        key={profile.profile_id}
                                        profile={profile}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>
                </>
            )}
        </section>
    );
}

export default DashboardPage;