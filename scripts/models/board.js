define([
    'jquery',
    'underscore',
    'utilities',
    'models/tile'
], function (
    $,
    _,
    Utilities,
    Tile
    ) {

    var Board = function () {

        this.tiles = Utilities.createFilledTwoDimensionalArray(Board.SIZE, Board.SIZE, function (x, y) {
            return new Tile({x: x,  y: y});
        });

    };

    Board.SIZE = 8;

    Board.prototype = {

        _expectReversesInOneDirection: function(targetTile, piece, xIteration, yIteration) {

            var tiles = this.tiles;
            var x = targetTile.x;
            var y = targetTile.y;
            var reversedTiles = [];

            while (1) {

                x = xIteration(x);
                y = yIteration(y);

                var tile = !_(tiles[x]).isUndefined() ? tiles[x][y] : undefined;

                if (_(tile).isUndefined()
                    || _(tile.getPiece()).isNull()
                    || (tile.x == targetTile.x && tile.y == targetTile.y)) {
                    reversedTiles = [];
                    break;
                }

                if (tile.getPiece().face == piece.back) {
                    reversedTiles.push(tile);
                } else if (reversedTiles.length > 0 && tile.getPiece().face == piece.face) {
                    break;
                } else {
                    reversedTiles = [];
                    break;
                }

            }

            return reversedTiles;
        },

        expectReverses:function (targetTile, piece) {

            var iterations = [
                function(a) { return a + 1; },
                function(a) { return a - 1; },
                function(a) { return a; }
            ];

            var reversedTiles = [];
            var that = this;

            _(iterations).each(function (xIteration) {
                _(iterations).each(function (yIteration) {
                    reversedTiles = reversedTiles.concat(that._expectReversesInOneDirection(targetTile, piece, xIteration, yIteration));
                });
            });

            return reversedTiles;
        },

        isLegalPlacement: function (targetTile, piece) {
            return _(targetTile.getPiece()).isNull() && this.expectReverses(targetTile, piece).length > 0;
        },

        onAddNewPiece:function (tile, piece) {
            _(this.expectReverses(tile, piece)).each(function (reversedTile) {
                reversedTile.reversePiece();
            });
        },

        countPieces : function (piece) {
            var sum = 0;
            this.tiles.each(function (tile) {
                if(!_(tile.getPiece()).isNull() && tile.getPiece().face ==  piece.face) {
                    sum++;
                }
            });
            return sum;
        },

        getAllLegalPlacement: function (piece) {
            var _this = this;
            var legalPlacements = [];
            _this.tiles.each(function (tile) {
                if(_this.isLegalPlacement(tile, piece)) {
                    legalPlacements.push(tile);
                }
            });
            return legalPlacements;
        },

        getAllLegalPlacementWithReverses: function (piece) {
            var _this = this;
            var legalPlacements = [];
            _this.tiles.each(function (tile) {
                if (_(tile.getPiece()).isNull()) {
                    var reverses = _this.expectReverses(tile, piece);
                    if(reverses.length > 0) {
                        legalPlacements.push({tile: tile, reverses: reverses});
                    }
                }
            });
            return legalPlacements;
        }

    };

    return Board;

});
