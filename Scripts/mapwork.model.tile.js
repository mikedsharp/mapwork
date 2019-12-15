/*global $,jQuery,alert,document,window,console*/
/*jslint plusplus: true, white:true */

//model class declarations
/*START OF MAP */

/*check existence of mapwork.model in global namespace*/
window.mapwork = window.mapwork || {};
window.mapwork.model = mapwork.model || {};

window.mapwork.model.Tile = function() {
  'use strict';
  this.tileCode = -1;
  this.tilesheetX = null;
  this.tilesheetY = null;
  this.properties = [];

  this.setTileCode = function(code) {
    this.tileCode = code;
  };
  this.getTileCode = function() {
    return this.tileCode;
  };
  this.setTilesheetX = function(value) {
    this.tilesheetX = value;
  };
  this.getTilesheetX = function() {
    return this.tilesheetX;
  };
  this.setTilesheetY = function(value) {
    this.tilesheetY = value;
  };
  this.getTilesheetY = function() {
    return this.tilesheetY;
  };
  this.addProperty = function(prop) {
    this.properties.push(prop);
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
  this.getAllProperties = function() {
    return this.properties;
  };

  // other methods
  this.createBlankModelTile = function() {
    this.setTileCode(-1);
  };
};

/* END OF TILE */
