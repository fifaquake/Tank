(function(){
	var socket = io();
	var id = 0;
	// create an new instance of a pixi stage
	var stage = new PIXI.Stage(0x000000);

	// create a renderer instance
	var renderer = PIXI.autoDetectRenderer(800, 600);//TODO: Define screen width/height on server?


	// add the renderer view element to the DOM
	document.body.appendChild(renderer.view);

	function animate() {

		requestAnimFrame(animate);

		// render the stage   
		renderer.render(stage);
	}

	$(document).keydown(function (event) {
		switch (event.keyCode) {
			case 37:
				moveLeft();
				break;
			case 38:
				moveUp();
				break;
			case 39:
				moveRight();
				break;
			case 40:
				moveDown();
				break;
		}
	});

	// should sent messages to server
	function moveLeft() {
		 socket.emit('left', { 'id': id });
	}

	function moveRight() {
		 socket.emit('right', { 'id': id});
	}

	function moveUp() {
		 socket.emit('up', { 'id': id});
	}

	function moveDown() {
		 socket.emit('down', { 'id': id });
	}

	socket.on('welcome', function(data){
		if (!data) return;

		id = data.id;
	});

	socket.on('update', function(data){
		if (!data) return;
		
		if (stage.children.length > 0) {
			stage.removeChildren(0, stage.children.length);
		}

		var tanks = data.tanks;

		for (var i = 0; i < tanks.length; i++) {
			var curTank = tanks[i];
			if (null === curTank) continue;
			var playerResource ='resources/images/' + curTank.resource;
			var playerTexture = PIXI.Texture.fromImage(playerResource);
			// create a new Sprite using the texture
			var player = new PIXI.Sprite(playerTexture);
			// center the sprites anchor point
			player.anchor.x = 0.5;
			player.anchor.y = 0.5;

			// move the sprite to the center of the screen
			player.position.x = curTank.x;
			player.position.y = curTank.y;
			stage.addChild(player);
		}

		requestAnimFrame(animate);
	});

})();
