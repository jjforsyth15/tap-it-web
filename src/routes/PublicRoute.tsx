import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function PublicOnlyRoute() {
    const { isLoggedIn } = useAuth();

    if (isLoggedIn) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

