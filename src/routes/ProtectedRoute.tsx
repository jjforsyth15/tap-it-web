import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function ProtectedRoute() {
    const { isLoggedIn, isAuthLoading } = useAuth();

    if (isAuthLoading) {
        return (
            <main>
                <p>Loading...</p>
            </main>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
    }

    return <Outlet />;
}

