define([
    'jquery',
    'underscore',
    'models/piece'
], function(
    $,
    _,
    Piece
    ){

    var Tile = function (arg) {
        this.x = arg.x;
        this.y = arg.y;
        this.view = null;
        this._piece = null;
        this._onChangeCallbacks = $.Callbacks();
        this._onReversePieceCallbacks = $.Callbacks();
        this._onPlacePieceCallbacks = $.Callbacks();
        this._onRemovePieceCallbacks = $.Callbacks();
    };

    Tile.prototype = {

        onChange: function (callback, context, argsArray) {
            this._onChangeCallbacks.add(this._wrapCallback(callback, context, argsArray));
        },

        onReversePiece: function (callback, context, argsArray) {
            this._onReversePieceCallbacks.add(this._wrapCallback(callback, context, argsArray));
        },

        onPlacePiece: function (callback, context, argsArray) {
            this._onPlacePieceCallbacks.add(this._wrapCallback(callback, context, argsArray));
        },

        onRemovePiece: function (callback, context, argsArray) {
            this._onRemovePieceCallbacks.add(this._wrapCallback(callback, context, argsArray));
        },

        _wrapCallback : function (callback, context, argsArray) {
            argsArray = _(argsArray).isArray() ? argsArray : [];
            context = context ? context : {};
            return function (tile, piece) {
                callback.apply(context, argsArray.concat(tile, piece))
            }
        },

        placePiece: function (piece) {
            this._piece = piece;
            this._onPlacePieceCallbacks.fire(this, piece);
            this._onChangeCallbacks.fire(this, piece);
        },

        reversePiece: function () {
            this._piece.reverse();
            this._onReversePieceCallbacks.fire(this, this._piece);
            this._onChangeCallbacks.fire(this, this._piece);
        },

        removePiece: function () {
            var pldPiece = this._piece;
            this._piece = null;
            this._onRemovePieceCallbacks.fire(this, pldPiece);
            this._onChangeCallbacks.fire(this, pldPiece);
        },

        getPiece: function () {
            return this._piece;
        }
    };

    return Tile;

});