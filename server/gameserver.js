var BTTank = require('./objects/bttank.js');

function IsCrash(tank1, tank2)
{
	if ((tank1.x - tank2.x)<(tank1.width+tank2.width)/2 && (tank1.y - tank2.y) < (tank1.height + tank2.height)/2)
		return true;
	else
		return false;
}

exports.startGameServer = function (expressServer) {
    var clientCount = 0;
    var io = require('socket.io')(expressServer);
	var p1Tank = null;
	var p2Tank = null;
    io.on('connection', function (socket) {
        clientCount++;
        socket.emit('welcome', { 'id': clientCount });

        console.log('a user connected');

        var resource;
        if (clientCount === 1) {
			p1Tank = new BTTank('p1tankU.gif', 0, 0);
            resource = p1Tank.resource;
        } else if (clientCount === 2){
			p2Tank = new BTTank('p2tankU.gif', 0 , 0);
            resource = p2Tank.resource;
        } else {
			return;
		}
		io.emit('update', { 'tanks': [p1Tank, p2Tank] });


        socket.on('disconnect', function () {
			// how to know which tank is removed ?
            clientCount--;
            console.log('user disconnected');
        });

		socket.on('left', function(data){
			var id = data.id;
			var curTank =((id == 1) ? p1Tank : p2Tank);
			curTank.x = curTank.x - 10;
			if(curTank.x <= curTank.width/2)//boundary check
				curTank.x = curTank.width/2;

			curTank.resource = 'p' + id + 'tankL.gif';

			io.emit('update', { 'tanks': [p1Tank, p2Tank] });
		});
		socket.on('right', function(data){
			var id = data.id;
			var curTank =((id == 1) ? p1Tank : p2Tank);
			curTank.x = curTank.x + 10;
			if(curTank.x >= 800 - curTank.width/2)//boundary check
				curTank.x = 800-curTank.width/2;

			curTank.resource = 'p' + id + 'tankR.gif';

			io.emit('update', { 'tanks': [p1Tank, p2Tank] });
		});
		socket.on('up', function(data){
			var id = data.id;
			var curTank =((id == 1) ? p1Tank : p2Tank);
			curTank.y = curTank.y - 10;
			if(curTank.y <= curTank.height/2)//boundary check
				curTank.y = curTank.height/2;

			curTank.resource = 'p' + id + 'tankU.gif';

			io.emit('update', { 'tanks': [p1Tank, p2Tank] });
		});
		socket.on('down', function(data){
			var id = data.id;
			var curTank =((id == 1) ? p1Tank : p2Tank);
			curTank.y = curTank.y + 10;
			if(curTank.y > 600 - curTank.height/2)//boundary check
				curTank.y = 600- curTank.height/2;

			curTank.resource = 'p' + id + 'tankD.gif';

			io.emit('update', { 'tanks': [p1Tank, p2Tank] });
		});
    });
};
