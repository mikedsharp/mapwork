/*global $,jQuery,alert,document,window,console*/
/*jslint plusplus: true, white: true */

//model class declarations
/*START OF MAP */

/*check existence of mapwork.model in global namespace*/
window.mapwork = window.mapwork || {};
window.mapwork.model = window.mapwork.model || {};

window.mapwork.model.Map = function() {
  'use strict';
  this.properties = [];
  this.name = null;
  this.createdTimestamp = null;
  this.tileWidth = null;
  this.tileHeight = null;
  this.tilesAccross = null;
  this.tilesDown = null;
  this.layers = [];

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
  this.getLayerByZPosition = function(zPosition) {
    var layerCount;

    // find array element with given z co-ordinate, remove from model
    for (layerCount = 0; layerCount < this.getLayers().length; layerCount++) {
      if (this.getLayer(layerCount).getZPosition() === zPosition) {
        return this.getLayer(layerCount);
      }
    }
  };
  this.getLayer = function(index) {
    try {
      return this.layers[index];
    } catch (ex) {
      return null;
    }
  };
  this.getLayers = function() {
    return this.layers;
  };
  this.addLayer = function(layer) {
    this.layers.push(layer);
  };
  this.removeLayer = function(zPosition) {
    var layerCount;

    // find array element with given z co-ordinate, remove from model
    for (layerCount = 0; layerCount < this.getLayers().length; layerCount++) {
      if (this.getLayer(layerCount).getZPosition() === zPosition) {
        this.getLayers()[layerCount] = null;
        this.getLayers().splice(layerCount, 1);
        break;
      }
    }
  };

  this.swapLayers = function(zPositionOne, zPositionTwo) {
    var layerOne, layerTwo, layerOneIndex, layerTwoIndex, layerCount;
    for (layerCount = 0; layerCount < this.getLayers().length; layerCount++) {
      if (this.getLayer(layerCount).getZPosition() === zPositionOne) {
        layerOne = this.getLayer(layerCount);
        layerOneIndex = layerCount;
      }
      if (this.getLayer(layerCount).getZPosition() === zPositionTwo) {
        layerTwo = this.getLayer(layerCount);
        layerTwoIndex = layerCount;
      }
    }

    if (!$.isEmptyObject(layerOne) && !$.isEmptyObject(layerTwo)) {
      layerOne.setZPosition(zPositionTwo);
      layerTwo.setZPosition(zPositionOne);
      this.setLayer(layerOne, layerTwoIndex);
      this.setLayer(layerTwo, layerOneIndex);
    }
  };
  this.setLayer = function(layer, index) {
    this.layers[index] = layer;
  };
  this.setName = function(mapName) {
    this.name = mapName;
  };
  this.getName = function() {
    return this.name;
  };
  this.setCreatedTimestamp = function(timestamp) {
    this.createdTimestamp = timestamp;
  };
  this.getCreatedTimestamp = function() {
    return this.createdTimestamp;
  };
  this.setTileWidth = function(amount) {
    this.tileWidth = parseInt(amount, 10);
  };
  this.getTileWidth = function() {
    return this.tileWidth;
  };
  // tile height get/set
  this.setTileHeight = function(amount) {
    this.tileHeight = parseInt(amount, 10);
  };
  this.getTileHeight = function() {
    return this.tileHeight;
  };
  // tiles accross get/set
  this.setTilesAccross = function(amount) {
    this.tilesAccross = amount;
  };
  this.getTilesAccross = function() {
    return this.tilesAccross;
  };
  // tiles down get/set
  this.setTilesDown = function(amount) {
    this.tilesDown = amount;
  };
  this.getTilesDown = function() {
    return this.tilesDown;
  };
  this.getAllProperties = function() {
    return this.properties;
  };

  this.createBlankModel = function(
    name,
    tileWidth,
    tileHeight,
    tilesAccross,
    tilesDown
  ) {
    var newLayer;
    // remove any existing model objects
    this.destructModel();

    // initialise tile dimensions
    this.setName(name);
    this.setTileWidth(parseInt(tileWidth, 10));
    this.setTileHeight(parseInt(tileHeight, 10));
    this.setTilesAccross(parseInt(tilesAccross, 10));
    this.setTilesDown(parseInt(tilesDown, 10));

    // create an initial layer

    newLayer = new mapwork.model.Layer();
    newLayer.createBlankModelLayer(
      this,
      'Untitled Layer',
      'default_tileset.png'
    );
    this.addLayer(newLayer);
  };
  this.createModelFromJSONString = function(json) {
    var layerCount, propertyCount, currentLayer;
    // remove any existing model objects
    this.destructModel();

    json = JSON.parse(json);

    // top level 'map' assignments from the JSON
    this.setName(json.name);
    this.setCreatedTimestamp(json.createdTimestamp);
    this.setTileWidth(json.tileWidth);
    this.setTileHeight(json.tileHeight);
    this.setTilesAccross(json.tilesAccross);
    this.setTilesDown(json.tilesDown);

    // layer-level assignment
    for (layerCount = 0; layerCount < json.layers.length; layerCount++) {
      currentLayer = new mapwork.model.Layer();
      currentLayer.createModelLayerFromJSONObject(
        this,
        json.layers[layerCount]
      );
      this.addLayer(currentLayer);
    }

    // property assignment
    for (
      propertyCount = 0;
      propertyCount < json.properties.length;
      propertyCount++
    ) {
      this.addProperty(json.properties[propertyCount]);
    }
  };
  this.serialize = function() {
    var obj,
      layerCount,
      layer,
      rowCount,
      cellCount,
      allLayers,
      row,
      currentRow,
      cell,
      jsonString;

    // create an object that can be serialized cleanly into JSON
    obj = {
      name: this.getName(),
      createdTimestamp: this.getCreatedTimestamp(),
      tileWidth: this.getTileWidth(),
      tileHeight: this.getTileHeight(),
      tilesAccross: this.getTilesAccross(),
      tilesDown: this.getTilesDown(),
      layers: []
      // properties: this.getAllProperties()
    };

    var mapProperties = this.getAllProperties();
    if (mapProperties.length > 0) {
      obj.properties = mapProperties;
    }

    allLayers = this.getLayers();
    // start breaking down layers
    for (layerCount = 0; layerCount < allLayers.length; layerCount++) {
      // create neat layer object
      layer = {
        name: allLayers[layerCount].getName(),
        tilesetPath: allLayers[layerCount].getTilesetPath(),
        rows: [],
        zPosition: allLayers[layerCount].getZPosition()
        // properties: allLayers[layerCount].getAllProperties()
      };
      var layerProperties = allLayers[layerCount].getAllProperties();
      if (layerProperties.length > 0) {
        layer.properties = layerProperties;
      }

      // break down the rows and insert into neat layer object
      for (
        rowCount = 0;
        rowCount < allLayers[layerCount].getRows().length;
        rowCount++
      ) {
        row = {
          cells: []
        };
        currentRow = allLayers[layerCount].getRow(rowCount);
        for (cellCount = 0; cellCount < currentRow.length; cellCount++) {
          cell = {
            tileCode: currentRow[cellCount].getTileCode()
            // properties: currentRow[cellCount].getAllProperties()
          };
          var cellProperties = currentRow[cellCount].getAllProperties();

          if (cellProperties.length > 0) {
            cell.properties = cellProperties;
          }

          row.cells.push(cell);
        }
        layer.rows.push(row);
      }
      obj.layers.push(layer);
    }

    jsonString = JSON.stringify(obj);
    mapwork.editor.environment.PostMapForDownload(jsonString);
  };

  this.serializeCompact = function() {
    var obj,
      layerCount,
      layer,
      rowCount,
      cellCount,
      allLayers,
      row,
      currentRow,
      cell,
      jsonString;

    // create an object that can be serialized cleanly into JSON
    obj = {
      layers: []
    };

    allLayers = mapwork.viewcontroller.mapModel.getLayers();
    // start breaking down layers
    for (layerCount = 0; layerCount < allLayers.length; layerCount++) {
      // create neat layer object
      layer = new Array();

      // break down the rows and insert into neat layer object
      for (
        rowCount = 0;
        rowCount < allLayers[layerCount].getRows().length;
        rowCount++
      ) {
        currentRow = allLayers[layerCount].getRow(rowCount);
        for (cellCount = 0; cellCount < currentRow.length; cellCount++) {
          layer.push(currentRow[cellCount].getTileCode());
        }
      }
      obj.layers.push(layer);
    }

    jsonString = JSON.stringify(obj);
    // mapwork.editor.environment.PostMapForDownload(jsonString);
    mapwork.editor.environment.PostMapForDownload(jsonString);
    // return jsonString;
  };

  this.destructModel = function() {
    this.layers = [];
    this.name = null;
    this.createdTimestamp = null;
    this.tileWidth = null;
    this.tileHeight = null;
    this.tilesAccross = null;
    this.tilesDown = null;
    this.properties = [];
  };

  this.modifyTile = function(layer, x, y, options) {
    var optionCount, currentRow;

    for (optionCount = 0; optionCount < options.length; optionCount++) {
      if (options[optionCount].key === 'tileCode') {
        currentRow = this.getLayer(layer).getRow(y);
        currentRow[x].setTileCode(options[optionCount].value);
      } else {
      }
    }
  };

  this.getTile = function(layer, x, y) {
    var currentRow;

    currentRow = this.getLayer(layer).getRow(y);
    return currentRow[x];
  };

  this.resizeMap = function(specifications) {
    var layerCount,
      rowCount,
      layers,
      cellCount,
      currentLayer,
      currentRow,
      tileDifference,
      newRow,
      newTile;

    layers = this.getLayers();
    // first handle tiles down (Rows)

    if (specifications.tilesDown) {
      tileDifference = Math.abs(
        this.getTilesDown() - parseInt(specifications.tilesDown, 10)
      );

      if (this.getTilesDown() > parseInt(specifications.tilesDown, 10)) {
        // contraction
        for (layerCount = 0; layerCount < layers.length; layerCount++) {
          currentLayer = layers[layerCount];

          currentLayer
            .getRows()
            .splice(parseInt(specifications.tilesDown, 10), tileDifference);
        }
      } else {
        // expansion
        for (layerCount = 0; layerCount < layers.length; layerCount++) {
          for (rowCount = 0; rowCount < tileDifference; rowCount++) {
            currentLayer = layers[layerCount];
            newRow = [];
            for (
              cellCount = 0;
              cellCount < this.getTilesAccross();
              cellCount++
            ) {
              newTile = new mapwork.model.Tile();
              newTile.createBlankModelTile();
              newRow.push(newTile);
            }
            currentLayer.getRows().push(newRow);
          }
        }
      }
      // change tiles accross and tiles down values at top level of map
      this.setTilesDown(parseInt(specifications.tilesDown, 10));
    }
    // handle tiles accross (cells from each row)
    if (specifications.tilesAccross) {
      tileDifference = Math.abs(
        this.getTilesAccross() - parseInt(specifications.tilesAccross, 10)
      );

      // deduce whether this is an expansion or contraction
      if (this.getTilesAccross() > parseInt(specifications.tilesAccross, 10)) {
        // contraction
        for (layerCount = 0; layerCount < layers.length; layerCount++) {
          currentLayer = layers[layerCount];
          for (
            rowCount = 0;
            rowCount < currentLayer.getRows().length;
            rowCount++
          ) {
            currentRow = currentLayer.getRow(rowCount);
            currentRow.splice(
              parseInt(specifications.tilesAccross, 10),
              tileDifference
            );
          }
        }
      } else {
        // expansion
        for (layerCount = 0; layerCount < layers.length; layerCount++) {
          currentLayer = layers[layerCount];
          for (
            rowCount = 0;
            rowCount < currentLayer.getRows().length;
            rowCount++
          ) {
            currentRow = currentLayer.getRow(rowCount);
            for (cellCount = 0; cellCount < tileDifference; cellCount++) {
              newTile = new mapwork.model.Tile();
              newTile.createBlankModelTile();
              currentRow.push(newTile);
            }
          }
        }
      }
      // change tiles accross and tiles down values at top level of map
      this.setTilesAccross(parseInt(specifications.tilesAccross, 10));
    }
  };
  this.getWorldWidth = function() {
    return this.getTilesAccross() * this.getTileWidth();
  };
  this.getWorldHeight = function() {
    return this.getTilesDown() * this.getTileHeight();
  };
};

/*Additional Helper Methods*/
