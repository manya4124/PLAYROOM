// ========================================
// TIC TAC TOE
// ========================================


// ========================================
// GAME VARIABLES
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


        // Don't allow moves after game ends

        if (gameOver) {

            return;

        }


        // Get cell index

        const index = $(this).data("index");


        // Don't allow occupied cells

        if (board[index] !== "") {

            return;

        }


        // Player places X

        board[index] = "X";


        renderBoard();


        // Check player win

        const playerWinningCombo =
            checkWinner("X");


        if (playerWinningCombo) {

            endGame(
                "player",
                playerWinningCombo
            );

            return;

        }


        // Check draw

        if (checkDraw()) {

            endGame("draw");

            return;

        }


        // Computer turn

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


    // Find empty cells

    const emptyCells = board
        .map((cell, index) => {

            if (cell === "") {

                return index;

            }

            return null;

        })
        .filter(index => index !== null);


    // Random computer move

    const randomIndex =
        Math.floor(
            Math.random() *
            emptyCells.length
        );


    const computerChoice =
        emptyCells[randomIndex];


    // Place O

    board[computerChoice] = "O";


    renderBoard();


    // Check computer win

    const computerWinningCombo =
        checkWinner("O");


    if (computerWinningCombo) {

        endGame(
            "computer",
            computerWinningCombo
        );

        return;

    }


    // Check draw

    if (checkDraw()) {

        endGame("draw");

        return;

    }


    // Back to player

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


            // Remove old classes

            $(this).removeClass(
                "x o"
            );


            // Add X class

            if (value === "X") {

                $(this).addClass("x");

            }


            // Add O class

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


    // Highlight winning cells

    winningCombo.forEach(
        index => {

            $(".ttt-cell")
                .eq(index)
                .addClass("winner");

        }
    );


    // PLAYER WINS

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


    // COMPUTER WINS

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


    // DRAW

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


    // Show result after short delay

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