(function(){
	var socket = io();
	var stage, renderer;
	var canvasWidth, canvasHeight;

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

	function playSound(name) {
		var ss = document.getElementById(name);
		ss.play();
	}
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

	function fire() {
		playSound('fire');
		socket.emit('fire', null);
	}

	socket.on('welcome', function(data){
		canvasWidth = data.width;
		canvasHeight = data.height;

		// create an new instance of a pixi stage
		stage = new PIXI.Stage(0x000000);
		// create a renderer instance
		renderer = PIXI.autoDetectRenderer(canvasWidth, canvasHeight);
		// add the renderer view element to the DOM
		document.body.appendChild(renderer.view);
	});

	socket.on('update', function(data){
		if (!data) return;
		
		if (stage.children.length > 0) {
			stage.removeChildren(0, stage.children.length);
		}

		var tanks = data.tanks;
		var missiles = data.missiles;

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
		
		for (i = 0; i < missiles.length; i++) {
			var curMissile = missiles[i];
			if (null === curMissile) continue;
			var missileResource ='resources/images/' + curMissile.resource;
			var missileTexture = PIXI.Texture.fromImage(missileResource);
			// create a new Sprite using the texture
			var missile = new PIXI.Sprite(missileTexture );
			// center the sprites anchor point
			missile.anchor.x = 0.5;
			missile.anchor.y = 0.5;

			// move the sprite to the center of the screen
			missile.position.x = curMissile.x;
			missile.position.y = curMissile.y;
			stage.addChild(missile);
		}

		requestAnimFrame(animate);
	});
})();
