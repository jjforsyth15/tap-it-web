import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Outlet } from "react-router-dom";


function MainLayout() {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuth();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <>
            <header className="app-header">
                <Link to="/" className="app-nav">TapIt</Link>

                <nav className="app-nav">
                    {isLoggedIn ? (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <button onClick={handleLogout} className="logoutButton">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </nav>
            </header>
            <main className="app-main">
                <Outlet />
            </main>
        </>
    );
}

export default MainLayout