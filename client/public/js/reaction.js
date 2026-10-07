const totalRounds = 5;

let currentRound = 0;
let reactionTimes = [];
let waitingForClick = false;
let startTime = 0;
let reactionTimeout;
let resultTimeout;
let gameStarted = false;


// ========================================
// SAVE SCORE TO MONGODB
// ========================================

async function saveReactionScore(average) {

    const token = localStorage.getItem("playroomToken");

    if (!token || average <= 0) {
        return;
    }

    // Lower reaction time = better.
    // Convert it into a points score.
    let score = 1000 - (average * 2);

    if (score < 100) {
        score = 100;
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
                    game: "reaction",
                    score: score
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(
                "❌ Reaction score could not be saved:",
                data.message
            );
            return;
        }

        console.log(
            "🎉 Reaction score saved!",
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
            "❌ Reaction score server error:",
            error
        );

    }
}


// ========================================
// START / RESET GAME
// ========================================

function startGame() {

    clearTimeout(reactionTimeout);
    clearTimeout(resultTimeout);

    currentRound = 0;
    reactionTimes = [];
    waitingForClick = false;
    startTime = 0;
    gameStarted = false;

    $("#round").text(`0 / ${totalRounds}`);

    updateTopStats();

    $("#last-result").text("");

    $("#reaction-overlay")
        .removeClass("show");

    $("#reaction-box")
        .removeClass(
            "waiting click-now too-early"
        )
        .css("background", "");

    $("#reaction-content").html(`

        <div class="reaction-icon">
            🎯
        </div>

        <h2>
            READY?
        </h2>

        <p>
            Click the button to begin!
        </p>

        <button
            id="start-reaction"
            class="btn game-btn">

            START GAME

        </button>

    `);
}


// ========================================
// BEGIN GAME
// ========================================

$(document).on(
    "click",
    "#start-reaction",
    function () {

        beginGame();

    }
);


function beginGame() {

    clearTimeout(reactionTimeout);
    clearTimeout(resultTimeout);

    gameStarted = true;

    currentRound = 0;

    reactionTimes = [];

    updateTopStats();

    nextRound();

}


// ========================================
// NEXT ROUND
// ========================================

function nextRound() {

    if (currentRound >= totalRounds) {

        finishGame();

        return;

    }

    currentRound++;

    $("#round").text(
        `${currentRound} / ${totalRounds}`
    );

    waitingForClick = false;

    $("#reaction-box")
        .removeClass(
            "click-now too-early"
        )
        .addClass("waiting")
        .css("background", "");

    $("#reaction-content").html(`

        <div class="reaction-icon">
            ⏳
        </div>

        <h2>
            WAIT...
        </h2>

        <p>
            Don't click yet!
        </p>

    `);

    const randomDelay =
        Math.floor(
            Math.random() * 3000
        ) + 2000;

    reactionTimeout = setTimeout(
        showTarget,
        randomDelay
    );

}


// ========================================
// SHOW CLICK TARGET
// ========================================

function showTarget() {

    waitingForClick = true;

    startTime = performance.now();

    $("#reaction-box")
        .removeClass("waiting")
        .addClass("click-now");

    $("#reaction-content").html(`

        <div class="reaction-icon">
            🔥
        </div>

        <h2>
            CLICK NOW!
        </h2>

        <p>
            GO GO GO!
        </p>

    `);

}


// ========================================
// REACTION BOX CLICK
// ========================================

$("#reaction-box").click(
    function () {

        if (!gameStarted) {
            return;
        }

        if (!waitingForClick) {

            clearTimeout(reactionTimeout);

            falseStart();

            return;

        }

        const endTime =
            performance.now();

        const reactionTime =
            Math.round(
                endTime - startTime
            );

        reactionTimes.push(
            reactionTime
        );

        waitingForClick = false;

        updateTopStats();

        showRoundResult(
            reactionTime
        );

    }
);


// ========================================
// FALSE START
// ========================================

function falseStart() {

    waitingForClick = false;

    $("#reaction-box")
        .removeClass("waiting")
        .addClass("too-early");

    $("#reaction-content").html(`

        <div class="reaction-icon">
            😭
        </div>

        <h2>
            TOO EARLY!
        </h2>

        <p>
            Wait for the green signal!
        </p>

    `);

    $("#last-result").text(
        "⚠️ False start! No reaction time recorded."
    );

    resultTimeout = setTimeout(
        function () {

            nextRound();

        },
        1500
    );

}


// ========================================
// ROUND RESULT
// ========================================

function showRoundResult(
    reactionTime
) {

    $("#reaction-box")
        .removeClass("click-now")
        .css("background", "#ffffff");

    $("#reaction-content").html(`

        <div class="reaction-icon">
            ⚡
        </div>

        <h2>
            ${reactionTime} ms
        </h2>

        <p>
            Nice reaction!
        </p>

    `);

    $("#last-result").text(
        `Round ${currentRound}: ${reactionTime} ms`
    );

    resultTimeout = setTimeout(
        function () {

            $("#reaction-box")
                .css("background", "");

            nextRound();

        },
        1200
    );

}


// ========================================
// FINISH GAME
// ========================================

function finishGame() {

    gameStarted = false;

    waitingForClick = false;

    clearTimeout(reactionTimeout);
    clearTimeout(resultTimeout);

    if (reactionTimes.length === 0) {

        showResults(
            0,
            0
        );

        return;

    }

    const total =
        reactionTimes.reduce(
            function (sum, time) {

                return sum + time;

            },
            0
        );

    const average =
        Math.round(
            total / reactionTimes.length
        );

    const best =
        Math.min(...reactionTimes);

    // Save completed game to MongoDB
    saveReactionScore(average);

    showResults(
        average,
        best
    );

}


// ========================================
// RESULTS
// ========================================

function showResults(
    average,
    best
) {

    const oldBest =
        localStorage.getItem(
            "reactionBest"
        );

    let isNewBest = false;

    if (
        best > 0 &&
        (
            oldBest === null ||
            best < Number(oldBest)
        )
    ) {

        localStorage.setItem(
            "reactionBest",
            best
        );

        isNewBest = true;

    }

    let resultsHTML = "";

    reactionTimes.forEach(
        function (time, index) {

            resultsHTML += `

                <div class="result-row">

                    <span>
                        Round ${index + 1}
                    </span>

                    <strong>
                        ${time} ms
                    </strong>

                </div>

            `;

        }
    );

    if (reactionTimes.length === 0) {

        resultsHTML = `

            <div class="result-row">

                <span>
                    No valid attempts
                </span>

                <strong>
                    😭
                </strong>

            </div>

        `;

    }

    $("#results-list")
        .html(resultsHTML);

    $("#final-average")
        .text(
            average > 0
                ? `${average} ms`
                : "-"
        );

    $("#final-best")
        .text(
            best > 0
                ? `${best} ms`
                : "-"
        );

    if (isNewBest) {

        $("#reaction-new-best")
            .addClass("show");

    } else {

        $("#reaction-new-best")
            .removeClass("show");

    }

    updateTopStats();

    $("#reaction-overlay")
        .addClass("show");

}


// ========================================
// TOP STATISTICS
// ========================================

function updateTopStats() {

    const savedBest =
        localStorage.getItem(
            "reactionBest"
        );

    if (savedBest !== null) {

        $("#best-reaction")
            .text(`${savedBest} ms`);

    } else {

        $("#best-reaction")
            .text("-");

    }

    if (reactionTimes.length > 0) {

        const total =
            reactionTimes.reduce(
                function (sum, time) {

                    return sum + time;

                },
                0
            );

        const average =
            Math.round(
                total / reactionTimes.length
            );

        $("#average-reaction")
            .text(`${average} ms`);

    } else {

        $("#average-reaction")
            .text("-");

    }

}


// ========================================
// BUTTONS
// ========================================

$("#reaction-restart").click(
    function () {

        startGame();

    }
);


$("#reaction-play-again").click(
    function () {

        startGame();

    }
);


// ========================================
// INITIALIZE
// ========================================

$(document).ready(
    function () {

        startGame();

    }
);