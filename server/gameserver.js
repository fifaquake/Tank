/// <reference path="../d.ts.files/node.d.ts" />
exports.startGameServer = function (expressServer) {
    var clientCount = 0;
    var io = require('socket.io')(expressServer);
    io.on('connection', function (socket) {
        clientCount++;
        console.log('a user connected');
        socket.on('disconnect', function () {
            clientCount--;
            console.log('user disconnected');
        });

        var resource;
        if (clientCount === 1) {
            resource = 'p1tank';
        } else {
            resource = 'p2tank';
        }
        socket.emit('welcome', { 'resource': resource });
    });
};
