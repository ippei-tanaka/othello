define([
    'jquery',
    'underscore'
], function ($, _) {

    function ImageLoadingComponent(imagePaths) {

        var onFinishLoading = function () {},
            onStartLoading = function () {},
            onFinishAllLoadings = function () {},

            imageObjects = _(imagePaths).map(function (imagePath, index, list) {

                var imageObject = new Image(),
                    nextImageObject = list[index + 1];

                imageObject.othlloImageIndex = index;

                imageObject.othlloImagePath = imagePath;

                imageObject.startLoadingOthelloImageFile = function () {
                    this.src = this.othlloImagePath;
                    onStartLoading(this.othlloImageIndex, this);
                };

                if (nextImageObject) {
                    imageObject.onload = function () {
                        onFinishLoading(this.othlloImageIndex, this);
                        imageObjects[index + 1].startLoadingOthelloImageFile();
                    }
                } else {
                    imageObject.onload = function () {
                        onFinishLoading(this.othlloImageIndex, this);
                        onFinishAllLoadings(imageObjects);
                    };
                }
                return imageObject;
            });

        this.startLoading = function () {
            imageObjects[0].startLoadingOthelloImageFile();
        };

        this.onFinishLoading = function (callback) {
            onFinishLoading = callback;
        };

        this.onStartLoading = function (callback) {
            onStartLoading = callback;
        };

        this.onFinishAllLoadings = function (callback) {
            onFinishAllLoadings = callback;
        };
    }

    return ImageLoadingComponent;
});