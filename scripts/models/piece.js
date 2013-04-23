define(function () {

    var Piece = function (face) {
        this.face = face;
        this.back = this.getOpposite(face);
    };

    Piece.prototype = {

        reverse: function () {
            var face = this.face;
            this.face = this.back;
            this.back = face;
        },

        getOpposite: function (color) {
            if (color == Piece.LIGHT) {
                return Piece.DARK;
            } else {
                return Piece.LIGHT;
            }
        }
    };

    Piece.LIGHT = "light";
    Piece.DARK = "dark";

    return Piece;
});