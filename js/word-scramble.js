const words = [

    {
        word: "javascript",
        category: "TECH",
        hint: "A programming language used to make websites interactive."
    },

    {
        word: "computer",
        category: "TECH",
        hint: "An electronic machine used to process information."
    },

    {
        word: "rainbow",
        category: "NATURE",
        hint: "You can see this colourful arc after rain."
    },

    {
        word: "butterfly",
        category: "NATURE",
        hint: "An insect with colourful wings."
    },

    {
        word: "chocolate",
        category: "FOOD",
        hint: "A sweet treat made from cocoa."
    },

    {
        word: "pineapple",
        category: "FOOD",
        hint: "A tropical fruit with a spiky outside."
    },

    {
        word: "elephant",
        category: "ANIMALS",
        hint: "The largest land animal."
    },

    {
        word: "dolphin",
        category: "ANIMALS",
        hint: "A highly intelligent sea mammal."
    },

    {
        word: "guitar",
        category: "MUSIC",
        hint: "A musical instrument with strings."
    },

    {
        word: "festival",
        category: "LIFE",
        hint: "A celebration or special event."
    },

    {
        word: "universe",
        category: "SPACE",
        hint: "Everything that exists in space."
    },

    {
        word: "planet",
        category: "SPACE",
        hint: "Earth is one of these."
    }

];

const totalRounds = 10;

let currentRound = 1;

let score = 0;

let currentWord = null;

let timeLeft = 30;

let timer;

let gameStarted = false;

let wordAnswered = false;


function shuffleWord(word) {

    let letters = word.split("");

    let shuffled;

    do {

        shuffled = [...letters];

        shuffled.sort(
            () => Math.random() - 0.5
        );

    } while (
        shuffled.join("") === word &&
        word.length > 1
    );

    return shuffled.join("").toUpperCase();

}


function getRandomWord() {

    const randomIndex =
        Math.floor(
            Math.random() * words.length
        );

    return words[randomIndex];

}


function getBestScore() {

    const savedScore =
        localStorage.getItem(
            "wordScrambleBest"
        );

    if (savedScore === null) {
        return 0;
    }

    return Number(savedScore);

}


function displayBestScore() {

    $("#best-score")
        .text(getBestScore());

}


function startGame() {

    clearInterval(timer);

    currentRound = 1;

    score = 0;

    gameStarted = true;

    wordAnswered = false;

    $("#score").text(score);

    $("#round").text(
        `${currentRound} / ${totalRounds}`
    );

    $("#word-overlay")
        .removeClass("show");

    $("#start-game")
        .text("🔄 Restart Game");

    showNextWord();

}


function showNextWord() {

    clearInterval(timer);

    wordAnswered = false;

    currentWord = getRandomWord();

    timeLeft = 30;

    $("#category")
        .text(currentWord.category);

    $("#scrambled-word")
        .text(
            shuffleWord(currentWord.word)
        );

    $("#hint")
        .text(
            `💡 ${currentWord.hint}`
        );

    $("#feedback")
        .removeClass("correct wrong")
        .text("");

    $("#answer")
        .val("")
        .prop("disabled", false)
        .focus();

    $("#submit-answer")
        .prop("disabled", false);

    $("#skip-word")
        .prop("disabled", false);

    $("#timer")
        .text(timeLeft);

    startTimer();

}


function startTimer() {

    timer = setInterval(
        function () {

            timeLeft--;

            $("#timer")
                .text(timeLeft);

            if (timeLeft <= 0) {

                clearInterval(timer);

                timeUp();

            }

        },
        1000
    );

}


function timeUp() {

    if (wordAnswered) {
        return;
    }

    wordAnswered = true;

    $("#answer")
        .prop("disabled", true);

    $("#submit-answer")
        .prop("disabled", true);

    $("#skip-word")
        .prop("disabled", true);

    $("#feedback")
        .addClass("wrong")
        .text(
            `⏰ Time's up! The answer was "${currentWord.word}".`
        );

    setTimeout(
        nextRound,
        1500
    );

}


function checkAnswer() {

    if (!gameStarted || wordAnswered) {
        return;
    }

    const answer =
        $("#answer")
            .val()
            .trim()
            .toLowerCase();

    if (answer === "") {

        $("#feedback")
            .removeClass("correct")
            .addClass("wrong")
            .text(
                "✏️ Type an answer first!"
            );

        return;

    }

    if (
        answer ===
        currentWord.word.toLowerCase()
    ) {

        clearInterval(timer);

        wordAnswered = true;

        const bonus =
            Math.min(timeLeft, 10);

        const points =
            10 + bonus;

        score += points;

        $("#score")
            .text(score);

        $("#feedback")
            .removeClass("wrong")
            .addClass("correct")
            .text(
                `🎉 Correct! +${points} points!`
            );

        $("#answer")
            .prop("disabled", true);

        $("#submit-answer")
            .prop("disabled", true);

        $("#skip-word")
            .prop("disabled", true);

        setTimeout(
            nextRound,
            1200
        );

    }

    else {

        $("#feedback")
            .removeClass("correct")
            .addClass("wrong")
            .text(
                "❌ Nope! Try again!"
            );

    }

}


function skipWord() {

    if (!gameStarted || wordAnswered) {
        return;
    }

    clearInterval(timer);

    wordAnswered = true;

    $("#answer")
        .prop("disabled", true);

    $("#submit-answer")
        .prop("disabled", true);

    $("#skip-word")
        .prop("disabled", true);

    $("#feedback")
        .addClass("wrong")
        .text(
            `⏭ Skipped! The answer was "${currentWord.word}".`
        );

    setTimeout(
        nextRound,
        1200
    );

}


function nextRound() {

    if (currentRound >= totalRounds) {

        finishGame();

        return;

    }

    currentRound++;

    $("#round")
        .text(
            `${currentRound} / ${totalRounds}`
        );

    showNextWord();

}


function finishGame() {

    clearInterval(timer);

    gameStarted = false;

    $("#answer")
        .prop("disabled", true);

    $("#submit-answer")
        .prop("disabled", true);

    $("#skip-word")
        .prop("disabled", true);

    const oldBest =
        getBestScore();

    let isNewBest = false;

    if (score > oldBest) {

        localStorage.setItem(
            "wordScrambleBest",
            score
        );

        isNewBest = true;

    }

    $("#final-score")
        .text(score);

    if (isNewBest) {

        $("#new-best")
            .addClass("show");

        $("#result-emoji")
            .text("🏆");

    }

    else {

        $("#new-best")
            .removeClass("show");

        $("#result-emoji")
            .text("🎉");

    }

    $("#word-overlay")
        .addClass("show");

    displayBestScore();

}


$("#submit-answer").click(
    function () {
        checkAnswer();
    }
);


$("#answer").keypress(
    function (event) {

        if (event.which === 13) {
            checkAnswer();
        }

    }
);


$("#skip-word").click(
    function () {
        skipWord();
    }
);


$("#start-game").click(
    function () {
        startGame();
    }
);


$("#play-again").click(
    function () {
        startGame();
    }
);


$(document).ready(
    function () {

        displayBestScore();

        $("#answer")
            .prop("disabled", true);

        $("#submit-answer")
            .prop("disabled", true);

        $("#skip-word")
            .prop("disabled", true);

    }
);