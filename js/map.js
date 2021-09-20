var map = (function(){
	var grid = [];
	var neighbors = [];
	var parents = {};
	var mapLayer = {};
	return {
		getMap : function(){
			return grid;
		},
		clearCanvas:function(){
			mapLayer.clearRect(0,0,canvasi.layer1.width,canvasi.layer1.height);
			mapLayer.fillStyle='#000';
			mapLayer.rect(0,0,canvasi.layer1.width,canvasi.layer1.height);
			mapLayer.fill();
		},
		getNeighbors : function(x,y){
			let localList = [];
			if (x-2 > 0){
				if (grid[y][x-2] == 0){
					localList.push({'x':x-2,'y':y, 'dir':'l',origin:{'x':x,'y':y}})
				}
			}
			if (x+2 < xLimit-1){
				if (grid[y][x+2] == 0){
					localList.push({'x':x+2,'y':y, 'dir':'r',origin:{'x':x,'y':y}})
				}
			}
			if (y-2 > 0){
				if (grid[y-2][x] == 0){
					localList.push({'x':x,'y':y-2, 'dir':'u',origin:{'x':x,'y':y}})
				}
			}
			if (y+2 <= yLimit-1){
				if (grid[y+2][x] == 0){
					localList.push({'x':x,'y':y+2, 'dir':'d',origin:{'x':x,'y':y}})
				}
			}
			while (localList.length > 0){
				let randomIndex = Math.round(Math.random()*(localList.length-1));
				neighbors.push(localList[randomIndex]);
				localList.splice(randomIndex,1);
			}
		},
		buildMaze : function(setEndingPosition){
			var position;
			while (neighbors.length > 0){
				position = neighbors.pop()
				if (grid[position.y][position.x] == 1){
					continue;
				} else {
					grid[position.y][position.x] = 1
					this.pushParent(position.x,position.y,position.origin)
					this.getNeighbors(position.x,position.y)
					this.paintCorridor(position.origin,position.dir)
				}
			}
			this.pickEndingPosition(setEndingPosition);
		},
		pickEndingPosition : function(setEndingPosition){
			let oddLocsX = [];
			for (let i = Math.floor((grid[0].length/3)*2)+1; i < grid[0].length-1; i += 2){
				oddLocsX.push(i)
			}
			let oddLocsY = [];
			for (let i = 1; i < grid.length; i += 2){
				oddLocsY.push(i)
			}
			let x = oddLocsX[Math.round(Math.random()*(oddLocsX.length-1))]
			let y = oddLocsY[Math.round(Math.random()*(oddLocsY.length-1))]
			let valid = grid[y][x] == 1 && ( (grid[y+1][x] + grid[y-1][x] + grid[y][x+1] + grid[y][x-1]) == 1);
			if (!valid){
				for (let yPos = 0; yPos < oddLocsY.length; yPos++){
					for (let xPos = 0; xPos < oddLocsX.length; xPos++){
						x = oddLocsX[xPos];
						y = oddLocsY[yPos];
						valid = grid[y][x] == 1 && ( (grid[y+1][x]%5  + grid[y-1][x]%5 + grid[y][x+1]%5 + grid[y][x-1]%5) == 1);
						if (valid){
							break;
						}
					}
					if (valid){
						break;
					}
				}
			}
			setEndingPosition(x,y);
			this.paintMapSpace(x,y,'#BB3355');
		},
		paintMapSpace:function(x,y,color='#ffffff'){
			mapLayer.fillStyle=color;
			mapLayer.fillRect(x*tileWidth,y*tileHeight,tileWidth,tileHeight);
		},
		pushParent : function(x,y,origin){
			let key = x.toString()+','+y;
			parents[key] = origin;
		},
		paintCorridor: function(origin,dir){
			if (dir == 'l'){
				this.paintMapSpace(origin.x-1,origin.y)
				grid[origin.y][origin.x-1] = 1
				this.paintMapSpace(origin.x-2,origin.y)
				grid[origin.y][origin.x-2] = 1
			}
			if (dir == 'r'){
				this.paintMapSpace(origin.x+1,origin.y)
				grid[origin.y][origin.x+1] = 1
				this.paintMapSpace(origin.x+2,origin.y)
				grid[origin.y][origin.x+2] = 1
			}
			if (dir == 'd'){
				this.paintMapSpace(origin.x,origin.y+1)
				grid[origin.y+1][origin.x] = 1
				this.paintMapSpace(origin.x,origin.y+2)
				grid[origin.y+2][origin.x] = 1
			}
			if (dir == 'u'){
				this.paintMapSpace(origin.x,origin.y-1)
				grid[origin.y-1][origin.x] = 1
				this.paintMapSpace(origin.x,origin.y-2)
				grid[origin.y-2][origin.x] = 1
			}
		},
		buildGrid : function(xLimit,yLimit,setStartingPosition,setEndingPosition){
			for (let i = 0; i < yLimit; i++){
				grid.push([]);
				for (let j = 0; j < xLimit; j++){
					if(j == 0 || i == 0 || j == xLimit-1 || i == yLimit-1){
						grid[i].push(5)
					}else{
						grid[i].push(0)
					}
				}
			}
			this.clearCanvas();
			this.pickStartingPosition(setStartingPosition,setEndingPosition);
		},
		setMapLayer : function(context){
			mapLayer = context;
		},
		pickStartingPosition:function(setStartingPosition,setEndingPosition){
			let oddLocsX = [];
			for (let i = 1; i < grid[0].length/3; i += 2){
				oddLocsX.push(i)
			}
			let oddLocsY = [];
			for (let i = 1; i < grid.length; i += 2){
				oddLocsY.push(i)
			}
			let x = oddLocsX[Math.round(Math.random()*(oddLocsX.length-1))]
			let y = oddLocsY[Math.round(Math.random()*(oddLocsY.length-1))]
			grid[y][x] = 1;
			setStartingPosition(x,y);
			this.paintMapSpace(x,y,'#22BB55');
			this.getNeighbors(x,y);
			this.buildMaze(setEndingPosition);
		}
	}
})()