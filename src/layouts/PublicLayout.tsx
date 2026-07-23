import { Outlet } from "react-router-dom";
import BetaFeedback from "../components/beta-features/BetaFeedback";
import "../styles/global.css";

const PublicLayout = () => {
    return (
        <div className="publicLayout">

            <main className="publicContent">
                <Outlet />
            </main>

            <footer className="appFooter">
                <p>&copy; 2026 TapIt. All rights reserved. Beta 1 - July 2026</p>
            </footer>

            <BetaFeedback />
        </div>
    );
};

export default PublicLayout;