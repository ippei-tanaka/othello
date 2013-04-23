define([
    'jquery',
    'underscore',
    'jquery.easing'
], function ($, _, jQueryEasing) {

    var TileView = function (model, $queueElement) {
        this.model = model;
        this.$element = $("#board-container tr:nth-child(" + (this.model.y + 1) + ") td:nth-child(" + (this.model.x + 1) + ") div");
        this.$queueElement = $queueElement;
    };

    var piecesCatalog = {
        $dark:$('<span />').addClass("dark"),
        $light:$('<span />').addClass("light"),
        $darkGuide:$('<span />').addClass("dark-guide").css('opacity', 0.1),
        $lightGuide:$('<span />').addClass("light-guide").css('opacity', 0.1),

        getPiece:function (name) {
            return piecesCatalog["$" + name].clone();
        },

        getGuide:function (name) {
            return piecesCatalog["$" + name + "Guide"].clone();
        }
    };

    TileView.prototype = {

        renderPiecePlacement:function (next) {
            var piece = piecesCatalog.getPiece(this.model.getPiece().face);
            this.$element.empty().append(piece);
            piece.hide().css({top:-30, opacity:0}).show().animate({top:0, opacity:1}, 150, 'easeInExpo', function () {
                next()
            });
        },

        renderPieceReverse:function (next) {
            var piece = piecesCatalog.getPiece(this.model.getPiece().face);
            this.$element.empty().append(piece);
            piece.hide().css({top:-10, opacity:0}).show().animate({top:0, opacity:1}, 100, function () {
                next()
            });
        },

        renderEmptyTile:function () {
            this.$element.empty();
        },

        renderGuide:function (piece) {
            this.$element.empty().append(piecesCatalog.getGuide(piece.face));
        },

        deleteGuide:function () {
            this.$element.find(".dark-guide, .light-guide").remove();
        }

    };

    return TileView;

});