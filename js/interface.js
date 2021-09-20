interface = (function(){
	interfaceLayer = {}
	return {
		drawGrid:function(xLimit,yLimit){
			this.clearCanvas();
			interfaceLayer.beginPath()
			interfaceLayer.strokeStyle = '#CCCCCC';
			for (let x = 0; x < xLimit; x++){
				interfaceLayer.moveTo(x*tileWidth,0);
				interfaceLayer.lineTo(x*tileWidth,yLimit*tileHeight);
			}
			for (let y = 0; y < yLimit; y++){
				interfaceLayer.moveTo(0,y*tileHeight);
				interfaceLayer.lineTo(xLimit*tileWidth,y*tileHeight);
			}
			interfaceLayer.stroke()
		},
		clearCanvas : function(){
			interfaceLayer.clearRect(0,0,canvasi.layer1.width,canvasi.layer1.height);
		},
		setInterfaceLayer:function(context){
			interfaceLayer = context;
			interfaceLayer.translate(0.5,0.5)
		}
	}
})()