define([
    'jquery',
    'underscore'
], function (
    $,
    _
    ) {

    var instance = null;
    var $element = $("<div />");

    var QueueComponent = function () {
        if(instance !== null){
            throw new Error("Cannot instantiate more than one QueueComponent, use QueueComponent.getInstance()");
        }
    };

    QueueComponent.prototype = {

        addByPassQueue : function (func, context, argsArray) {

            context = context ? context : {};
            argsArray = argsArray ? argsArray : [];

            $element.queue(function(next) {
                func.apply(context, argsArray);
                next();
            });
            return this;
        },

        addWaitingQueue : function (func, context, argsArray) {

            context = context ? context : {};
            argsArray = argsArray ? argsArray : [];

            $element.queue(function(next) {
                func.apply(context, [next].concat(argsArray));
            });
            return this;
        },

        goForward: function () {
            $element.dequeue();
        }

    };

    QueueComponent.getInstance = function(){
        if(instance === null){
            instance = new QueueComponent();
        }
        return instance;
    };

    return QueueComponent.getInstance();

});