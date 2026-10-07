import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleSignup(event) {

        event.preventDefault();

        setError("");


        if (
            !name ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            setError(
                "Please fill in all fields."
            );

            return;
        }


        if (password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;
        }


        if (password !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        try {

            setLoading(true);


            const response =
                await fetch(
                    "http://localhost:5000/api/auth/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            password
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                setError(
                    data.message ||
                    "Registration failed."
                );

                return;
            }


            /*
                Save the login information
                returned by our backend.
            */

            localStorage.setItem(
                "playroomToken",
                data.token
            );


            localStorage.setItem(
                "playroomUser",
                JSON.stringify(data.user)
            );


            /*
                Account created successfully.
            */

           navigate("/playroom");

        }

        catch (error) {

            console.error(error);

            setError(
                "Cannot connect to the server. Make sure the PLAYROOM backend is running."
            );

        }

        finally {

            setLoading(false);

        }

    }


    return (

        <div className="auth-page">

            <div className="auth-decoration decoration-one">
                ✦
            </div>

            <div className="auth-decoration decoration-two">
                ♡
            </div>


            <div className="auth-card signup-card">

                <div className="auth-logo">
                    🎮
                </div>


                <h1>
                    JOIN PLAYROOM
                </h1>


                <p className="auth-subtitle">
                    Create your gamer account! ✨
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


                <form onSubmit={handleSignup}>

                    <div className="form-group">

                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
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
                                placeholder="Create a password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                            />


                            <button
                                type="button"
                                className="show-password"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >

                                {showPassword
                                    ? "🙈"
                                    : "👁️"}

                            </button>

                        </div>

                    </div>


                    <div className="form-group">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <button
                        type="submit"
                        className="primary-btn auth-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "⏳ CREATING..."
                            : "✨ CREATE ACCOUNT"}

                    </button>

                </form>


                <div className="divider">
                    <span>OR</span>
                </div>


                <p className="switch-text">

                    Already have an account?

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Signup;