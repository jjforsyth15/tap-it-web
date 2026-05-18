import { useState} from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/authContext";

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const data = await loginUser(email, password);
            login(data.access_token);

            navigate("/dashboard");
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
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </label>

                    {error && <p className="error">{error}</p>}

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Log in"}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default LoginPage