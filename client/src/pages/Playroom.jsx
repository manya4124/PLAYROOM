import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Playroom() {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        return JSON.parse(
            localStorage.getItem("playroomUser") || "{}"
        );
    });

    const [leaderboard, setLeaderboard] = useState([]);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

    const games = [
        {
            icon: "🃏",
            name: "Memory Match",
            description: "Test your memory!",
            path: "/games/memory.html"
        },
        {
            icon: "❌⭕",
            name: "Tic Tac Toe",
            description: "Beat your opponent!",
            path: "/games/tictactoe.html"
        },
        {
            icon: "🎯",
            name: "Reaction Rush",
            description: "How fast are you?",
            path: "/games/reaction.html"
        },
        {
            icon: "✊",
            name: "Rock Paper Scissors",
            description: "Choose your move!",
            path: "/games/rps.html"
        },
        {
            icon: "🔤",
            name: "Word Scramble",
            description: "Unscramble the word!",
            path: "/games/word-scramble.html"
        }
    ];

    useEffect(() => {
        loadLeaderboard();
    }, []);

    async function loadLeaderboard() {
        try {
            const response = await fetch(
                "https://playroom-backend-p97v.onrender.com/api/scores/leaderboard"
            );

            const data = await response.json();

            if (response.ok) {
                setLeaderboard(data);
            }
        } catch (error) {
            console.error(
                "Could not load leaderboard:",
                error
            );
        } finally {
            setLoadingLeaderboard(false);
        }
    }

    function refreshUserStats() {
        const savedUser = JSON.parse(
            localStorage.getItem("playroomUser") || "{}"
        );

        setUser(savedUser);
    }

    function logout() {
        localStorage.removeItem("playroomToken");
        localStorage.removeItem("playroomUser");

        navigate("/login");
    }

    return (
        <div className="playroom-page">

            <nav className="playroom-nav">

                <div className="playroom-logo">
                    🎮 PLAYROOM
                </div>

                <div className="nav-user">

                    <span>
                        Hi, {user.name || "Gamer"}! 💗
                    </span>

                    <button
                        className="logout-btn"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            <main className="playroom-main">

                <section className="playroom-hero">

                    <div className="hero-star">
                        ✦
                    </div>

                    <p className="hero-small">
                        WELCOME BACK, GAMER ✨
                    </p>

                    <h1>
                        LET'S
                        <br />
                        PLAY!
                    </h1>

                    <p>
                        Pick a game and have some fun 🎀
                    </p>

                </section>


                {/* ============================
                    USER STATS
                ============================ */}

                <section className="stats-section">

                    <div className="stat-card">

                        <span>
                            🎮
                        </span>

                        <strong>
                            {user.gamesPlayed || 0}
                        </strong>

                        <small>
                            Games Played
                        </small>

                    </div>


                    <div className="stat-card">

                        <span>
                            ⭐
                        </span>

                        <strong>
                            {user.totalScore || 0}
                        </strong>

                        <small>
                            Total Score
                        </small>

                    </div>


                    <div className="stat-card">

                        <span>
                            🏆
                        </span>

                        <strong>
                            {user.gamesPlayed > 0 ? 1 : 0}
                        </strong>

                        <small>
                            Achievements
                        </small>

                    </div>

                </section>


                {/* ============================
                    GAMES
                ============================ */}

                <section className="games-section">

                    <div className="section-heading">

                        <h2>
                            🎮 CHOOSE YOUR GAME
                        </h2>

                        <p>
                            Your next high score is waiting!
                        </p>

                    </div>


                    <div className="games-grid">

                        {games.map((game) => (

                            <div
                                className="playroom-game-card"
                                key={game.name}
                            >

                                <div className="game-icon">
                                    {game.icon}
                                </div>

                                <h3>
                                    {game.name}
                                </h3>

                                <p>
                                    {game.description}
                                </p>

                                <a
                                    href={game.path}
                                    className="game-play-btn"
                                    onClick={refreshUserStats}
                                >
                                    PLAY →
                                </a>

                            </div>

                        ))}

                    </div>

                </section>


                {/* ============================
                    LEADERBOARD
                ============================ */}

                <section className="leaderboard-section">

                    <div className="section-heading">

                        <h2>
                            🏆 LEADERBOARD
                        </h2>

                        <p>
                            Top PLAYROOM gamers
                        </p>

                    </div>


                    <div className="leaderboard-card">

                        {loadingLeaderboard ? (

                            <p className="leaderboard-message">
                                Loading leaderboard... ⏳
                            </p>

                        ) : leaderboard.length === 0 ? (

                            <p className="leaderboard-message">
                                No scores yet. Be the first! 🎮
                            </p>

                        ) : (

                            leaderboard.map((player, index) => (

                                <div
                                    className="leaderboard-row"
                                    key={player._id}
                                >

                                    <div className="rank">

                                        {index === 0
                                            ? "🥇"
                                            : index === 1
                                            ? "🥈"
                                            : index === 2
                                            ? "🥉"
                                            : `#${index + 1}`}

                                    </div>


                                    <div className="player-info">

                                        <strong>
                                            {player.name}
                                        </strong>

                                        <small>
                                            {player.gamesPlayed || 0} games
                                        </small>

                                    </div>


                                    <div className="player-score">

                                        ⭐ {player.totalScore || 0}

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Playroom;
