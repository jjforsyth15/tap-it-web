import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/authApi";
import styles from "../styles/ResetPasswordPage.module.css";

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isLoading) return;

        setError("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!token) return;

        setIsLoading(true);

        try {
            await resetPassword(token, newPassword);
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to reset password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    if (!token) {
        return (
            <div className="auth-page">
                <div className="auth-card">
                    <h1>Reset password</h1>

                    <p>This link is missing a reset token.</p>

                    <p className="auth-footer">
                        <Link to="/forgot-password" className="auth-link">Request a new link</Link>
                    </p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-card">
                    <h1>Reset password</h1>

                    <p className="auth-notice" role="status" aria-live="polite">
                        Your password has been reset.
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
                <h1>Reset password</h1>

                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        className="auth-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className={styles.toggleButton}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>

                    <input
                        className="auth-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    {error && <p className="auth-error" role="alert">{error}</p>}

                    <p className="auth-footer">
                        <Link to="/forgot-password" className="auth-link">Request a new link</Link>
                    </p>

                    <button type="submit" disabled={isLoading} className="auth-button">
                        {isLoading ? "Resetting..." : "Reset password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPasswordPage
