var pathfinder = (function(){
	var startingPosition;
	var endPosition;
	var visited = {};
	var map = [];
	var gScore = [];
	var fScore = [];
	var path = [];
	var pathLayer = {};

	var priorityQueue = {
		queue : [],
		add : function(node){
			if (this.queue.length === 0){
				this.queue.push(node);
			} else {
				let done = false;
				this.queue.push(node);
				let currentIndex = this.queue.length - 1;
				while (!done){
					let parentIndex = Math.floor((currentIndex-1)/2)
					if (parentIndex < 0){
						done = true;
						continue;
					} 
					let parentF = fScore[this.queue[parentIndex].y][this.queue[parentIndex].x];
					let parentG = gScore[this.queue[parentIndex].y][this.queue[parentIndex].x];
					let nodeF = fScore[node.y][node.y];
					let nodeG = gScore[node.y][node.x];
					if ( parentF + parentG  > nodeF + nodeG){
						//Perform Switch
						let temp = this.queue[parentIndex];
						this.queue[parentIndex] = this.queue[currentIndex];
						this.queue[currentIndex] = temp;
						currentIndex = parentIndex;
					} else {
						done = true;
					}
				}
			}
		},
		inQueue : function(x,y){
			for (let i = 0; i < this.queue.length; i++){
				if (this.queue[i].x === x && this.queue[i].y === y){
					return true;
				}
			}
			return false;
		},
		shift : function(){
			let returnable = this.queue[0];
			let newRoot = this.queue.pop();

			if (this.queue.length === 0){
				//Queue is now empty
				return returnable;
			}
			this.queue[0] = newRoot;
			if (this.queue.length === 1){
				//Queue is now sorted
				return returnable;
			}

			let done = false;
			let currentIndex = 0;
			while(!done){
				let currG = gScore[this.queue[currentIndex].y][this.queue[currentIndex].x];
				let currF = fScore[this.queue[currentIndex].y][this.queue[currentIndex].x];
				let leftChild = currentIndex*2+1;
				let rightChild = currentIndex*2+2;

				if (leftChild >= this.queue.length){
					//No children left - default to done
					done = true;
					break;
				}

				//Left child
				let lChildG = gScore[this.queue[leftChild].y][this.queue[leftChild].x];
				let lChildF = fScore[this.queue[leftChild].y][this.queue[leftChild].x];
				if (lChildF + lChildG < currG + currF){
					if (rightChild >= this.queue.length){
						//No right child, so after switching we are done
						let temp = this.queue[currentIndex];
						this.queue[currentIndex] = this.queue[leftChild];
						this.queue[leftChild] = temp;
						done = true;
						break;
					}
					//Right child exists
					let rChildG = gScore[this.queue[rightChild].y][this.queue[rightChild].x];
					let rChildF = fScore[this.queue[rightChild].y][this.queue[rightChild].x];

					//Is it smaller than the left child?
					if (rChildF + rChildG < lChildF + lChildG){
						let temp = this.queue[currentIndex];
						this.queue[currentIndex] = this.queue[rightChild];
						this.queue[rightChild] = temp;
						currentIndex = rightChild;
						continue;
					} else {
						let temp = this.queue[currentIndex];
						this.queue[currentIndex] = this.queue[leftChild];
						this.queue[leftChild] = temp;
						currentIndex = leftChild;
						continue;
					}

				}

				//Right Child
				if (rightChild >= this.queue.length){
					//No right child, so we can't go deeper
					done = true;
					break;
				}

				let rChildG = gScore[this.queue[rightChild].y][this.queue[rightChild].x];
				let rChildF = fScore[this.queue[rightChild].y][this.queue[rightChild].x];
				if (rChildF + rChildG < currF + currG){
					let temp = this.queue[currentIndex];
					this.queue[currentIndex] = this.queue[rightChild];
					this.queue[rightChild] = temp;
					currentIndex = rightChild;
					continue;
				}

				//Children aren't smaller than current, therefore we are done
				done = true;
			}
			return returnable;
		}
	}

	return {
		setStartingPosition : function(x,y){
			startingPosition = {x:x,y:y}
		},
		setEndingPosition : function(x,y){
			endPosition = {x:x,y:y}
		},
		setMaps : function(grid){
			for (let i = 0; i < grid.length; i++){
				gScore.push([]);
				fScore.push([]);
				map.push(grid[i].slice());
				for (let j = 0; j < map[i].length; j++){
					gScore[i].push(Infinity);
					fScore[i].push(Infinity);
				}
			}
			gScore[startingPosition.y][startingPosition.x] = 0;
			fScore[startingPosition.y][startingPosition.x] = this.heuristicCalculation(startingPosition);
			return this.producePath();
		},
		getScores:function(){
			return {gScore:gScore,fScore:fScore}
		},
		producePath:function(){
			let cameFrom = {};
			priorityQueue.add(startingPosition);
			while (priorityQueue.queue.length > 0){
				let current = priorityQueue.shift()
				if (current.x === endPosition.x && current.y === endPosition.y){
					return this.mapPath(cameFrom);
				}
				visited['x'+current.x+'y'+current.y] = true;
				let neighbors = [{x:current.x+1,y:current.y},{x:current.x-1,y:current.y},
					{x:current.x,y:current.y+1},{x:current.x,y:current.y-1}]

				for (let i = 0; i < neighbors.length; i++){
					if (map[neighbors[i].y][neighbors[i].x]%5 == 0){
						continue;
					}
					if (visited.hasOwnProperty('x'+neighbors[i].x+'y'+neighbors[i].y)){
						continue;
					}
					let tentative_gScore = gScore[current.y][current.x] + 1;

					if (priorityQueue.inQueue(neighbors[i].x,neighbors[i].y)){
						continue;
					} else if ( tentative_gScore >= gScore[neighbors[i].y][neighbors[i].x] ) {
						continue;
					}

					cameFrom['x'+neighbors[i].x+'y'+neighbors[i].y] = current;
					gScore[neighbors[i].y][neighbors[i].x] = tentative_gScore;
					fScore[neighbors[i].y][neighbors[i].x] = this.heuristicCalculation(neighbors[i]);
					priorityQueue.add(neighbors[i]);
				}
			}
		},
		mapPath : function(cameFrom){
			path.push(endPosition)
			let hasFather = cameFrom.hasOwnProperty('x'+endPosition.x+'y'+endPosition.y);
			let father = cameFrom['x'+endPosition.x+'y'+endPosition.y];
			while (hasFather){
				path.push(father);
				hasFather = cameFrom.hasOwnProperty('x'+father.x+'y'+father.y);
				if (hasFather){
					father = cameFrom['x'+father.x+'y'+father.y]
				}
			}
			return path.reverse();
		},
		drawPath : function(incoming){
			pathLayer.beginPath();
			pathLayer.strokeStyle = '#296EB4';
			pathLayer.moveTo(incoming[incoming.length-1].x*tileWidth+(Math.floor(tileWidth/2)),incoming[incoming.length-1].y*tileHeight+(Math.floor(tileHeight/2)));
			for (let i = incoming.length - 2; i >= 0; i--){
				pathLayer.lineTo(incoming[i].x*tileWidth+(Math.floor(tileWidth/2)),incoming[i].y*tileHeight+(Math.floor(tileHeight/2)));
			}
			pathLayer.stroke();
		},
		heuristicCalculation : function(currentPosition){
			return Math.abs(currentPosition.x - endPosition.x)+Math.abs(currentPosition.y - endPosition.y)
		},
		getMap : function(){
			return map
		},
		getPositions:function(){
			return [startingPosition,endPosition]
		},
		setLayer : function(layer){
			pathLayer = layer;
			pathLayer.translate(0.5,0.5)
		}
	}

})();