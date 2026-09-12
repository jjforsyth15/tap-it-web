import { useState} from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { loginUser, linkGoogleAccount } from "../api/authApi";
import { useAuth } from "../context/authContext";
import GoogleAuthButton, { isGoogleAuthEnabled } from "../components/auth/GoogleAuthButton";

function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [pendingGoogleCredential, setPendingGoogleCredential] = useState<string | null>(null);
    const next = searchParams.get("next")  || "/dashboard";

    const { login } = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const data = await loginUser(email, password);
            login(data.access_token);

            navigate(next);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
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
            const data = await loginUser(email, password);
            await linkGoogleAccount({ credential: pendingGoogleCredential }, data.access_token);

            login(data.access_token);
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
        <section className="auth-page">
            <div className="auth-card">
                <h1>Log in</h1>

                {pendingGoogleCredential ? (
                    <p className="auth-notice" role="status" aria-live="polite">
                        A TapIt account already exists for this Google email. Enter your TapIt email and password once to link Google.
                    </p>
                ) : isGoogleAuthEnabled && (
                    <>
                        <div className="auth-google">
                            <GoogleAuthButton
                                variant="login"
                                next={next}
                                onError={setError}
                                onLinkRequired={setPendingGoogleCredential}
                            />
                        </div>

                        <div className="auth-divider">or continue with email</div>
                    </>
                )}

                <form onSubmit={pendingGoogleCredential ? handleLinkGoogleAccount : handleSubmit} className="auth-form">
                    <label>
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button className="show-password-button"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </label>

                    <p className="auth-footer">
                        Don't have an account? 
                        <Link to={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="auth-link"> Register</Link>
                    </p>

                    {error && <p className="auth-error" role="alert">{error}</p>}

                    <button type="submit" disabled={isLoading}>
                        {pendingGoogleCredential
                            ? (isLoading ? "Linking..." : "Link account")
                            : (isLoading ? "Logging in..." : "Log in")}
                    </button>

                    {pendingGoogleCredential && (
                        <button type="button" className="auth-link" onClick={handleCancelLinking} disabled={isLoading}>
                            Cancel linking
                        </button>
                    )}
                </form>
            </div>
        </section>
    );
}

export default LoginPage