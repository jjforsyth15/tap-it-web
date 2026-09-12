import { useState } from "react";
import { registerUser } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, linkGoogleAccount } from "../api/authApi";
import { useAuth } from "../context/authContext";
import { useSearchParams } from "react-router-dom";
import GoogleAuthButton, { isGoogleAuthEnabled } from "../components/auth/GoogleAuthButton";

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [pendingGoogleCredential, setPendingGoogleCredential] = useState<string | null>(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const next = searchParams.get("next") || "/dashboard";


    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await registerUser({
                email,
                password,
                first_name: firstName,
                last_name: lastName
            });

            const loginData = await loginUser(email, password);
            login(loginData.access_token);
            navigate(next);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to register. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleLinkGoogleAccount(e: React.FormEvent) {
        e.preventDefault();
        if (!pendingGoogleCredential) return;

        setIsLoading(true);
        setError("");

        try {
            const loginData = await loginUser(email, password);
            await linkGoogleAccount({ credential: pendingGoogleCredential }, loginData.access_token);

            login(loginData.access_token);
            navigate(next, { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to link Google account.");
        } finally {
            setIsLoading(false);
        }
    }

    function handleCancelLinking() {
        if (isLoading) return;

        setPendingGoogleCredential(null);
        setPassword("");
        setError("");
    }


    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Create account</h1>

                {pendingGoogleCredential ? (
                    <p className="auth-notice" role="status" aria-live="polite">
                        A TapIt account already exists for this Google email. Enter your TapIt email and password once to link Google.
                    </p>
                ) : isGoogleAuthEnabled && (
                    <>
                        <div className="auth-google">
                            <GoogleAuthButton
                                variant="signup"
                                next={next}
                                onError={setError}
                                onLinkRequired={setPendingGoogleCredential}
                            />
                        </div>

                        <div className="auth-divider">or continue with email</div>
                    </>
                )}

                <form onSubmit={pendingGoogleCredential ? handleLinkGoogleAccount : handleRegister} className="auth-form">
                    {!pendingGoogleCredential && (
                        <>
                            <input
                                className="auth-input"
                                type="text"
                                placeholder="First name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <input
                                className="auth-input"
                                type="text"
                                placeholder="Last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </>
                    )}
                    <input
                        className="auth-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="auth-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>

                    {error && <p className="auth-error" role="alert">{error}</p>}

                    <p className="auth-footer">
                        Already have an account? 
                        <Link to={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="auth-link"> Log in</Link>
                    </p>

                    <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="auth-button">
                        {pendingGoogleCredential
                            ? (isLoading ? "Linking..." : "Link account")
                            : (isLoading ? "Creating account..." : "Register")}
                    </button>

                    {pendingGoogleCredential && (
                        <button type="button" className="auth-link" onClick={handleCancelLinking} disabled={isLoading}>
                            Cancel linking
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default RegisterPage