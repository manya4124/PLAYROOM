const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        gamesPlayed: {
            type: Number,
            default: 0
        },

        totalScore: {
            type: Number,
            default: 0
        },

        memoryBest: {
            type: Number,
            default: 0
        },

        reactionBest: {
            type: Number,
            default: 0
        },

        rpsWins: {
            type: Number,
            default: 0
        },

        wordScrambleBest: {
            type: Number,
            default: 0
        },

        ticTacToeWins: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);