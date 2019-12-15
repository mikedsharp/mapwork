/*global $,jQuery,alert,document,window,console,Image*/
/*jslint plusplus: true, white:true */

//model class declarations
/*START OF MAP */

/*check existence of mapwork.model in global namespace*/
window.mapwork = window.mapwork || {};
window.mapwork.model = window.mapwork.model || {};

window.mapwork.model.Layer = function() {
  'use strict';
  this.name = null;
  this.tilesetPath = null;
  this.tilesetImage = null;
  this.rows = [];
  this.zPosition = null;
  this.properties = [];
  this.tilesetHeight = null;
  this.tilesetWidth = null;
  this.setName = function(layerName) {
    this.name = layerName;
  };
  this.getName = function() {
    return this.name;
  };
  this.visible = true;
  this.setTilesetPath = function(path) {
    // set the new path in the model  to the given directory
    this.tilesetPath = path;
    this.setTilesetImage(this.tilesetPath);
  };
  this.getVisibility = function() {
    return this.visible;
  };
  this.setVisibility = function(visible) {
    this.visible = visible;
  };
  this.getTilesetWidth = function() {
    return this.tilesetWidth;
  };
  this.getTilesetHeight = function() {
    return this.tilesetHeight;
  };
  this.setTilesetImage = function(path) {
    // load file into an img object for rendering
    this.tilesetImage = new Image();
    this.tilesetImage.src = 'Tilesets/' + path;
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
  };

  this.getTilesetPath = function() {
    return this.tilesetPath;
  };
  this.getTilesetImage = function() {
    return this.tilesetImage;
  };
  this.setZPosition = function(value) {
    this.zPosition = value;
  };
  this.getZPosition = function() {
    return this.zPosition;
  };
  this.addRow = function(row) {
    this.rows.push(row);
  };
  this.getRows = function() {
    return this.rows;
  };
  this.getTile = function(x, y) {
    try {
      return this.getRow(y)[x];
    } catch (ex) {
      return null;
    }
  };
  this.getRow = function(index) {
    try {
      return this.rows[index];
    } catch (ex) {
      return null;
    }
  };
  this.removeProperty = function(key) {
    var propCount;

    for (propCount = 0; propCount < this.properties.length; propCount++) {
      if (this.properties[propCount].key === key) {
        this.getAllProperties().splice(propCount, 1);
      }
    }
  };

  this.setProperty = function(property) {
    var propCount;

    for (propCount = 0; propCount < this.properties.length; propCount++) {
      if (this.properties[propCount].key === property.oldKey) {
        this.properties[propCount].key = property.newKey;
        this.properties[propCount].value = property.newValue;
        return;
      }
    }
  };
  this.getProperty = function(key) {
    var propCount;

    for (propCount = 0; propCount < this.properties.length; propCount++) {
      if (this.properties[propCount].key === key) {
        return this.properties[propCount].value;
      }
    }
  };
  this.addProperty = function(prop) {
    this.properties.push(prop);
  };
  this.getAllProperties = function() {
    return this.properties;
  };
  this.addProperty = function(prop) {
    this.properties.push(prop);
  };

  this.createBlankModelLayer = function(map, layerName, tilesetPath) {
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
  };
  this.createModelLayerFromJSONObject = function(map, json) {
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
  };
};
