window.onload = function (){
	//Inicialización del objeto canvas y el context.
	var canvas = document.getElementById("canvas-main");
	var ctx = canvas.getContext("2d");
	
	//Configuración básica
	var mainSettings = {
		canvas : { 
			width: 640,
			height: 480
		},
		starfield : {
			density : 0.1
		}
	};
	
	var player = {
		posX : mainSettings.canvas.width / 2,
		posY : mainSettings.canvas.height,
		width: 10,
		height: 10,
		direction: null,
		weapon : {
			power : 5
		},
		speed : 1,
		maxSpeed: 35,
		acceleration : 1,
		lives : 3
	};

	var walls = [
		{	
			posX : 0,
			posY : canvas.height,
			width : 1,
			height : canvas.height
		},
		{
			posX : canvas.width,
			posY : canvas.height,
			width : 1,
			height : canvas.height
		}
	]
	
	var CShot = function(posX, posY) {	
		this.posX = posX;
		this.posY = posY;
		this.speed = 1;
		this.color = "red";
		
		this.isAlive = function () {
			if (this.posY > 0)
				return true;
			else return false;
		};
				
		this.draw = function () {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.posX, this.posY, 3, 15);
		};
	}
	
	function Foe(posX, posY) {
		this.posX = posX;
		this.posY = posY;
		this.speed = 3;
		this.health = 100;

		this.direction = null;
		
		this.isAlive = function () {
			if (this.health <= 0)
				return false;
			else return true;
		}
		
		this.draw = function () {
			ctx.fillStyle = "yellow";
			ctx.fillRect(this.posX, this.posY, 5, 5);
		}
	}
	
	var keys = {
		left: 37,
		up : 38,
		right: 39,
		down: 40,
		spacebar: 32
	};
	
	var keysDown = {};
	
	var shoots = [];
	
	var foes = [];
	
	/**
	 * Devuelve un color aleatorio
	 * @returns string ("rgb(r,g,b)")
	 */
	function pickRandomColor() {
		var color = [];
		for (i=0; i<3; i++) {
			color.push(Math.round(Math.random() * 255));
		}
		return 'rgb(' + color.join(',') + ')';
	}
	
	/**
	 * Devuelve unas coordenadas aleatorias x,y
	 * @returns array [x,y]
	 */
	function getRandomCoords() {
		var coords = [];
			coords.push(Math.round(Math.random() * mainSettings.canvas.width));
			coords.push(Math.round(Math.random() * mainSettings.canvas.height));
		return coords;
	}
	
	/**
	 * Crea el background del juego
	 */
	function createBackground() {
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, 640, 480);
	}
	
	/**
	 * Crea un fondo de estrellas
	 */
	function createStarField(density) {
		if (density > 0) {
			var position = getRandomCoords();
			ctx.fillStyle = pickRandomColor();
			ctx.fillRect(position[0], position[1], 2, 2);			
			return createStarField(density - 0.001);
		}
		else {
			starfieldBkg = ctx.getImageData(0, 0, canvas.width, canvas.height);
		}
	}
	
	function drawPlayer() {
		ctx.fillStyle = "cyan";
		ctx.fillRect(player.posX, player.posY - player.height, player.width, player.height);
	}

	function drawWalls() {
		ctx.fillStyle = "red";
		ctx.fillRect(0, 0, 1, canvas.height);
		ctx.fillRect(canvas.width - 1, 0, 1, canvas.height);
	}
	
	addEventListener("keydown", function(e){
		if (e.keyCode == keys.spacebar) {
			var shot = new CShot(player.posX, player.posY);
			shot.draw();
			shoots.push(shot);
		}
		keysDown[e.keyCode] = true;
	}, false);
	
	addEventListener("keyup", function(e){
		delete keysDown[e.keyCode];
	}, false);
	
	var updatePlayer = function(modifier) {
		if (keys.up in keysDown) {
			console.log('up');
		}
		if (keys.down in keysDown) {
			console.log('down');
		}
		if (keys.left in keysDown) {
			if (!collision(player, walls[0])) {
				player.direction = 'left';
				if (player.speed < player.maxSpeed)
					player.speed++;
				player.posX -= player.speed * modifier;	
			}
			else {
				player.direction = 'right';
				player.posX += player.speed * modifier;
			}
		}
		if (keys.right in keysDown) {
			if (!collision(player, walls[1])) {
				player.direction = 'right';
				if (player.speed < player.maxSpeed)
					player.speed++;
				player.posX += player.speed * modifier;
			}
			else {
				player.direction = 'left';
				player.posX -= player.speed * modifier;
			}
		}
		if (!(keys.left in keysDown) && player.direction == 'left') {
			if (player.speed > 0 && !collision(player, walls[0])) {
				player.speed--;
				player.posX -= player.speed * modifier;
			}
			else {
				player.direction = 'right';
				player.posX += player.speed * modifier;
			}
		}
		if (!(keys.right in keysDown) && player.direction == 'right') {
			if (player.speed > 0 && !collision(player, walls[1])) {
				player.speed--;
				player.posX += player.speed * modifier;
			}
			else {
				player.direction = 'left';
				player.posX -= player.speed * modifier;
			}
		}	
	}
		
	var updateShots = function(modifier) {
		for (i=0; i<shoots.length; i++){
			if (shoots.length > 0) {
				if (shoots[i].isAlive(shoots[i])){
					shoots[i].posY -= shoots[i].speed * modifier;
					shoots[i].draw(shoots[i]);
				}
				else {
					shoots.shift(shoots[i]);
				}
			}
		}
	}
	
	var initFoes = function () {
		for(i=0; i<4; i++){
			var foe = new Foe(180 + 100	*i, 75);
			foe.direction = 'left';
			foe.draw();
			foes.push(foe);
		}
	}
	
	var updateFoes = function(modifier) {
		for (i=0; i < foes.length; i++) {
			if(foes[i].posX <= 0){
				foes[i].direction = 'right';
			}else if(foes[i].posX > mainSettings.canvas.width){
				foes[i].posY += 10;
				foes[i].direction = 'left';
			}

			if(foes[i].direction == 'left'){
				foes[i].posX -= foes[i].speed * modifier;
			}else if(foes[i].direction == 'right'){
				foes[i].posX += foes[i].speed * modifier;
			}
			foes[i].draw();
		}
	}
	
	var collision = function(objA, objB) {
		if (objA.posX < objB.posX + objB.width &&
			objA.posX + objA.width > objB.posX &&
			objA.posY < objB.posY + objB.height &&
			objA.height + objA.posY > objB.posY
			) {
			return true;
		}else{
			
			return false;
		}
		// console.log(ctx.isPointInPath(0, canvas.height));
		//if (player.direction == 'left')
	}
	
	var renderAssets = function () {
		createBackground();
		ctx.putImageData(starfieldBkg, 0, 0);
		drawPlayer();
		drawWalls();
	}
	
	/// Inicia el juego
	var initGame = function() {
		var now = Date.now();
		var delta = now - then;
		
		updatePlayer(delta / 100);
		renderAssets();
		if (shoots.length > 0)
			updateShots(delta / 10);
		updateFoes(delta / 10);
		then = now;
		
		//console.log(player.speed);
		
		//Loop
		window.requestAnimationFrame(initGame);
	}
	
	var then = Date.now();
	var starfieldBkg = null;
	createStarField(mainSettings.starfield.density);
	initFoes();
	initGame();
}