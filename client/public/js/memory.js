// ========================================
// MEMORY MATCH GAME
// ========================================


// ========================================
// CARD SYMBOLS
// ========================================

const symbols = [
    "🍓",
    "🍕",
    "🐱",
    "🌸",
    "🍩",
    "🦋"
];


// ========================================
// CREATE PAIRS
// ========================================

let cards = [...symbols, ...symbols];


// ========================================
// GAME VARIABLES
// ========================================

let flippedCards = [];

let matchedPairs = 0;

let moves = 0;

let time = 0;

let timerStarted = false;

let timer;


// ========================================
// START GAME
// ========================================

function startGame() {

    flippedCards = [];

    matchedPairs = 0;

    moves = 0;

    time = 0;

    timerStarted = false;

    clearInterval(timer);

    $("#moves").text(moves);

    $("#pairs").text(`${matchedPairs} / 6`);

    $("#timer").text(time);

    $("#win-overlay").removeClass("show");

    cards.sort(() => Math.random() - 0.5);

    $("#memory-board").empty();

    cards.forEach((symbol, index) => {

        const card = $(`
            <div
                class="memory-card"
                data-symbol="${symbol}">
            </div>
        `);

        card.attr("data-index", index);

        $("#memory-board").append(card);

    });

    displayBestScore();

}


// ========================================
// TIMER
// ========================================

function startTimer() {

    if (timerStarted) {
        return;
    }

    timerStarted = true;

    timer = setInterval(function () {

        time++;

        $("#timer").text(time);

    }, 1000);

}


// ========================================
// CARD CLICK
// ========================================

$(document).on("click", ".memory-card", function () {

    if ($(this).hasClass("flipped")) {
        return;
    }

    if ($(this).hasClass("matched")) {
        return;
    }

    if (flippedCards.length === 2) {
        return;
    }

    startTimer();

    $(this).addClass("flipped");

    flippedCards.push($(this));

    if (flippedCards.length === 2) {

        moves++;

        $("#moves").text(moves);

        checkMatch();

    }

});


// ========================================
// CHECK MATCH
// ========================================

function checkMatch() {

    const firstCard = flippedCards[0];

    const secondCard = flippedCards[1];

    const firstSymbol = firstCard.data("symbol");

    const secondSymbol = secondCard.data("symbol");


    // ====================================
    // MATCH
    // ====================================

    if (firstSymbol === secondSymbol) {

        firstCard.addClass("matched");

        secondCard.addClass("matched");

        matchedPairs++;

        $("#pairs").text(`${matchedPairs} / 6`);

        flippedCards = [];


        if (matchedPairs === 6) {

            clearInterval(timer);

            setTimeout(function () {

                showWinScreen();

            }, 500);

        }

    }


    // ====================================
    // NOT A MATCH
    // ====================================

    else {

        setTimeout(function () {

            firstCard.removeClass("flipped");

            secondCard.removeClass("flipped");

            flippedCards = [];

        }, 800);

    }

}


// ========================================
// CALCULATE SCORE
// ========================================

function calculateGameScore() {

    let score = 1000;

    score -= moves * 30;

    score -= time * 2;


    if (score < 100) {

        score = 100;

    }


    return score;

}


// ========================================
// SAVE SCORE TO MONGODB
// ========================================

async function saveScoreToBackend() {

    const token = localStorage.getItem(
        "playroomToken"
    );


    if (!token) {

        console.log(
            "⚠️ No login token found. Score was not saved."
        );

        return;

    }


    const score = calculateGameScore();


    console.log(
        "🎮 Saving Memory Match score:",
        score
    );


    try {

        const response = await fetch(
            "https://playroom-backend-p97v.onrender.com/api/scores/save",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",

                    "Authorization":
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    game: "memory",
                    score: score
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            console.error(
                "❌ Score could not be saved:",
                data.message
            );

            return;

        }


        console.log(
            "🎉 Memory score saved!",
            score
        );


        // Update the locally stored user

        if (data.user) {

            localStorage.setItem(
                "playroomUser",
                JSON.stringify(data.user)
            );

        }

    }

    catch (error) {

        console.error(
            "❌ Score server error:",
            error
        );

    }

}


// ========================================
// BEST SCORE
// ========================================

function getBestScore() {

    const savedScore = localStorage.getItem(
        "memoryBestScore"
    );


    if (savedScore === null) {

        return null;

    }


    return JSON.parse(savedScore);

}


// ========================================
// DISPLAY BEST SCORE
// ========================================

function displayBestScore() {

    const bestScore = getBestScore();


    if (bestScore === null) {

        $("#best-score").text("-");

        return;

    }


    $("#best-score").text(
        `${bestScore.moves} moves`
    );

}


// ========================================
// SAVE BEST SCORE
// ========================================

function saveBestScore() {

    const bestScore = getBestScore();


    // No previous score

    if (bestScore === null) {

        const newScore = {

            moves: moves,

            time: time

        };


        localStorage.setItem(
            "memoryBestScore",
            JSON.stringify(newScore)
        );


        return true;

    }


    // Fewer moves = better

    if (moves < bestScore.moves) {

        const newScore = {

            moves: moves,

            time: time

        };


        localStorage.setItem(
            "memoryBestScore",
            JSON.stringify(newScore)
        );


        return true;

    }


    return false;

}


// ========================================
// WIN SCREEN
// ========================================

function showWinScreen() {

    // Save local best

    const isNewBest = saveBestScore();


    // Save score to MongoDB

    saveScoreToBackend();


    // Display final score

    $("#final-moves").text(moves);

    $("#final-time").text(time);


    // Display new best message

    if (isNewBest) {

        $("#new-best").addClass("show");

    }

    else {

        $("#new-best").removeClass("show");

    }


    // Show win overlay

    $("#win-overlay").addClass("show");


    // Update best score

    displayBestScore();

}


// ========================================
// RESTART BUTTON
// ========================================

$("#restart-btn").click(function () {

    startGame();

});


// ========================================
// PLAY AGAIN BUTTON
// ========================================

$("#play-again").click(function () {

    startGame();

});


// ========================================
// START GAME WHEN PAGE LOADS
// ========================================

$(document).ready(function () {

    startGame();

});
