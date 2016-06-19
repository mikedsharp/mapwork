mapwork.editor.changes = {
	description: "MapWork Changes API",
	v: 0.01,
	PushChange: function (data) {
		this.changes.push(data);
		if (data.verb == 'PaintSingleTile') {
			console.log('CHANGE: Paint Operation, x:' + data.x + ' Y:' + data.y + ' Z:' + data.z + ' TileCode:' + data.tileCode);
		}
		else if (data.verb == 'EraseSingleTile') {
			console.log('CHANGE: Erase Operation, x:' + data.x + ' Y:' + data.y + ' Z:' + data.z + ' TileCode:' + data.tileCode);
		}
		else if (data.verb == 'BucketFill') {
			console.log('CHANGE: Bucket Fill Operation, Origin X:' + data.x + ' Origin Y:' + data.y + ' Z:' + data.z + ' TileCode:' + data.tileCode);
		}
		else if (data.verb == 'AreaSelect') {
			console.log('CHANGE: Area Select Operation, Start Tile X:' + data.startX + ' Start Tile Y:' + data.startY + ' End Tile X:' + data.endX + ' End Tile Y:' + data.endY);
		}
	},
	PushReversion: function (data) {
		this.reversions.push(data);
		if (data.verb == 'PaintSingleTile') {
			console.log('REVERSION: Paint Operation, x:' + data.x + ' Y:' + data.y + ' Z:' + data.z + ' TileCode:' + data.tileCode); 
		}
		else if (data.verb == 'EraseSingleTile') {
			console.log('REVERSION: Erase Operation, x:' + data.x + ' Y:' + data.y + ' Z:' + data.z + ' TileCode:' + data.tileCode);
		}
		else if (data.verb == 'BucketFill') {
			console.log('REVERSION: Bucket Fill Operation, x:' + data.x + ' Y:' + data.y + ' Z:' + data.z + ' TileCode:' + data.tileCode);
		}
		else if (data.verb == 'AreaSelect') {
			console.log('REVERSION: Area Select Operation, Start Tile X:' + data.startX + ' Start Tile Y:' + data.startY + ' End Tile X:' + data.endX + ' End Tile Y:' + data.endY);
		}
	},
	CommitChanges: function(){
		// commit changes to the server  
	},
	PopRevision: function () {
		if (this.changes > 1) {
			this.changes.pop();
			return this.reversions.pop();
		}
		return null; 
	}, 
	changes: [],
	reversions: []
};