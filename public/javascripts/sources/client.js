(function(){
	var socket = io();
	var stage, renderer;
	var canvasWidth, canvasHeight;

	function animate() {
		requestAnimFrame(animate);

		// render the stage   
		renderer.render(stage);
	}

	requestAnimFrame(animate);

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

	function endWith(target, end)
	{
		var reg=new RegExp(end+"$");
		return reg.test(target); 
	}

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

	function refreshStage(data)
	{
		var newDatas = data.objects;

		//Keep exist data
		for (var existIndex = stage.children.length - 1; existIndex >= 0; existIndex--)
		{
			var existObject = stage.children[existIndex];

			var existInNew = false;
			for(var newIndex = 0; newIndex < newDatas.length; newIndex++)
			{
				var newData = newDatas[newIndex];
				if (null === newData) continue;
				if( existObject.position.x == newData.x &&
					existObject.position.y == newData.y &&
					endWith(existObject.texture.baseTexture.imageUrl, newData.resource))
					{
						newDatas.splice(newIndex, 1);//Remove the exist data
						existInNew = true;
						break;
					}			
			}

			if(!existInNew)
			{
				stage.children.splice(existIndex, 1);
			}
		}

		//Add new data
		for (var i = 0; i < newDatas.length; i++) {
			var curObj = newDatas[i];
			if (null === curObj) continue;
			var curobjectResource ='resources/images/' + curObj.resource;
			var curobjectTexture = PIXI.Texture.fromImage(curobjectResource);
			// create a new Sprite using the texture
			var curobject = new PIXI.Sprite(curobjectTexture);
			// center the sprites anchor point
			curobject.anchor.x = 0.5;
			curobject.anchor.y = 0.5;

			// move the sprite to the center of the screen
			curobject.position.x = curObj.x;
			curobject.position.y = curObj.y;
			stage.addChildAt(curobject, 0);
		}

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
		
		refreshStage(data);
	});
})();
