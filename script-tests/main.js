requirejs.config({
    baseUrl: "scripts",
    paths: {
        'jquery':"lib/jquery/jquery",
        'jquery.easing':"lib/jquery/jquery.easing.1.3",
        'underscore':"lib/underscore/underscore",
        'qunit':"http://code.jquery.com/qunit/qunit-git"
    },
    shim: {
        'jquery.easing': ['jquery']
    }
});

requirejs([
    'utilities',
    'qunit'
], function (Utilities) {

    test("Utilities.createFilledTwoDimensionalArray", function () {
        equal(Utilities.createFilledTwoDimensionalArray(10, 10, function(x, y) { return x + "-" + y })[2][4], "2-4")
    });

    test("Utilities.foreachTwoDimensionalArray", function () {
        var array = Utilities.createFilledTwoDimensionalArray(10, 10, function(x, y) { return x + "-" + y });
        var object = {};
        Utilities.foreachTwoDimensionalArray(array, function(value, x, y) {
            object["key" + x + "_" + y] = value;
        });
        equal(object.key3_5, "3-5")
    });

});
