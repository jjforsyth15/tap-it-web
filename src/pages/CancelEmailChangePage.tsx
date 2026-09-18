import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { cancelEmailChange } from "../api/userApi";

type CancellationStatus = "idle" | "loading" | "success" | "error";

function CancelEmailChangePage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<CancellationStatus>(token ? "loading" : "idle");
    const [error, setError] = useState("");
    const [attempt, setAttempt] = useState(0);
    const firedRequestKey = useRef<string | null>(null);

    useEffect(() => {
        if (!token) return;

        // Guards against React StrictMode's dev-only double-invoke of this effect,
        // which would otherwise submit this single-use token twice. Staleness is
        // checked against the ref itself (rather than a per-invocation "cancelled"
        // closure variable) so the original in-flight request can still update
        // state once it resolves, even though StrictMode's synthetic cleanup runs
        // before that -- a closure-scoped flag would wrongly look "cancelled" by then.
        const requestKey = `${token}:${attempt}`;
        if (firedRequestKey.current === requestKey) return;
        firedRequestKey.current = requestKey;

        const cancellationToken = token;

        async function runCancellation() {
            setStatus("loading");
            setError("");

            try {
                await cancelEmailChange(cancellationToken);
                if (firedRequestKey.current === requestKey) setStatus("success");
            } catch (err) {
                if (firedRequestKey.current === requestKey) {
                    setStatus("error");
                    setError(err instanceof Error ? err.message : "Failed to cancel email change. Please try again.");
                }
            }
        }

        void runCancellation();
    }, [token, attempt]);

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Cancel email change</h1>

                {status === "idle" && (
                    <p>This link is missing a cancellation token.</p>
                )}

                {status === "loading" && <p role="status" aria-live="polite">Cancelling this email change...</p>}

                {status === "success" && (
                    <>
                        <p className="auth-notice" role="status" aria-live="polite">
                            This email change has been cancelled. Your email address was not changed.
                        </p>
                        <p>
                            If you did not request this change, we recommend that you change your password to secure your account.
                        </p>
                    </>
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

export default CancelEmailChangePage;
