import { type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";


type MainLayoutProps = {
    children: ReactNode;
};

function MainLayout({ children }: MainLayoutProps) {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuth();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <div>
            <header className="app-header">
                <Link to="/" className="app-nav">TapIt</Link>

                <nav className="app-nav">
                    {isLoggedIn ? (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <button onClick={handleLogout}>Logout</button>  
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </nav>
            </header>
            <main className="app-main">{children}</main>
        </div>
    );
}

export default MainLayout