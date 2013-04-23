define([
    'jquery',
    'underscore',
    'models/player',
    'models/piece',
    'models/board',
    'models/brain',
    'views/tileView',
    'views/gameView',
    'controllers/queueComponent'
], function ($, _, Player, Piece, Board, Brain, TileView, GameView, QueueComponent) {

    var GameController = function () {

        var _this = this;

        this.board = new Board;

        this.board.tiles.each(function (tile) {

            tile.view = new TileView(tile, QueueComponent);
            tile.view.$element.on("click", {game:_this, tile:tile}, _this.onClickTile);

            tile.onReversePiece(QueueComponent.addWaitingQueue, null, [tile.view.renderPieceReverse, tile.view]);
            tile.onPlacePiece(QueueComponent.addWaitingQueue, null, [tile.view.renderPiecePlacement, tile.view]);
            tile.onPlacePiece(_this.board.onAddNewPiece, _this.board);
            tile.onRemovePiece(tile.view.renderEmptyTile, tile.view);

        });

        this.goTitlePage();

    };

    var gameView = new GameView();

    GameController.prototype = {

        goTitlePage: function () {
            var _this = this;
            gameView.$title.one('click', function () {
                QueueComponent.addWaitingQueue(gameView.deleteTitle, gameView);
                QueueComponent.addByPassQueue(_this.initialize, _this);
            });
        },

        initialize:function () {

            QueueComponent.addByPassQueue(gameView.deleteMessage);

            this.currentPlayerIndex = 0;
            this.currentAllLegalTiles = [];
            this.sequentialSkipTurnCount = 0;
            this.onClickTileIsAvailable = false;
            this.players = [];

            this.board.tiles.each(function (tile) {
                tile.removePiece();
            });

            this.setGameConfiguration();
        },

        setGameConfiguration:function () {

            var _this = this;

            QueueComponent.addWaitingQueue(gameView.showMenu, gameView);
            QueueComponent.addByPassQueue(function () {
                gameView.$menuStartButton.one("click", function () {
                    QueueComponent.addWaitingQueue(gameView.hideMenu, gameView);
                    QueueComponent.addByPassQueue(function () {

                        var player1, player2;
                        if (gameView.getBrain1() == Player.HUMAN && gameView.getBrain2() == Player.HUMAN ) {
                            player1 = new Player('Player1', Player.DARK);
                            player2 = new Player('Player2', Player.LIGHT);
                        } else if (gameView.getBrain1() == Player.COMPUTER && gameView.getBrain2() == Player.HUMAN ) {
                            player1 = new Player('Computer', Player.DARK, new Brain);
                            player2 = new Player('You', Player.LIGHT);
                        } else if (gameView.getBrain1() == Player.HUMAN && gameView.getBrain2() == Player.COMPUTER ) {
                            player1 = new Player('You', Player.DARK);
                            player2 = new Player('Computer', Player.LIGHT, new Brain);
                        } else {
                            player1 = new Player('Computer1', Player.DARK, new Brain);
                            player2 = new Player('Computer2', Player.LIGHT, new Brain);
                        }
                        _this.players = [player1, player2];

                        _this.board.tiles[3][3].placePiece(new Piece(Piece.LIGHT));
                        _this.board.tiles[3][4].placePiece(new Piece(Piece.DARK));
                        _this.board.tiles[4][3].placePiece(new Piece(Piece.DARK));
                        _this.board.tiles[4][4].placePiece(new Piece(Piece.LIGHT));

                        _this.initTurn();
                    });
                });
            });
        },

        initTurn:function () {
            var currentPlayer = this.players[this.currentPlayerIndex];
            this.currentAllLegalTiles = this.board.getAllLegalPlacement(currentPlayer.getNewPiece());
            QueueComponent.addByPassQueue(gameView.showCurrentStatus, null, [currentPlayer]);
            QueueComponent.addByPassQueue(this.checkTurnStatus, this);
        },

        checkTurnStatus:function () {

            if (this.currentAllLegalTiles.length == 0) {

                this.sequentialSkipTurnCount++;
                QueueComponent.addByPassQueue(this.goToNextTurn, this);

            } else {

                this.sequentialSkipTurnCount = 0;
                var currentPlayer = this.players[this.currentPlayerIndex];
                var piece = currentPlayer.getNewPiece();

                if (currentPlayer.brain) {

                    var tile = currentPlayer.brain.getAction(this.board, piece);

                    QueueComponent.addByPassQueue(this.executeTurn, this, [tile, piece])

                } else {

                    QueueComponent.addByPassQueue(gameView.renderCurrentGuide, null, [this.currentAllLegalTiles, piece]);
                    this.onClickTileIsAvailable = true;

                }
            }
        },

        onClickTile:function (event) {
            var _this = event.data.game;

            if (!_this.onClickTileIsAvailable) {
                return;
            }
            _this.onClickTileIsAvailable = false;

            var tile = event.data.tile;
            var piece = _this.players[_this.currentPlayerIndex].getNewPiece();
            var legal = _(_this.currentAllLegalTiles).find(function (legalTile) {
                return legalTile.x == tile.x && legalTile.y == tile.y;
            });

            if (legal) {
                QueueComponent.addByPassQueue(_this.executeTurn, _this, [tile, piece]);
            } else {
                _this.onClickTileIsAvailable = true;
            }

        },

        executeTurn:function (tile, piece) {
            QueueComponent.addByPassQueue(gameView.deleteCurrentGuide, null, [this.board.tiles.flatten()]);
            tile.placePiece(piece);
            QueueComponent.addByPassQueue(this.goToNextTurn, this);
        },

        goToNextTurn:function () {
            if (this.sequentialSkipTurnCount >= 2) {
                this.goToGameOver();
            } else {
                this.currentPlayerIndex = 1 - this.currentPlayerIndex;
                this.initTurn();
            }
        },

        goToGameOver:function () {
            var score0 = this.board.countPieces(this.players[0].getNewPiece());
            var score1 = this.board.countPieces(this.players[1].getNewPiece());
            var player0 = this.players[0];
            var player1 = this.players[1];
            QueueComponent.addByPassQueue(gameView.showGameResult, null, [score0, score1, player0, player1]);

            var _this = this;
            QueueComponent.addWaitingQueue(gameView.showPlayAgain, gameView);
            QueueComponent.addByPassQueue(function () {
                gameView.$playAgain.one('click', function () {
                    QueueComponent.addWaitingQueue(gameView.hidePlayAgain, gameView);
                    QueueComponent.addByPassQueue(_this.initialize, _this);
                });
            });
        }

    };

    return GameController;
});
