import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Outlet } from "react-router-dom";
import BetaFeedback from "../components/beta-features/BetaFeedback";
import styles from "../styles/MainLayout.module.css";

function MainLayout() {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuth();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <>
            <header className={styles.appHeader}>
                <Link to="/" className={styles.appBrand}>
                    TapIt
                </Link>

                {/* <h3 className={styles.appSubtitle}>Beta 1</h3> */}

                <nav className={styles.appNav}>
                    {isLoggedIn ? (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <button type="button" onClick={handleLogout} className={styles.logoutButton}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <div className={styles.appNavLink}>
                                <Link to="/login">Login</Link>
                                <Link to="/register">Register</Link>
                            </div>
                        </>
                    )}
                </nav>
            </header>
            <main className={styles.appMain}>
                <Outlet />
            </main>

            <footer className={styles.appFooter}>
                <p>&copy; 2026 TapIt. All rights reserved. Beta 1 - July 2026</p>
            </footer>

            <BetaFeedback />
        </>
    );
}

export default MainLayout