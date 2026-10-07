$(document).ready(function () {

    console.log("PLAYROOM is ready! 🎮");

    /* =========================================
       PLAY NOW BUTTON
    ========================================= */

    $(".play-btn").click(function () {

        $("html, body").animate({
            scrollTop: $("#games").offset().top
        }, 700);

    });


    /* =========================================
       GAME CARD HOVER EFFECT
    ========================================= */

    $(".game-card").hover(

        function () {

            $(this)
                .find(".game-icon")
                .css("transform", "scale(1.15) rotate(5deg)");

        },

        function () {

            $(this)
                .find(".game-icon")
                .css("transform", "scale(1) rotate(0deg)");

        }

    );


    /* =========================================
       COMING SOON BUTTON
    ========================================= */

    $(".game-btn[data-game]").click(function () {

        const gameName =
            $(this).data("game");

        alert(
            "🎮 " +
            gameName +
            " is coming soon!"
        );

    });


    /* =========================================
       NAVBAR LINK SMOOTH SCROLL
    ========================================= */

    $(".nav-link").click(function (event) {

        const target =
            $(this).attr("href");

        if (
            target &&
            target.startsWith("#") &&
            $(target).length
        ) {

            event.preventDefault();

            $("html, body").animate({

                scrollTop:
                    $(target).offset().top - 70

            }, 600);

        }

    });


    /* =========================================
       CARD ENTRANCE ANIMATION
    ========================================= */

    $(".game-card").each(function (index) {

        $(this).css({
            "opacity": "0",
            "transform": "translateY(25px)"
        });

        setTimeout(() => {

            $(this).css({
                "opacity": "1",
                "transform": ""
            });

        }, 100 + index * 100);

    });

});