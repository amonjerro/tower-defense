enemies = (function(){
	var spawnRate = 3000;
	var spawnTicker = 0;
	var ticksToMove = 4;
	var tickSpeed = 300;
	var enemyRadius = 10;
	var maxPopulation = 10;
	var spawnTimer = {};
	var updateTimer = {};
	var layer = {};
	var path = [];
	var enemyMap = [];

	function Enemy(){
		this.hp = 10;
		this.currentPosition = 0;
		this.currentTick = 0;
		this.update = () =>{
			this.currentTick++;
			if (this.currentTick === ticksToMove){
				this.currentTick = 0;
				if (this.currentPosition >= path.length){
					//Destroy this enemy and deal damage to player
					
				} else {
					let position = path[this.currentPosition]
					this.currentPosition++;
					let newPosition = path[this.currentPosition]
					enemyMap[newPosition.y][newPosition.x] = this;
					enemyMap[position.y][position.x] = null;
				}
			}
		}
	}

	return{
		spawn : function(){
			spawnTicker += 20;
			if (spawnTicker == spawnRate){
				spawnTicker = 0;
				if (enemyMap[path[0].y][path[0].x] === null){
					enemyMap[path[0].y][path[0].x] = new Enemy();
				}
			}
		},
		clearCanvas:function(){
			layer.clearRect(0,0,canvasi.layer1.width,canvasi.layer1.height);
		},
		pause:function(){
			clearInterval(spawnTimer)
			clearInterval(updateTimer)
		},
		resume:function(){
			spawnTimer = setInterval(()=>{
				this.spawn();
			},20);
			updateTimer = setInterval(()=>{
				this.updateEnemies();
			},tickSpeed);
		},
		startSpawner:function(){
			spawnTimer = setInterval(()=>{
				this.spawn();
			},20)
		},
		startUpdateTimer:function(){
			updateTimer = setInterval(()=>{
				this.updateEnemies();
			},tickSpeed)
		},
		setLayer:function(incoming){
			layer = incoming;
			layer.strokeStyle = '#194E94';
			layer.fillStyle = '#296EB4';
		},
		setPath:function(incoming){
			console.log(incoming)
			path = incoming
			this.startSpawner();
			this.startUpdateTimer();
		},
		setMap:function(map){
			for (let i = 0; i < map.length; i++){
				enemyMap.push([])
				for (let j = 0; j < map[i].length; j++){
					enemyMap[i].push(null)
				}
			}
		},
		updateEnemies:function(){
			this.clearCanvas();
			layer.beginPath();
			for (let i = 0; i < path.length; i++){
				let pathPosition = path[i]
				if (enemyMap[pathPosition.y][pathPosition.x] !== null){
					let enemy = enemyMap[pathPosition.y][pathPosition.x];
					enemy.update();
					this.drawEnemy(enemy);
				}
			}
			layer.fill()
			layer.stroke()
		},
		drawEnemy:function(enemy){
			let changeInX = path[enemy.currentPosition].y-path[enemy.currentPosition+1].y == 0;
			var centerX = 0;
			var centerY = 0;
			if (changeInX){
				let changeDirection = path[enemy.currentPosition].x-path[enemy.currentPosition+1].x
				centerY = path[enemy.currentPosition].y*tileHeight+(Math.floor(tileHeight/2))
				centerX = path[enemy.currentPosition].x*tileWidth+(enemyRadius*(enemy.currentTick)*(-1*changeDirection));
			} else {
				let changeDirection = path[enemy.currentPosition].y-path[enemy.currentPosition+1].y
				centerY = path[enemy.currentPosition].y*tileHeight+(enemyRadius*(enemy.currentTick)*(-1*changeDirection));
				centerX = path[enemy.currentPosition].x*tileWidth+(Math.floor(tileWidth/2));
			}
	
			layer.moveTo(centerX,centerY);
			layer.arc(centerX,centerY,enemyRadius,0,2*Math.PI);
		}
	}
})();