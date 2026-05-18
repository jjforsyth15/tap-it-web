import { useEffect, useState } from "react";
import { getCurrentUser, type User } from "../api/userApi";

function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadUser() {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load user");
            } finally {
                setIsLoading(false);
            }
        }

        loadUser();
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <section>
            <h1>Dashboard</h1>

            {user && (
                <div>
                    <p>Welcome, {user.first_name}</p>
                </div>
            )}
        </section>
    );
}

export default DashboardPage;