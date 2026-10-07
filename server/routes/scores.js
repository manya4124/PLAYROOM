const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const router = express.Router();


function authenticate(req, res, next) {

    const authHeader =
        req.headers.authorization;

    if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
    ) {

        return res.status(401).json({
            message: "Authentication required."
        });

    }

    const token =
        authHeader.split(" ")[1];

    try {

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        req.userId =
            decoded.userId;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token."
        });

    }

}


// ========================================
// SAVE SCORE
// ========================================

router.post(
    "/save",
    authenticate,
    async (req, res) => {

        try {

            const {
                game,
                score
            } = req.body;


            if (
                !game ||
                score === undefined
            ) {

                return res.status(400).json({
                    message:
                        "Game and score are required."
                });

            }


            const user =
                await User.findById(
                    req.userId
                );


            if (!user) {

                return res.status(404).json({
                    message:
                        "User not found."
                });

            }


            const numericScore =
                Number(score);


            if (
                Number.isNaN(
                    numericScore
                )
            ) {

                return res.status(400).json({
                    message:
                        "Score must be a number."
                });

            }


            // Every completed game adds one game

            user.gamesPlayed += 1;

            user.totalScore +=
                numericScore;


            // MEMORY

            if (
                game === "memory"
            ) {

                if (
                    numericScore >
                    user.memoryBest
                ) {

                    user.memoryBest =
                        numericScore;

                }

            }


            // REACTION

            if (
                game === "reaction"
            ) {

                if (
                    numericScore >
                    user.reactionBest
                ) {

                    user.reactionBest =
                        numericScore;

                }

            }


            // RPS

            if (
                game === "rps" &&
                numericScore > 0
            ) {

                user.rpsWins += 1;

            }


            // WORD SCRAMBLE

            if (
                game === "word-scramble"
            ) {

                if (
                    numericScore >
                    user.wordScrambleBest
                ) {

                    user.wordScrambleBest =
                        numericScore;

                }

            }


            // TIC TAC TOE

            if (
                game === "tictactoe" &&
                numericScore > 0
            ) {

                user.ticTacToeWins += 1;

            }


            await user.save();


            res.json({

                message:
                    "Score saved successfully!",

                user: {

                    name:
                        user.name,

                    email:
                        user.email,

                    gamesPlayed:
                        user.gamesPlayed,

                    totalScore:
                        user.totalScore,

                    memoryBest:
                        user.memoryBest,

                    reactionBest:
                        user.reactionBest,

                    rpsWins:
                        user.rpsWins,

                    wordScrambleBest:
                        user.wordScrambleBest,

                    ticTacToeWins:
                        user.ticTacToeWins

                }

            });

        }

        catch (error) {

            console.error(
                "Score save error:",
                error
            );

            res.status(500).json({
                message:
                    "Could not save score."
            });

        }

    }
);


// ========================================
// LEADERBOARD
// ========================================

router.get(
    "/leaderboard",
    async (req, res) => {

        try {

            const users =
                await User.find(
                    {},
                    {
                        name: 1,
                        totalScore: 1,
                        gamesPlayed: 1
                    }
                )
                .sort({
                    totalScore: -1
                })
                .limit(10);


            res.json(users);

        }

        catch (error) {

            console.error(
                "Leaderboard error:",
                error
            );

            res.status(500).json({
                message:
                    "Could not load leaderboard."
            });

        }

    }
);


module.exports = router;