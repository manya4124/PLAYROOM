import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(event) {
        event.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "https://playroom-backend-p97v.onrender.com/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed.");
                return;
            }

            // Save login information
            localStorage.setItem(
                "playroomToken",
                data.token
            );

            localStorage.setItem(
                "playroomUser",
                JSON.stringify(data.user)
            );

            // Go to Playroom
            navigate("/playroom");

        } catch (error) {
            console.error(error);

            setError(
                "Cannot connect to the server. Make sure the PLAYROOM backend is running."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">

            <div className="auth-decoration decoration-one">
                ✦
            </div>

            <div className="auth-decoration decoration-two">
                ★
            </div>

            <div className="auth-card">

                <div className="auth-logo">
                    🎮
                </div>

                <h1>PLAYROOM</h1>

                <p className="auth-subtitle">
                    Welcome back, gamer! 💗
                </p>

                {error && (
                    <div
                        style={{
                            background: "#ffd6eb",
                            border: "2px solid #30233d",
                            borderRadius: "12px",
                            padding: "10px",
                            marginBottom: "18px",
                            fontWeight: "700"
                        }}
                    >
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <div className="password-wrapper">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />

                            <button
                                type="button"
                                className="show-password"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="primary-btn auth-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "⏳ LOGGING IN..."
                            : "🔐 LOGIN"}
                    </button>

                </form>

                <div className="divider">
                    <span>OR</span>
                </div>

                <p className="switch-text">

                    Don't have an account?

                    <Link to="/signup">
                        Create one
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default login;
