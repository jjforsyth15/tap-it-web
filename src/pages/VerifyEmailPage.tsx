import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../api/authApi";

type VerificationStatus = "idle" | "loading" | "success" | "error";

function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<VerificationStatus>(token ? "loading" : "idle");
    const [error, setError] = useState("");
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!token) return;

        const verificationToken = token;
        let cancelled = false;

        async function runVerification() {
            setStatus("loading");
            setError("");

            try {
                await verifyEmail(verificationToken);
                if (!cancelled) setStatus("success");
            } catch (err) {
                if (!cancelled) {
                    setStatus("error");
                    setError(err instanceof Error ? err.message : "Failed to verify email. Please try again.");
                }
            }
        }

        void runVerification();

        return () => {
            cancelled = true;
        };
    }, [token, attempt]);

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Verify your email</h1>

                {status === "idle" && (
                    <p>This link is missing a verification token.</p>
                )}

                {status === "loading" && <p role="status" aria-live="polite">Verifying your email...</p>}

                {status === "success" && (
                    <p className="auth-notice" role="status" aria-live="polite">
                        Your email has been verified.
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

export default VerifyEmailPage;
