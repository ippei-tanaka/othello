requirejs.config({
    paths:{
        'jquery':"lib/jquery/jquery",
        'jquery.easing':"lib/jquery/jquery.easing.1.3",
        'style.manipulator':"lib/style.manipulator",
        'underscore':"lib/underscore/underscore"
    },
    shim:{
        'jquery.easing':['jquery']
    }
});

requirejs([
    'jquery',
    'style.manipulator',
    'controllers/imageLoadingComponent',
    'controllers/gameController'
], function ($, styleManipulator, ImageLoadingComponent, GameController) {

    $(function () {

        var imagePaths = [
                './images/title.png',
                './images/bg_body.jpg',
                './images/bg_board.png',
                './images/bg_title.png',
                './images/bg-menu.png',
                './images/icon_piece_dark.png',
                './images/icon_piece_light.png',
                './images/piece_dark.png',
                './images/piece_light.png'
            ],
            imageDescriptions = [
                'the image of the title text',
                'the wood grain image for the background',
                'the image of the board',
                'the texture image for the title',
                'the image for the menu background',
                'the dark piece icon',
                'the light piece icon',
                'the image of the light piece',
                'the image of the dark piece'
            ],
            imageLoadingComponent = new ImageLoadingComponent(imagePaths);

        imageLoadingComponent.onStartLoading(function (index) {
            $('#loading p.message').html('Loading ' + imageDescriptions[index] + "."
                + "<br />" + "( " + (index + 1) + " / " + imagePaths.length + " )");
        });

        imageLoadingComponent.onFinishAllLoadings(function (imageObjects) {
            $('#loading p.message').html('Finished loading all images.'
                + "<br />" + "( " + imagePaths.length + " / " + imagePaths.length + " )");

            $('#title h1').append(imageObjects[0]);
            styleManipulator.insertRule('body', 'background-image:url(' + imagePaths[1] + ')');
            styleManipulator.insertRule('#board', 'background-image:url(' + imagePaths[2] + ')');
            styleManipulator.insertRule('#title-container', 'background-image:url(' + imagePaths[3] + ')');
            styleManipulator.insertRule('#menu-container, #menu-container #menu p#start-button span', 'background-image:url(' + imagePaths[4] + ')');
            styleManipulator.insertRule('#menu-container #menu h2.dark, #massage span.icon.dark', 'background-image:url(' + imagePaths[5] + ')');
            styleManipulator.insertRule('#menu-container #menu h2.light, #massage span.icon.light', 'background-image:url(' + imagePaths[6] + ')');
            styleManipulator.insertRule('#tiles table td span.dark, #tiles table td span.dark-guide', 'background-image:url(' + imagePaths[7] + ')');
            styleManipulator.insertRule('#tiles table td span.light, #tiles table td span.light-guide', 'background-image:url(' + imagePaths[8] + ')');

            $('#loading-container').removeClass('now-loading').addClass('finish-loading').delay(700).fadeOut(300).queue(function () {
                new GameController();
            });
        });

        $('#loading-container').addClass('now-loading');
        imageLoadingComponent.startLoading();
    });
});
