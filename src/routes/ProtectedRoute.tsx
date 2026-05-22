import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function ProtectedRoute() {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
    }

    return <Outlet />;
}

