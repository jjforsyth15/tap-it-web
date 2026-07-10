import { useState} from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/authContext";

function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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

    return (
        <section className="auth-page">
            <div className="auth-card">
                <h1>Log in</h1>

                <form onSubmit={handleSubmit} className="auth-form">
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

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Log in"}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default LoginPage