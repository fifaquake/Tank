(function(){
	var socket = io();
	// create an new instance of a pixi stage
	var stage = new PIXI.Stage(0x000000);

	// create a renderer instance
	var renderer = PIXI.autoDetectRenderer(800, 600);

	// add the renderer view element to the DOM
	document.body.appendChild(renderer.view);

	function animate() {

		requestAnimFrame(animate);

		// render the stage   
		renderer.render(stage);
	}

	$(document).keydown(function (event) {
		switch (event.keyCode) {
			case 65: // a
				moveLeft();
				break;
			case 87: // w
				moveUp();
				break;
			case 68: // d
				moveRight();
				break;
			case 83: // s
				moveDown();
				break;
			case 74: // j
				fire();
				break;
		}
	});

	// should sent messages to server
	function moveLeft() {
		 socket.emit('left', null);
	}

	function moveRight() {
		 socket.emit('right', null);
	}

	function moveUp() {
		 socket.emit('up', null);
	}

	function moveDown() {
		 socket.emit('down', null);
	}

	socket.on('welcome', function(data){
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
