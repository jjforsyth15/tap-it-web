import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/authApi";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        setError("");

        try {
            await forgotPassword(email);
            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send reset email. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    if (submitted) {
        return (
            <div className="auth-page">
                <div className="auth-card">
                    <h1>Check your email</h1>

                    <p className="auth-notice" role="status" aria-live="polite">
                        If an account with that email exists, we've sent a password reset link. Please check your inbox.
                    </p>

                    <p className="auth-footer">
                        <Link to="/login" className="auth-link">Back to Log in</Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Forgot password</h1>

                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        className="auth-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {error && <p className="auth-error" role="alert">{error}</p>}

                    <p className="auth-footer">
                        <Link to="/login" className="auth-link">Back to Log in</Link>
                    </p>

                    <button type="submit" disabled={isLoading} className="auth-button">
                        {isLoading ? "Sending..." : "Send reset link"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordPage
