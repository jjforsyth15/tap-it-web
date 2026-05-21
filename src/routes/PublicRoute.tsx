import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function PublicOnlyRoute() {
    const { isLoggedIn } = useAuth();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const next = searchParams.get("next") || location.pathname;

    if (isLoggedIn) {
        return <Navigate to={next || "/dashboard"} replace />;
    }

    return <Outlet />;
}

