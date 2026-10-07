// ========================================
// ROCK PAPER SCISSORS
// ========================================


// ========================================
// GAME VARIABLES
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


    // Draw

    if (player === computer) {

        return "draw";

    }


    // Player wins

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


    // Otherwise computer wins

    return "computer";

}


// ========================================
// PLAY ROUND
// ========================================

$(".choice-btn").click(
    function () {


        // Get player choice

        const playerChoice =
            $(this).data("choice");


        // Get computer choice

        const computerChoice =
            getComputerChoice();


        // Display choices

        $("#player-choice")
            .text(
                emojis[playerChoice]
            );


        $("#computer-choice")
            .text(
                emojis[computerChoice]
            );


        // Restart animation

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


        // Determine winner

        const result =
            determineWinner(
                playerChoice,
                computerChoice
            );


        // Update score

        updateScore(result);


        // Add history

        addHistory(
            playerChoice,
            computerChoice,
            result
        );


        // Show result

        showResult(result);

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


    // Update screen

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


    // Remove empty message

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


    // Add newest round at top

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


        // Reset scoreboard

        $("#player-score").text(0);

        $("#computer-score").text(0);

        $("#draw-score").text(0);


        // Reset choices

        $("#player-choice").text("❔");

        $("#computer-choice").text("❔");


        // Reset result

        $("#rps-result").text(
            "Choose an option to start!"
        );


        // Clear history

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