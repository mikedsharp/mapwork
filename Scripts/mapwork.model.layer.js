//model class declarations
/*START OF MAP */

/*check existence of mapwork.model in global namespace*/
window.mapwork = window.mapwork || {};
window.mapwork.model = window.mapwork.model || {};
const tilesetsEndpoint =
  'https://mds-mapwork-tilesets.s3-eu-west-1.amazonaws.com';

export class Layer {
  constructor() {
    this.name = null;
    this.tilesetPath = null;
    this.tilesetImage = null;
    this.rows = [];
    this.zPosition = null;
    this.properties = [];
    this.tilesetHeight = null;
    this.tilesetWidth = null;
    this.visible = true;
  }
  setName(layerName) {
    this.name = layerName;
  }
  getName() {
    return this.name;
  }
  setTilesetPath(path) {
    // set the new path in the model  to the given directory
    this.tilesetPath = path;
    this.setTilesetImage(this.tilesetPath);
  }
  getVisibility() {
    return this.visible;
  }
  setVisibility(visible) {
    this.visible = visible;
  }
  getTilesetWidth() {
    return this.tilesetWidth;
  }
  getTilesetHeight() {
    return this.tilesetHeight;
  }
  setTilesetImage(path) {
    // load file into an img object for rendering
    this.tilesetImage = new Image();
    this.tilesetImage.src = tilesetsEndpoint + '/' + path;
    // this warrants explanation...
    // we need to get the width and height of the tileset
    // we can only do this when the image has loaded
    // unforunately, this closure prevents us getting at
    // the object we're assigning to, so proxy allows us
    // to access it as 'this' instead of the image itself
    $(this.tilesetImage).on(
      'load',
      $.proxy(function() {
        this.tilesetWidth = this.getTilesetImage().width;
        this.tilesetHeight = this.getTilesetImage().height;
        // refresh tile palette when user changes tilesheet
        mapwork.editor.environment.PalletCanvasResize();

        // remember to turn this handler 'off' once finished, this prevents a memory leak
        $(this.tilesetImage).off('load');
      }, this)
    );
  }

  getTilesetPath() {
    return this.tilesetPath;
  }
  getTilesetImage() {
    return this.tilesetImage;
  }
  setZPosition(value) {
    this.zPosition = value;
  }
  getZPosition() {
    return this.zPosition;
  }
  addRow(row) {
    this.rows.push(row);
  }
  getRows() {
    return this.rows;
  }
  getTile(x, y) {
    try {
      return this.getRow(y)[x];
    } catch (ex) {
      return null;
    }
  }
  getRow(index) {
    try {
      return this.rows[index];
    } catch (ex) {
      return null;
    }
  }
  removeProperty(key) {
    var propCount;

    for (propCount = 0; propCount < this.properties.length; propCount++) {
      if (this.properties[propCount].key === key) {
        this.getAllProperties().splice(propCount, 1);
      }
    }
  }

  setProperty(property) {
    var propCount;

    for (propCount = 0; propCount < this.properties.length; propCount++) {
      if (this.properties[propCount].key === property.oldKey) {
        this.properties[propCount].key = property.newKey;
        this.properties[propCount].value = property.newValue;
        return;
      }
    }
  }
  getProperty(key) {
    var propCount;

    for (propCount = 0; propCount < this.properties.length; propCount++) {
      if (this.properties[propCount].key === key) {
        return this.properties[propCount].value;
      }
    }
  }
  addProperty(prop) {
    this.properties.push(prop);
  }
  getAllProperties() {
    return this.properties;
  }
  addProperty(prop) {
    this.properties.push(prop);
  }

  createBlankModelLayer(map, layerName, tilesetPath) {
    var rows, row, cell, cols;

    this.setName(layerName);
    this.setTilesetPath(tilesetPath);
    this.setZPosition(0);

    // create tiles to the specification of the map model
    for (rows = 0; rows < map.getTilesDown(); rows++) {
      row = [];
      for (cols = 0; cols < map.getTilesAccross(); cols++) {
        cell = new mapwork.model.Tile();
        cell.createBlankModelTile();
        cell.setTileCode(-1);
        // append cell to row
        row.push(cell);
      }
      // apppend row to layer
      this.addRow(row);
    }
  }
  createModelLayerFromJSONObject(map, json) {
    var layerPropertyCount, rowCount, cell, cellCount, propertyCount, row;

    // this is where the layer parsing code will go
    this.setTilesetPath(json.tilesetPath);
    this.setName(json.name);
    this.setZPosition(json.zPosition);

    for (
      layerPropertyCount = 0;
      layerPropertyCount < json.properties.length;
      layerPropertyCount++
    ) {
      this.addProperty(json.properties[layerPropertyCount]);
    }

    for (rowCount = 0; rowCount < json.rows.length; rowCount++) {
      row = [];
      for (
        cellCount = 0;
        cellCount < json.rows[rowCount].cells.length;
        cellCount++
      ) {
        cell = new mapwork.model.Tile();
        cell.setTileCode(json.rows[rowCount].cells[cellCount].tileCode);

        for (
          propertyCount = 0;
          propertyCount <
          json.rows[rowCount].cells[cellCount].properties.length;
          propertyCount++
        ) {
          cell.addProperty(
            json.rows[rowCount].cells[cellCount].properties[propertyCount]
          );
        }

        row.push(cell);
      }
      this.addRow(row);
    }
  }
}
