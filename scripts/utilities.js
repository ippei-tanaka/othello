define(['underscore'], function (_) {

    var Utilities = {

        createFilledTwoDimensionalArray : function (xLength, yLength, value) {

            var array = new Array(xLength);

            for (var x = 0; x < xLength; x++) {
                array[x] = new Array(yLength);
                for (var y = 0; y < yLength; y++) {
                    if (_(value).isFunction()) {
                        array[x][y] = value(x, y);
                    }
                    else {
                        array[x][y] = value;
                    }
                }

            }

            array.each = function (callback) {
                Utilities.foreachTwoDimensionalArray(array, function (tile, x, y) {
                    callback(tile, x, y);
                });
            };

            array.flatten = function () {
                var flattenedArray = [];
                Utilities.foreachTwoDimensionalArray(array, function (tile, x, y) {
                    flattenedArray.push(tile);
                });
                return flattenedArray;
            };

            return array;
        },

        foreachTwoDimensionalArray : function(array, callback) {
            for (var x = 0; x < array.length; x++) {
                for (var y = 0; y < array[x].length; y++) {
                    callback(array[x][y], x, y);
                }
            }
        }
    };

    return Utilities;

});
