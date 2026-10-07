const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/scores");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "🎮 PLAYROOM backend is running!"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/scores", scoreRoutes);

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        console.log(
            "🍃 MongoDB connected successfully!"
        );

        app.listen(
            PORT,
            "0.0.0.0",
            () => {

                console.log(
                    `🟢 PLAYROOM server running on port ${PORT}`
                );

            }
        );

    })
    .catch((error) => {

        console.error(
            "❌ MongoDB connection failed:",
            error.message
        );

    });