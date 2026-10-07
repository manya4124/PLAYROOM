// ========================================
// ROCK PAPER SCISSORS
// ========================================

let playerScore = 0;
let computerScore = 0;
let drawScore = 0;

let currentWinStreak = 0;
let bestWinStreak = 0;


// ========================================
// CHOICES
// ========================================

const choices = [
    "rock",
    "paper",
    "scissors"
];


// ========================================
// EMOJIS
// ========================================

const emojis = {

    rock: "✊",

    paper: "✋",

    scissors: "✌️"

};


// ========================================
// SAVE RPS SCORE
// ========================================

async function saveRpsScore(result) {

    const token = localStorage.getItem(
        "playroomToken"
    );

    if (!token) {
        return;
    }

    let score = 0;

    if (result === "player") {
        score = 100;
    }

    else if (result === "draw") {
        score = 25;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/scores/save",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    game: "rps",
                    score: score
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(
                "❌ RPS score could not be saved:",
                data.message
            );

            return;

        }

        console.log(
            "🎉 RPS score saved!",
            score
        );

        if (data.user) {

            localStorage.setItem(
                "playroomUser",
                JSON.stringify(data.user)
            );

        }

    } catch (error) {

        console.error(
            "❌ RPS score server error:",
            error
        );

    }

}


// ========================================
// LOAD SAVED BEST STREAK
// ========================================

function loadBestStreak() {

    const savedStreak =
        localStorage.getItem(
            "rpsBestStreak"
        );

    if (savedStreak !== null) {

        bestWinStreak =
            Number(savedStreak);

    }

    updateBestRecord();

}


// ========================================
// COMPUTER CHOICE
// ========================================

function getComputerChoice() {

    const randomIndex =
        Math.floor(
            Math.random() * choices.length
        );

    return choices[randomIndex];

}


// ========================================
// DETERMINE WINNER
// ========================================

function determineWinner(
    player,
    computer
) {

    if (player === computer) {

        return "draw";

    }

    if (

        (player === "rock" &&
            computer === "scissors")

        ||

        (player === "paper" &&
            computer === "rock")

        ||

        (player === "scissors" &&
            computer === "paper")

    ) {

        return "player";

    }

    return "computer";

}


// ========================================
// PLAY ROUND
// ========================================

$(".choice-btn").click(
    function () {

        const playerChoice =
            $(this).data("choice");

        const computerChoice =
            getComputerChoice();

        $("#player-choice")
            .text(
                emojis[playerChoice]
            );

        $("#computer-choice")
            .text(
                emojis[computerChoice]
            );

        $("#player-choice")
            .removeClass("animate");

        $("#computer-choice")
            .removeClass("animate");

        setTimeout(
            function () {

                $("#player-choice")
                    .addClass("animate");

                $("#computer-choice")
                    .addClass("animate");

            },
            10
        );

        const result =
            determineWinner(
                playerChoice,
                computerChoice
            );

        updateScore(result);

        addHistory(
            playerChoice,
            computerChoice,
            result
        );

        showResult(result);

        // Save this completed round
        saveRpsScore(result);

    }
);


// ========================================
// UPDATE SCORE
// ========================================

function updateScore(result) {

    if (result === "player") {

        playerScore++;

        currentWinStreak++;

        if (
            currentWinStreak >
            bestWinStreak
        ) {

            bestWinStreak =
                currentWinStreak;

            localStorage.setItem(
                "rpsBestStreak",
                bestWinStreak
            );

        }

    }

    else if (result === "computer") {

        computerScore++;

        currentWinStreak = 0;

    }

    else {

        drawScore++;

    }

    $("#player-score")
        .text(playerScore);

    $("#computer-score")
        .text(computerScore);

    $("#draw-score")
        .text(drawScore);

    updateBestRecord();

}


// ========================================
// SHOW RESULT
// ========================================

function showResult(result) {

    if (result === "player") {

        $("#rps-result").text(
            "🎉 YOU WIN! 🔥"
        );

    }

    else if (result === "computer") {

        $("#rps-result").text(
            "🤖 COMPUTER WINS!"
        );

    }

    else {

        $("#rps-result").text(
            "🤝 IT'S A DRAW!"
        );

    }

}


// ========================================
// ADD HISTORY
// ========================================

function addHistory(
    playerChoice,
    computerChoice,
    result
) {

    $(".empty-history")
        .remove();

    let resultText;

    if (result === "player") {

        resultText = "WIN";

    }

    else if (result === "computer") {

        resultText = "LOSS";

    }

    else {

        resultText = "DRAW";

    }

    const historyItem = $(`
        
        <div class="history-item ${result}">

            <span>
                ${emojis[playerChoice]}
            </span>

            <span>
                ${resultText}
            </span>

            <span>
                ${emojis[computerChoice]}
            </span>

        </div>

    `);

    $("#history-list")
        .prepend(historyItem);

}


// ========================================
// UPDATE BEST RECORD
// ========================================

function updateBestRecord() {

    $("#best-record strong")
        .text(bestWinStreak);

}


// ========================================
// RESET GAME
// ========================================

$("#rps-reset").click(
    function () {

        playerScore = 0;

        computerScore = 0;

        drawScore = 0;

        currentWinStreak = 0;

        $("#player-score").text(0);

        $("#computer-score").text(0);

        $("#draw-score").text(0);

        $("#player-choice").text("❔");

        $("#computer-choice").text("❔");

        $("#rps-result").text(
            "Choose an option to start!"
        );

        $("#history-list").html(`

            <p class="empty-history">

                No rounds played yet.

            </p>

        `);

        updateBestRecord();

    }
);


// ========================================
// START
// ========================================

$(document).ready(
    function () {

        loadBestStreak();

    }
);