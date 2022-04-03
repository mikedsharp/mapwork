import { Layer } from './mapwork.model.layer'
import { Tile } from './mapwork.model.tile'

export class Map {
  EditorEnvironment: any
  properties: any[]
  name: any
  tileWidth: any
  tileHeight: any
  tilesAccross: any
  tilesDown: any
  layers: any[]
  constructor(EditorEnvironment) {
    // injected dependencies
    this.EditorEnvironment = EditorEnvironment

    this.properties = []
    this.name = null
    this.tileWidth = null
    this.tileHeight = null
    this.tilesAccross = null
    this.tilesDown = null
    this.layers = []
  }

  removeProperty(key) {
    var propCount

    for (propCount = 0; propCount < this.properties.length; propCount++) {
      if (this.properties[propCount].key === key) {
        this.getAllProperties().splice(propCount, 1)
      }
    }
  }
  setProperty(property) {
    var propCount

    for (propCount = 0; propCount < this.properties.length; propCount++) {
      if (this.properties[propCount].key === property.oldKey) {
        this.properties[propCount].key = property.newKey
        this.properties[propCount].value = property.newValue
        return
      }
    }
  }
  getProperty(key) {
    var propCount

    for (propCount = 0; propCount < this.properties.length; propCount++) {
      if (this.properties[propCount].key === key) {
        return this.properties[propCount].value
      }
    }
  }
  addProperty(prop) {
    this.properties.push(prop)
  }
  getLayerByZPosition(zPosition) {
    var layerCount

    // find array element with given z co-ordinate, remove from model
    for (layerCount = 0; layerCount < this.getLayers().length; layerCount++) {
      if (this.getLayer(layerCount).getZPosition() === zPosition) {
        return this.getLayer(layerCount)
      }
    }
  }
  getLayer(index) {
    try {
      return this.layers[index]
    } catch (ex) {
      return null
    }
  }
  getLayers() {
    return this.layers
  }
  addLayer(layer) {
    this.layers.push(layer)
  }
  removeLayer(zPosition) {
    var layerCount

    // find array element with given z co-ordinate, remove from model
    for (layerCount = 0; layerCount < this.getLayers().length; layerCount++) {
      if (this.getLayer(layerCount).getZPosition() === zPosition) {
        this.getLayers()[layerCount] = null
        this.getLayers().splice(layerCount, 1)
        break
      }
    }
  }
  swapLayers(zPositionOne, zPositionTwo) {
    var layerOne, layerTwo, layerOneIndex, layerTwoIndex, layerCount
    for (layerCount = 0; layerCount < this.getLayers().length; layerCount++) {
      if (this.getLayer(layerCount).getZPosition() === zPositionOne) {
        layerOne = this.getLayer(layerCount)
        layerOneIndex = layerCount
      }
      if (this.getLayer(layerCount).getZPosition() === zPositionTwo) {
        layerTwo = this.getLayer(layerCount)
        layerTwoIndex = layerCount
      }
    }
    if (Object.keys(layerOne).length !== 0 && Object.keys(layerTwo).length !== 0) {
      layerOne.setZPosition(zPositionTwo)
      layerTwo.setZPosition(zPositionOne)
      this.setLayer(layerOne, layerTwoIndex)
      this.setLayer(layerTwo, layerOneIndex)
    }
  }
  setLayer(layer, index) {
    this.layers[index] = layer
  }
  setName(mapName) {
    this.name = mapName
  }
  getName() {
    return this.name
  }
  setTileWidth(amount) {
    this.tileWidth = parseInt(amount, 10)
  }
  getTileWidth() {
    return this.tileWidth
  }
  // tile height get/set
  setTileHeight(amount) {
    this.tileHeight = parseInt(amount, 10)
  }
  getTileHeight() {
    return this.tileHeight
  }
  // tiles accross get/set
  setTilesAccross(amount) {
    this.tilesAccross = amount
  }
  getTilesAccross() {
    return this.tilesAccross
  }
  // tiles down get/set
  setTilesDown(amount) {
    this.tilesDown = amount
  }
  getTilesDown() {
    return this.tilesDown
  }
  getAllProperties() {
    return this.properties
  }
  createBlankModel(name, tileWidth, tileHeight, tilesAccross, tilesDown) {
    var newLayer
    // remove any existing model objects
    this.destructModel()

    // initialise tile dimensions
    this.setName(name)
    this.setTileWidth(parseInt(tileWidth, 10))
    this.setTileHeight(parseInt(tileHeight, 10))
    this.setTilesAccross(parseInt(tilesAccross, 10))
    this.setTilesDown(parseInt(tilesDown, 10))

    // create an initial layer

    newLayer = new Layer(this.EditorEnvironment)
    newLayer.createBlankModelLayer(
      this,
      'Untitled Layer',
      'default_tileset.png'
    )
    this.addLayer(newLayer)
  }
  createModelFromJSONString(json) {
    var layerCount, propertyCount, currentLayer
    // remove any existing model objects
    this.destructModel()

    json = JSON.parse(json)

    // top level 'map' assignments from the JSON
    this.setName(json.name)
    this.setTileWidth(json.tileWidth)
    this.setTileHeight(json.tileHeight)
    this.setTilesAccross(json.tilesAccross)
    this.setTilesDown(json.tilesDown)

    // layer-level assignment
    for (layerCount = 0; layerCount < json.layers.length; layerCount++) {
      currentLayer = new Layer(this.EditorEnvironment)
      currentLayer.createModelLayerFromJSONObject(this, json.layers[layerCount])
      this.addLayer(currentLayer)
    }

    // property assignment
    for (
      propertyCount = 0;
      propertyCount < json.properties.length;
      propertyCount++
    ) {
      this.addProperty(json.properties[propertyCount])
    }
  }
  serialize() {
    var obj,
      layerCount,
      layer,
      rowCount,
      cellCount,
      allLayers,
      row,
      currentRow,
      cell,
      jsonString

    // create an object that can be serialized cleanly into JSON
    obj = {
      name: this.getName(),
      tileWidth: this.getTileWidth(),
      tileHeight: this.getTileHeight(),
      tilesAccross: this.getTilesAccross(),
      tilesDown: this.getTilesDown(),
      layers: [],
      // properties: this.getAllProperties()
    }

    var mapProperties = this.getAllProperties()
    if (mapProperties.length > 0) {
      obj.properties = mapProperties
    }

    allLayers = this.getLayers()
    // start breaking down layers
    for (layerCount = 0; layerCount < allLayers.length; layerCount++) {
      // create neat layer object
      layer = {
        name: allLayers[layerCount].getName(),
        tilesetPath: allLayers[layerCount].getTilesetPath(),
        rows: [],
        zPosition: allLayers[layerCount].getZPosition(),
        // properties: allLayers[layerCount].getAllProperties()
      }
      var layerProperties = allLayers[layerCount].getAllProperties()
      if (layerProperties.length > 0) {
        layer.properties = layerProperties
      }

      // break down the rows and insert into neat layer object
      for (
        rowCount = 0;
        rowCount < allLayers[layerCount].getRows().length;
        rowCount++
      ) {
        row = {
          cells: [],
        }
        currentRow = allLayers[layerCount].getRow(rowCount)
        for (cellCount = 0; cellCount < currentRow.length; cellCount++) {
          cell = {
            tileCode: currentRow[cellCount].getTileCode(),
            // properties: currentRow[cellCount].getAllProperties()
          }
          var cellProperties = currentRow[cellCount].getAllProperties()

          if (cellProperties.length > 0) {
            cell.properties = cellProperties
          }

          row.cells.push(cell)
        }
        layer.rows.push(row)
      }
      obj.layers.push(layer)
    }

    jsonString = JSON.stringify(obj)
  }

  destructModel() {
    this.layers = []
    this.name = null
    this.tileWidth = null
    this.tileHeight = null
    this.tilesAccross = null
    this.tilesDown = null
    this.properties = []
  }

  modifyTile(layer, x, y, options) {
    var optionCount, currentRow

    for (optionCount = 0; optionCount < options.length; optionCount++) {
      if (options[optionCount].key === 'tileCode') {
        currentRow = this.getLayer(layer).getRow(y)
        currentRow[x].setTileCode(options[optionCount].value)
      } else {
      }
    }
  }

  getTile(layer, x, y) {
    var currentRow

    currentRow = this.getLayer(layer).getRow(y)
    return currentRow[x]
  }

  resizeMap(specifications) {
    var layerCount,
      rowCount,
      layers,
      cellCount,
      currentLayer,
      currentRow,
      tileDifference,
      newRow,
      newTile

    layers = this.getLayers()
    // first handle tiles down (Rows)

    if (specifications.tilesDown) {
      tileDifference = Math.abs(
        this.getTilesDown() - parseInt(specifications.tilesDown, 10)
      )

      if (this.getTilesDown() > parseInt(specifications.tilesDown, 10)) {
        // contraction
        for (layerCount = 0; layerCount < layers.length; layerCount++) {
          currentLayer = layers[layerCount]

          currentLayer
            .getRows()
            .splice(parseInt(specifications.tilesDown, 10), tileDifference)
        }
      } else {
        // expansion
        for (layerCount = 0; layerCount < layers.length; layerCount++) {
          for (rowCount = 0; rowCount < tileDifference; rowCount++) {
            currentLayer = layers[layerCount]
            newRow = []
            for (
              cellCount = 0;
              cellCount < this.getTilesAccross();
              cellCount++
            ) {
              newTile = new Tile()
              newTile.createBlankModelTile()
              newRow.push(newTile)
            }
            currentLayer.getRows().push(newRow)
          }
        }
      }
      // change tiles accross and tiles down values at top level of map
      this.setTilesDown(parseInt(specifications.tilesDown, 10))
    }
    // handle tiles accross (cells from each row)
    if (specifications.tilesAccross) {
      tileDifference = Math.abs(
        this.getTilesAccross() - parseInt(specifications.tilesAccross, 10)
      )

      // deduce whether this is an expansion or contraction
      if (this.getTilesAccross() > parseInt(specifications.tilesAccross, 10)) {
        // contraction
        for (layerCount = 0; layerCount < layers.length; layerCount++) {
          currentLayer = layers[layerCount]
          for (
            rowCount = 0;
            rowCount < currentLayer.getRows().length;
            rowCount++
          ) {
            currentRow = currentLayer.getRow(rowCount)
            currentRow.splice(
              parseInt(specifications.tilesAccross, 10),
              tileDifference
            )
          }
        }
      } else {
        // expansion
        for (layerCount = 0; layerCount < layers.length; layerCount++) {
          currentLayer = layers[layerCount]
          for (
            rowCount = 0;
            rowCount < currentLayer.getRows().length;
            rowCount++
          ) {
            currentRow = currentLayer.getRow(rowCount)
            for (cellCount = 0; cellCount < tileDifference; cellCount++) {
              newTile = new Tile()
              newTile.createBlankModelTile()
              currentRow.push(newTile)
            }
          }
        }
      }
      // change tiles accross and tiles down values at top level of map
      this.setTilesAccross(parseInt(specifications.tilesAccross, 10))
    }
  }
  getWorldWidth() {
    return this.getTilesAccross() * this.getTileWidth()
  }
  getWorldHeight() {
    return this.getTilesDown() * this.getTileHeight()
  }
}
