import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Outlet } from "react-router-dom";
import BetaFeedback from "../components/beta-features/BetaFeedback";


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

                <h3 className="app-subtitle">Beta 1</h3>

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

            <footer className="app-footer">
                <p>&copy; 2026 TapIt. All rights reserved. Beta 1 - July 2026</p>
            </footer>

            <BetaFeedback />
        </>
    );
}

export default MainLayout