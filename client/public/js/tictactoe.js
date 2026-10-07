// ========================================
// TIC TAC TOE
// ========================================

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];

let gameOver = false;

let playerScore = 0;

let computerScore = 0;

let drawScore = 0;


// ========================================
// SAVE TIC TAC TOE SCORE
// ========================================

async function saveTicTacToeScore(result) {

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
            "https://playroom-backend-p97v.onrender.com/api/scores/save",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    game: "tictactoe",
                    score: score
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(
                "❌ Tic Tac Toe score could not be saved:",
                data.message
            );

            return;

        }

        console.log(
            "🎉 Tic Tac Toe score saved!",
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
            "❌ Tic Tac Toe score server error:",
            error
        );

    }

}


// ========================================
// WINNING COMBINATIONS
// ========================================

const winningCombinations = [

    [0, 1, 2],

    [3, 4, 5],

    [6, 7, 8],

    [0, 3, 6],

    [1, 4, 7],

    [2, 5, 8],

    [0, 4, 8],

    [2, 4, 6]

];


// ========================================
// CHECK WINNER
// ========================================

function checkWinner(player) {

    for (
        let combination of winningCombinations
    ) {

        const a = combination[0];

        const b = combination[1];

        const c = combination[2];

        if (

            board[a] === player &&
            board[b] === player &&
            board[c] === player

        ) {

            return combination;

        }

    }

    return null;

}


// ========================================
// CHECK DRAW
// ========================================

function checkDraw() {

    return board.every(
        cell => cell !== ""
    );

}


// ========================================
// PLAYER MOVE
// ========================================

$(document).on(
    "click",
    ".ttt-cell",
    function () {

        if (gameOver) {
            return;
        }

        const index =
            $(this).data("index");

        if (board[index] !== "") {
            return;
        }

        board[index] = "X";

        renderBoard();

        const playerWinningCombo =
            checkWinner("X");

        if (playerWinningCombo) {

            endGame(
                "player",
                playerWinningCombo
            );

            return;

        }

        if (checkDraw()) {

            endGame("draw");

            return;

        }

        $("#turn-text").text(
            "Computer is thinking... ⭕"
        );

        setTimeout(
            computerMove,
            500
        );

    }
);


// ========================================
// COMPUTER MOVE
// ========================================

function computerMove() {

    if (gameOver) {
        return;
    }

    const emptyCells = board
        .map((cell, index) => {

            if (cell === "") {
                return index;
            }

            return null;

        })
        .filter(
            index => index !== null
        );

    if (emptyCells.length === 0) {
        return;
    }

    const randomIndex =
        Math.floor(
            Math.random() *
            emptyCells.length
        );

    const computerChoice =
        emptyCells[randomIndex];

    board[computerChoice] = "O";

    renderBoard();

    const computerWinningCombo =
        checkWinner("O");

    if (computerWinningCombo) {

        endGame(
            "computer",
            computerWinningCombo
        );

        return;

    }

    if (checkDraw()) {

        endGame("draw");

        return;

    }

    $("#turn-text").text(
        "Your turn! ❌"
    );

}


// ========================================
// RENDER BOARD
// ========================================

function renderBoard() {

    $(".ttt-cell").each(
        function () {

            const index =
                $(this).data("index");

            const value =
                board[index];

            $(this).text(value);

            $(this).removeClass(
                "x o"
            );

            if (value === "X") {
                $(this).addClass("x");
            }

            if (value === "O") {
                $(this).addClass("o");
            }

        }
    );

}


// ========================================
// END GAME
// ========================================

function endGame(
    result,
    winningCombo = []
) {

    gameOver = true;

    winningCombo.forEach(
        index => {

            $(".ttt-cell")
                .eq(index)
                .addClass("winner");

        }
    );


    if (result === "player") {

        playerScore++;

        $("#player-score")
            .text(playerScore);

        $("#result-emoji")
            .text("🎉");

        $("#result-title")
            .text("YOU WON!");

        $("#result-message")
            .text(
                "You beat the computer! 🔥"
            );

    }


    else if (result === "computer") {

        computerScore++;

        $("#computer-score")
            .text(computerScore);

        $("#result-emoji")
            .text("🤖");

        $("#result-title")
            .text("COMPUTER WON");

        $("#result-message")
            .text(
                "The computer got you this time!"
            );

    }


    else {

        drawScore++;

        $("#draw-score")
            .text(drawScore);

        $("#result-emoji")
            .text("🤝");

        $("#result-title")
            .text("IT'S A DRAW!");

        $("#result-message")
            .text(
                "Nobody wins this round!"
            );

    }


    // Save completed match
    saveTicTacToeScore(result);


    setTimeout(
        function () {

            $("#ttt-overlay")
                .addClass("show");

        },
        600
    );

}


// ========================================
// NEW GAME
// ========================================

function newGame() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];

    gameOver = false;

    $(".ttt-cell")
        .text("")
        .removeClass(
            "x o winner"
        );

    $("#turn-text").text(
        "Your turn! ❌"
    );

    $("#ttt-overlay")
        .removeClass("show");

}


// ========================================
// RESTART BUTTON
// ========================================

$("#ttt-restart").click(
    function () {

        newGame();

    }
);


// ========================================
// PLAY AGAIN
// ========================================

$("#ttt-play-again").click(
    function () {

        newGame();

    }
);


// ========================================
// START
// ========================================

$(document).ready(
    function () {

        newGame();

    }
);
