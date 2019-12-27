export class Tile {
  constructor() {
    this.tileCode = -1;
    this.tilesheetX = null;
    this.tilesheetY = null;
    this.properties = [];
  }
  setTileCode(code) {
    this.tileCode = code;
  }
  getTileCode() {
    return this.tileCode;
  }
  setTilesheetX(value) {
    this.tilesheetX = value;
  }
  getTilesheetX() {
    return this.tilesheetX;
  }
  setTilesheetY(value) {
    this.tilesheetY = value;
  }
  getTilesheetY() {
    return this.tilesheetY;
  }
  addProperty(prop) {
    this.properties.push(prop);
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
  getAllProperties() {
    return this.properties;
  }

  // other methods
  createBlankModelTile() {
    this.setTileCode(-1);
  }
}
