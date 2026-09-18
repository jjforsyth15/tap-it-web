import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

function AdminRoute() {
    const { user, isAuthLoading } = useAuth();

    if (isAuthLoading) 
        return (
            <main>
                <p>Checking admin access...</p>
            </main>
        );

    if (user?.user_type !== "admin") 
        return <Navigate to="/dashboard" replace />;

    return <Outlet />;
}

export default AdminRoute;