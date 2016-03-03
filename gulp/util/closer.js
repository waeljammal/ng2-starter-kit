(function($window, $document, bs) {

    var socket = bs.socket;

    socket.on("disconnect", function (client) {
        window.close();
    });

})(window, document, ___browserSync___);