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

    const next = searchParams.get("next");
    const { login } = useAuth();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const data = await loginUser(email, password);
            login(data.access_token);

            navigate(next || "/dashboard");
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
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
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
                        <Link to="/register" className="auth-link"> Register</Link>
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