import { useState } from "react";
import { registerUser } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/authContext";
import { useSearchParams } from "react-router-dom";

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
            if (err instanceof Error) {
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Create account</h1>

                <form onSubmit={handleRegister} className="auth-form">
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

                    {error && <p className="auth-error">{error}</p>}

                    <p className="auth-footer">
                        Already have an account? 
                        <Link to={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="auth-link"> Log in</Link>
                    </p>

                    <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="auth-button">
                        {isLoading ? "Creating account..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage