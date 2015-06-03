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
		posX : mainSettings.canvas.width / 2 - 10,
		posY : mainSettings.canvas.height - 10,
		direction: null,
		weapon : {
			power : 5
		},
		speed : 1,
		acceleration : 1,
		lives : 3
	};
	
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
		this.speed = 1;
		this.health = 100;
		
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
	
	var enemy = {
		size : 5,
		energy : 100,
		speed : 0,
		acceleration : 1
	};
	
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
		ctx.fillRect(player.posX, player.posY, 10, 10);
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
			player.direction = 'left';
			player.speed++;
			player.posX -= player.speed * modifier;
		}
		if (keys.right in keysDown) {
			player.direction = 'right';
			player.speed++;
			player.posX += player.speed * modifier;
		}
		if (!(keys.left in keysDown) && player.direction == 'left') {
			if (player.speed > 0) {
				player.speed--;
				player.posX -= player.speed * modifier;
			}
		}
		if (!(keys.right in keysDown) && player.direction == 'right') {
			if (player.speed > 0) {
				player.speed--;
				player.posX += player.speed * modifier;
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
		var foe = new Foe(180, 75);
		foe.draw();
		foes.push(foe);
	}
	
	var updateFoes = function(modifier) {
		for (i=0; i < foes.length; i++) {
			foes[i].posX = Math.floor(Math.random() * 100);
			foes[i].draw();
		}
	}
	
	var wallCollision = function() {
		console.log(ctx.isPointInPath(0, canvas.height));
		//if (player.direction == 'left')
	}
	
	var renderAssets = function () {
		createBackground();
		ctx.putImageData(starfieldBkg, 0, 0);
		drawPlayer();
	}
	
	/// Inicia el juego
	var initGame = function() {
		var now = Date.now();
		var delta = now - then;
		
		updatePlayer(delta / 100);
		renderAssets();
		if (shoots.length > 0)
			updateShots(delta / 10);
		updateFoes(delta / 100);
		
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