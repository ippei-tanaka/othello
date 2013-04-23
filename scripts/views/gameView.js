define([
    'jquery',
    'underscore',
    'jquery.easing'
], function ($, _, jQueryEasing) {

    var GameView = function () {

        this.$title = $("#title-container");

        this.$menu = $("#menu-container");
        this.$menuStartButton = this.$menu.find("#start-button");
        this.$menuBrainSelector = this.$menu.find(".brain input");
        this.$playAgain = $("#play-again");

        var _this = this;
        this.$menuBrainSelector.on("change", function () {
            _this.$menuBrainSelector.parent().removeClass("checked");
            _this.$menuBrainSelector.filter(":checked").parent().addClass("checked");
        })
            .filter("[name='player1']:first").prop("checked", true).end()
            .filter("[name='player2']:last").prop("checked", true).end()
            .triggerHandler('change');
    };

    GameView.prototype = {

        deleteTitle : function (next) {
            this.$title.fadeOut(200, next);
        },

        getBrain1 : function () {
            return this.$menuBrainSelector.filter("[name='player1']:checked").val();
        },

        getBrain2 : function () {
            return this.$menuBrainSelector.filter("[name='player2']:checked").val();
        },

        showMenu : function (next) {
            this.$menu.fadeIn(200, next);
        },

        hideMenu : function (next) {
            this.$menu.fadeOut(200, next);
        },

        showPlayAgain : function (next) {
            this.$playAgain.fadeIn(200, next);
        },

        hidePlayAgain : function (next) {
            this.$playAgain.fadeOut(200, next);
        },

        showCurrentStatus: function (currentPlayer) {
            var message = "<span class='small'>Current Player:</span> <strong>" + currentPlayer.name + "</strong>";
            message +=  " <span class='icon " + currentPlayer.color + "'> </span>";
            $("#massage").html(message);
        },

        showGameResult: function (score0, score1, player0, player1) {
            var message = "";
            if (score0 === score1) {
                message = "<strong>Draw.</strong>";
            } else if (score0 > score1) {
                message = "<strong>" + player0.name + " Win!</strong> <span class='icon " +  player0.color + "'> </span>";
            } else {
                message = "<strong>" + player1.name + " Win!</strong> <span class='icon " +  player1.color + "'> </span>";
            }
            $("#massage").html(message);
        },

        deleteMessage : function () {
            $("#massage").html("");
        },

        renderCurrentGuide : function (tiles, piece) {
            _(tiles).each(function (tile) {
                tile.view.renderGuide(piece);
            });
        },

        deleteCurrentGuide : function (tiles) {
            _(tiles).each(function (tile) {
                tile.view.deleteGuide();
            });
        }
    };

    return GameView;

});