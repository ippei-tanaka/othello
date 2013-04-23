define([
    'models/piece'
],
    function (
        Piece
        ) {

    var Player = function (name, color, brain) {
        this.name = name;
        this.color = color;
        this.brain = brain;
    };

    Player.prototype = {
        getNewPiece: function () {
            return new Piece(this.color);
        }
    };

    Player.LIGHT = "light";
    Player.DARK = "dark";

    Player.HUMAN = "human";
    Player.COMPUTER = "computer";

    return Player;
});