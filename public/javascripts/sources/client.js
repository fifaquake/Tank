(function(){
	var socket = io();
	socket.on('welcome', function(data){

		// define the resource path for current player.
		var playerUpResource = 'resources/images/' + data.resource + 'U.gif';
		var playerDownResource = 'resources/images/' + data.resource + 'D.gif';
		var playerLeftResource = 'resources/images/' + data.resource + 'L.gif';
		var playerRightResource = 'resources/images/' + data.resource + 'R.gif';

		// create an new instance of a pixi stage
		var stage = new PIXI.Stage(0x000000);

		// create a renderer instance
		var renderer = PIXI.autoDetectRenderer(800, 600);

		// add the renderer view element to the DOM
		document.body.appendChild(renderer.view);
		requestAnimFrame(animate);

		// create a texture from an image path
		var playerUpTexture = PIXI.Texture.fromImage(playerUpResource);
		var playerDownTexture = PIXI.Texture.fromImage(playerDownResource);
		var playerLeftTexture = PIXI.Texture.fromImage(playerLeftResource);
		var playerRightTexture = PIXI.Texture.fromImage(playerRightResource);

		// create a new Sprite using the texture
		var player = new PIXI.Sprite(playerUpTexture);

		// center the sprites anchor point
		player.anchor.x = 0.5;
		player.anchor.y = 0.5;

		// move the sprite to the center of the screen
		player.position.x = 200;
		player.position.y = 150;

		stage.addChild(player);


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

		// todo
		// should sent messages to server
		function moveLeft() {
			player.setTexture(playerLeftTexture);
			player.position.x -= 10;
		}

		function moveRight() {
			player.setTexture(playerRightTexture);
			player.position.x += 10;
		}

		function moveUp() {
			player.setTexture(playerUpTexture);
			player.position.y -= 10;
		}

		function moveDown() {
			player.setTexture(playerDownTexture);
			player.position.y += 10;
		}
	});
})();
