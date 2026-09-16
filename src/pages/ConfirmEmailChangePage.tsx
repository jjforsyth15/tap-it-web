import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { confirmEmailChange } from "../api/userApi";

type ConfirmationStatus = "idle" | "loading" | "success" | "error";

function ConfirmEmailChangePage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<ConfirmationStatus>(token ? "loading" : "idle");
    const [error, setError] = useState("");
    const [attempt, setAttempt] = useState(0);
    const firedRequestKey = useRef<string | null>(null);

    useEffect(() => {
        if (!token) return;

        // Guards against React StrictMode's dev-only double-invoke of this effect,
        // which would otherwise submit this single-use token twice.
        const requestKey = `${token}:${attempt}`;
        if (firedRequestKey.current === requestKey) return;
        firedRequestKey.current = requestKey;

        const confirmationToken = token;
        let cancelled = false;

        async function runConfirmation() {
            setStatus("loading");
            setError("");

            try {
                await confirmEmailChange(confirmationToken);
                if (!cancelled) setStatus("success");
            } catch (err) {
                if (!cancelled) {
                    setStatus("error");
                    setError(err instanceof Error ? err.message : "Failed to confirm email change. Please try again.");
                }
            }
        }

        void runConfirmation();

        return () => {
            cancelled = true;
        };
    }, [token, attempt]);

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Confirm email change</h1>

                {status === "idle" && (
                    <p>This link is missing a confirmation token.</p>
                )}

                {status === "loading" && <p role="status" aria-live="polite">Confirming your new email address...</p>}

                {status === "success" && (
                    <p className="auth-notice" role="status" aria-live="polite">
                        Your email address has been changed.
                    </p>
                )}

                {error && <p className="auth-error" role="alert">{error}</p>}

                {status === "error" && token && (
                    <button
                        type="button"
                        className="auth-button"
                        onClick={() => setAttempt((n) => n + 1)}
                    >
                        Try Again
                    </button>
                )}

                <p className="auth-footer">
                    <Link to="/login" className="auth-link">Back to Log in</Link>
                </p>
            </div>
        </div>
    );
}

export default ConfirmEmailChangePage;
