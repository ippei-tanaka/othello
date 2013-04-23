define([
    'jquery',
    'underscore',
    'models/board',
    'models/piece'
], function ($, _, Board, Piece) {

    var Brain = function () {

    };

    Brain.prototype = {

        getNewSimulatedBoard:function (board) {
            var simulatedBoard = new Board;
            board.tiles.each(function (tile, x, y) {
                var piece = tile.getPiece();
                if (piece) {
                    simulatedBoard.tiles[x][y].placePiece(new Piece(piece.face));
                }
            });
            return simulatedBoard;
        },

        getExpectedValue: function (simulatedBoard, myPiece, currentPlayersPiece, depth) {

            if (depth <= 0) {
                return 0;
            }
            depth--;

            var expectedValue = 0;
            var discount = 0.7;

            var opponentsPiece = new Piece(myPiece.back);
            var myAllLegalTiles = simulatedBoard.getAllLegalPlacement(myPiece);
            var opponentAllLegalTiles = simulatedBoard.getAllLegalPlacement(opponentsPiece);

            var isMyTurn = currentPlayersPiece.face == myPiece.face;
            var _this = this;



            if (myAllLegalTiles.length == 0 && opponentAllLegalTiles.length) {
                if (simulatedBoard.countPieces(myPiece) > simulatedBoard.countPieces(opponentsPiece)) {
                    return 100;
                } else {
                    return -100;
                }
            }

            var pointTiles = [];

            pointTiles.push(
                [simulatedBoard.tiles[0][0].getPiece(), 2],
                [simulatedBoard.tiles[Board.SIZE - 1][0].getPiece(), 2],
                [simulatedBoard.tiles[0][Board.SIZE - 1].getPiece(), 2],
                [simulatedBoard.tiles[Board.SIZE - 1][Board.SIZE - 1].getPiece(), 2]
            );


            _(pointTiles).each(function(pointTile){
                if (pointTile[0] && pointTile[0].face == myPiece.face) {
                    expectedValue += pointTile[1];
                }
                if (pointTile[0] && pointTile[0].face == opponentsPiece.face) {
                    expectedValue -= pointTile[1];
                }
            });

            if (myAllLegalTiles.length > opponentAllLegalTiles.length) {
                expectedValue += 1;
            } else if (myAllLegalTiles.length < opponentAllLegalTiles.length) {
                expectedValue -= 1;
            }



            if ( (isMyTurn && myAllLegalTiles.length != 0)
                || (!isMyTurn && opponentAllLegalTiles.length == 0)
                ) {

                //
                myAllLegalTiles = _(myAllLegalTiles).shuffle().slice(Math.floor(myAllLegalTiles.length * 1));
                //

                var max = 0;
                _(myAllLegalTiles).each(function (tile) {
                    var nextStateBoard = _this.getNewSimulatedBoard(simulatedBoard);
                    nextStateBoard.tiles[tile.x][tile.y].placePiece(myPiece);
                    var nextExpectedValue = _this.getExpectedValue(nextStateBoard, myPiece, opponentsPiece, depth);
                    max = Math.max(max, nextExpectedValue);
                });

                expectedValue += max * discount;

            } else {

                //
                opponentAllLegalTiles = _(opponentAllLegalTiles).shuffle().slice(Math.floor(opponentAllLegalTiles.length * 2 / 3));
                //

                var sum = 0;
                _(opponentAllLegalTiles).each(function (tile) {
                    var nextStateBoard = _this.getNewSimulatedBoard(simulatedBoard);
                    nextStateBoard.tiles[tile.x][tile.y].placePiece(opponentsPiece);
                    var nextExpectedValue = _this.getExpectedValue(nextStateBoard, myPiece, myPiece, depth);
                    sum += nextExpectedValue;
                });

                expectedValue += sum / opponentAllLegalTiles.length * discount;
            }

            return expectedValue;

        },

        simulate:function (simulatedBoard, myPiece) {

            var myAllLegalTiles = simulatedBoard.getAllLegalPlacement(myPiece);
            var _this = this;

            var expectations = _(myAllLegalTiles).map(function (tile) {
                var nextStateBoard = _this.getNewSimulatedBoard(simulatedBoard);
                nextStateBoard.tiles[tile.x][tile.y].placePiece(myPiece);
                return{
                    x: tile.x,
                    y: tile.y,
                    expectedValue: 0//_this.getExpectedValue(nextStateBoard, myPiece, new Piece(myPiece.back), 3)
                };
            });

            return _(_(expectations).shuffle()).max(function (expectation) {
                return expectation.expectedValue;
            });
        },


        getAction:function (board, piece) {

            var simulatedBoard = this.getNewSimulatedBoard(board);
            var best = this.simulate(simulatedBoard, piece);
            return board.tiles[best.x][best.y];

        }
    };

    return Brain;

});