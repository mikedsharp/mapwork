import { Map } from './mapwork.model.map'
import { Camera } from './mapwork.view.camera'
import { ChangeRecorder } from './mapwork.editor.changes'
import { RenderManager } from './mapwork.rendermanager'
import { DisplayNotification } from './NotificationBanner/NotificationService'

import { mapModel } from './MapModel/MapModel'

const changeRecorder = new ChangeRecorder()
let scope
export class EditorEnvironment {
  rootScope: any
  mapSubscriber: any
  constructor(ChangeRecorder) {
    scope = this
    scope.editorMoveInterval = null
    scope.editorClickInterval = null
    scope.selectedLayer = null
    scope.selectedTool = null
    scope.selectedPalleteTile = 0
    scope.selectedTile = null
    scope.leftMouseButtonDown = false
    scope.arrowKeyDown = false
    scope.mouseX = null
    scope.mouseY = null
    scope.areaSelectEnabled = false
    scope.areaSelectX = null
    scope.areaSelectY = null
    scope.selectedAreaTiles = null
    scope.gridEnabled = true
    scope.downloadToken = null
    scope.downloadInterval = null
    scope.tilesets = null
    scope.notificationTimeout = null
    scope.changeRecorder = ChangeRecorder
    scope.renderManager = new RenderManager(scope)
    this.rootScope = scope

    this.mapSubscriber = mapModel.subscribe((value) => {
      scope.renderManager.mapModel = value
    })
  }
  Init() {
    'use strict'
    // bind all event handlers
    scope.BindEvent()

    // Trigger a window resize to make canvas fit into page
    scope.Window_Resize()
    scope.LoadTilesetList()
    scope.renderManager.Init()
  }
  BindEvent() {
    'use strict'

    window.addEventListener("resize",scope.Window_Resize.bind(scope))
    const canvas = document.getElementById('editorCanvas');

    canvas.addEventListener('mousedown', scope.EditorCanvas_MouseDown.bind(scope));
    canvas.addEventListener('mouseup', scope.EditorCanvas_MouseUp.bind(scope));
    canvas.addEventListener('mouseout', scope.EditorCanvas_MouseOut.bind(scope));
    canvas.addEventListener('mousemove', scope.EditorCanvas_MouseMove.bind(scope));

    // navigation key handlers
    window.addEventListener('keydown', scope.Editor_KeyDown.bind(scope));
  }
  Editor_KeyDown(event) {
    'use strict'
    //move the camera around the map with given directional arrow key
    if (scope.renderManager.camera) {
      event = event || window.event
      switch (event.keyCode) {
        case 37:
          scope.renderManager.camera.move('left', 16)
          break
        case 39:
          scope.renderManager.camera.move('right', 16)
          break
        case 40:
          scope.renderManager.camera.move('down', 16)
          break
        case 38:
          scope.renderManager.camera.move('up', 16)
          break
      }

      if (scope.selectedTool === 'pasteTiles') {
        if (event.keyCode === 27) {
          scope.selectedAreaTiles = null
          scope.selectedTool = 'areaSelect'
        }
      }
    }
  }

  Window_Resize() {
    'use strict'
    //let's resize the canvas to the size of the window space
    const editorCanvas = document.getElementById('editorCanvas');
    const canvasContainer = document.getElementById('canvasContainer');
    editorCanvas.width = canvasContainer.getBoundingClientRect().width
    editorCanvas.height = canvasContainer.getBoundingClientRect().height

    //resize the tile palette based on the size of the screen
    if (
      document.getElementById('paletteCanvasContainer') &&
      document.getElementById('paletteCanvas') &&
      document.getElementById('paletteInfo')
    ) {
      const canvasContainer = document.getElementById('paletteCanvasContainer');
      const paletteInfo = document.getElementById('paletteInfo');
      canvasContainer.style.top = paletteInfo.offsetHeight.toString() + 'px';
  
      document.getElementById('paletteCanvas').width = canvasContainer.getBoundingClientRect().width;
      document.getElementById('paletteCanvas').height = canvasContainer.getBoundingClientRect().height;
    }

    //inform mapwork.rendermanager of update
    if (scope.renderManager.camera) {
      scope.renderManager.camera.setSize(
        document.getElementById('editorCanvas').getBoundingClientRect().width,
        document.getElementById('editorCanvas').getBoundingClientRect().height
      )
      scope.renderManager.camera.setPosition(
        scope.renderManager.camera.getX(),
        scope.renderManager.camera.getY()
      )
    }
  }
  ModifyTile() {
    'use strict'
    var selectedTileX, selectedTileY, queue, currTile, selectedTileType
    if (scope.selectedTool && scope.selectedLayer !== null) {
      selectedTileX = scope.mouseX + scope.renderManager.camera.getX()
      selectedTileX = parseInt(
        (selectedTileX / scope.renderManager.mapModel.getTileWidth()).toString(),
        10
      )
  
      selectedTileY = scope.mouseY + scope.renderManager.camera.getY()
      selectedTileY = parseInt(
        (selectedTileY / scope.renderManager.mapModel.getTileHeight()).toString(),
        10
      )
  
      if(selectedTileY >= scope.renderManager.mapModel.tilesDown) {
        return;
      }
  
      if(selectedTileX >= scope.renderManager.mapModel.tilesAccross) {
        return;
      }
    }

    if (scope.selectedTool === 'singleTileBrush') {
      if (scope.selectedLayer !== null) {
        if (
          selectedTileX < scope.renderManager.mapModel.getTilesAccross() &&
          selectedTileY < scope.renderManager.mapModel.getTilesDown()
        ) {
          if (
            scope.renderManager.mapModel
              .getTile(scope.selectedLayer, selectedTileX, selectedTileY)
              .getTileCode() != scope.selectedPalleteTile
          ) {
            scope.renderManager.mapModel.modifyTile(
              scope.selectedLayer,
              selectedTileX,
              selectedTileY,
              [{ key: 'tileCode', value: scope.selectedPalleteTile }]
            )
            changeRecorder.pushChange({
              verb: 'PaintSingleTile',
              x: selectedTileX,
              y: selectedTileY,
              z: scope.selectedLayer,
              tileCode: scope.selectedPalleteTile,
            })
          }
        }
      }
    } else if (scope.selectedTool === 'eraser') {
      if (scope.selectedLayer !== null) {
        if (
          selectedTileX < scope.renderManager.mapModel.getTilesAccross() &&
          selectedTileY < scope.renderManager.mapModel.getTilesDown()
        ) {
          if (
            scope.renderManager.mapModel
              .getTile(scope.selectedLayer, selectedTileX, selectedTileY)
              .getTileCode() != -1
          ) {
            scope.renderManager.mapModel.modifyTile(
              scope.selectedLayer,
              selectedTileX,
              selectedTileY,
              [{ key: 'tileCode', value: -1 }]
            )
            changeRecorder.pushChange({
              verb: 'EraseSingleTile',
              x: selectedTileX,
              y: selectedTileY,
              z: scope.selectedLayer,
              tileCode: scope.selectedPalleteTile,
            })
          }
        }
      }
    } else if (scope.selectedTool === 'inspectTile') {
      if (scope.selectedLayer !== null) {
        if (
          selectedTileX < scope.renderManager.mapModel.getTilesAccross() &&
          selectedTileY < scope.renderManager.mapModel.getTilesDown()
        ) {
          scope.selectedTile = scope.renderManager.mapModel
            .getLayerByZPosition(scope.selectedLayer)
            .getRow(selectedTileY)[selectedTileX]
          // TODO: implement new tile properties system
        }
      }
    } else if (scope.selectedTool === 'bucketFill') {
      if (scope.selectedLayer !== null) {
        // queue of filled tiles (used in the 4-neighbour algorithm)
        queue = []
        currTile = null

        // determine the tilecode for selected tile
        selectedTileType = scope.renderManager.mapModel
          .getLayerByZPosition(scope.selectedLayer)
          .getRow(selectedTileY)
          [selectedTileX].getTileCode()

        // if the chosen tile differs from the selected tile from the palette, begin to fill it in (and its adjacent neighbours)
        if (selectedTileType !== scope.selectedPalleteTile) {
          changeRecorder.pushChange({
            verb: 'BucketFill',
            x: selectedTileX,
            y: selectedTileY,
            z: scope.selectedLayer,
            tileCode: selectedTileType,
          })

          // add the processed tile to the queue
          queue.push({
            data: scope.renderManager.mapModel
              .getLayerByZPosition(scope.selectedLayer)
              .getRow(selectedTileY)[selectedTileX],
            x: selectedTileX,
            y: selectedTileY,
          })

          while (queue.length !== 0) {
            // move front entry off queue
            currTile = queue.shift()

            if (currTile.data.getTileCode() === selectedTileType) {
              // modify tile code to match the one selected in the palette
              currTile.data.setTileCode(scope.selectedPalleteTile)

              // record all neighbours (iterating through to check them also)
              if (currTile.x > 0) {
                queue.push({
                  data: scope.renderManager.mapModel
                    .getLayerByZPosition(scope.selectedLayer)
                    .getRow(currTile.y)[currTile.x - 1],
                  x: currTile.x - 1,
                  y: currTile.y,
                })
              }
              if (
                currTile.x <
                scope.renderManager.mapModel.getTilesAccross() - 1
              ) {
                queue.push({
                  data: scope.renderManager.mapModel
                    .getLayerByZPosition(scope.selectedLayer)
                    .getRow(currTile.y)[currTile.x + 1],
                  x: currTile.x + 1,
                  y: currTile.y,
                })
              }
              if (currTile.y > 0) {
                queue.push({
                  data: scope.renderManager.mapModel
                    .getLayerByZPosition(scope.selectedLayer)
                    .getRow(currTile.y - 1)[currTile.x],
                  x: currTile.x,
                  y: currTile.y - 1,
                })
              }
              if (
                currTile.y <
                scope.renderManager.mapModel.getTilesDown() - 1
              ) {
                queue.push({
                  data: scope.renderManager.mapModel
                    .getLayerByZPosition(scope.selectedLayer)
                    .getRow(currTile.y + 1)[currTile.x],
                  x: currTile.x,
                  y: currTile.y + 1,
                })
              }
            }
          }
        }
      }
    }
  }
  EditorCanvas_MouseMove(event) {
    'use strict'
    const editorCanvas = document.getElementById('editorCanvas');
    if (scope.renderManager.mapModel) {
      scope.mouseX = event.pageX - editorCanvas.getBoundingClientRect().left;
      scope.mouseY = event.pageY - editorCanvas.getBoundingClientRect().top;
    }
  }
  EditorCanvas_MouseDown(event) {
    'use strict'
    var rowCount,
      cellCount,
      currentTile,
      startTileX,
      startTileY,
      tilePasteX,
      tilePasteY

    scope.ModifyTile()
    if (
      !scope.leftMouseButtonDown &&
      scope.selectedTool === 'singleTileBrush'
    ) {
      scope.editorClickInterval = setInterval(scope.ModifyTile, 10)
      scope.leftMouseButtonDown = true
    }
    if (!scope.leftMouseButtonDown && scope.selectedTool === 'eraser') {
      scope.editorClickInterval = setInterval(scope.ModifyTile, 10)
      scope.leftMouseButtonDown = true
    }

    if (!scope.leftMouseButtonDown && scope.selectedTool === 'areaSelect') {
      // grab mouse co-ordinates for start point of area selection
      scope.areaSelectX = event.pageX - document.getElementById('editorCanvas').getBoundingClientRect().x;
      scope.areaSelectY = event.pageY - document.getElementById('editorCanvas').getBoundingClientRect().y;
      scope.mouseX = event.pageX - document.getElementById('editorCanvas').getBoundingClientRect().x;
      scope.mouseY = event.pageY - document.getElementById('editorCanvas').getBoundingClientRect().y;
      // trigger drawing of the selection box and stop capturing any additional co-ordinates until mouse button is released
      scope.leftMouseButtonDown = true
      scope.areaSelectEnabled = true
      scope.selectedAreaTiles = null
    } else if (
      !scope.leftMouseButtonDown &&
      scope.selectedTool === 'pasteTiles'
    ) {
      // begin pasting tiles to map
      startTileX =
        event.pageX -
        document.getElementById('editorCanvas').getBoundingClientRect().x +
        scope.renderManager.mapModel.getTileWidth() / 2 +
        scope.renderManager.camera.getX() -
        (scope.selectedAreaTiles.rows[0].length *
          scope.renderManager.mapModel.getTileWidth()) /
          2
      startTileY =
        event.pageY -
        document.getElementById('editorCanvas').getBoundingClientRect().y +
        scope.renderManager.mapModel.getTileHeight() / 2 +
        scope.renderManager.camera.getY() -
        (scope.selectedAreaTiles.rows.length *
          scope.renderManager.mapModel.getTileHeight()) /
          2

      startTileX = Math.floor(
        startTileX / scope.renderManager.mapModel.getTileWidth()
      )
      startTileY = Math.floor(
        startTileY / scope.renderManager.mapModel.getTileHeight()
      )

      for (
        rowCount = 0;
        rowCount < scope.selectedAreaTiles.rows.length;
        rowCount++
      ) {
        for (
          cellCount = 0;
          cellCount < scope.selectedAreaTiles.rows[rowCount].length;
          cellCount++
        ) {
          currentTile = scope.selectedAreaTiles.rows[rowCount][cellCount]
          // verify that scope tile is being placed onto a part of the map that actually exists

          tilePasteX = startTileX + cellCount
          tilePasteY = startTileY + rowCount

          if (
            tilePasteX < scope.renderManager.mapModel.getTilesAccross() &&
            tilePasteY < scope.renderManager.mapModel.getTilesDown() &&
            tilePasteX >= 0 &&
            tilePasteY >= 0
          ) {
            scope.renderManager.mapModel
              .getLayerByZPosition(scope.selectedLayer)
              .getRow(startTileY + rowCount)
              [startTileX + cellCount].setTileCode(currentTile)
            changeRecorder.pushChange({
              verb: 'PaintSingleTile',
              x: tilePasteX,
              y: tilePasteY,
              z: scope.selectedLayer,
              tileCode: currentTile,
            })
          }
        }
      }

      // clear the array of copied tiles
      scope.leftMouseButtonDown = true
      scope.selectedAreaTiles = null
      scope.selectedTool = 'areaSelect'
    }
  }
  EditorCanvas_MouseUp() {
    'use strict'
    var startX,
      startY,
      endX,
      endY,
      firstCodeX,
      firstCodeY,
      lastCodeX,
      lastCodeY,
      row,
      rowCount,
      cellCount
    if (scope.leftMouseButtonDown) {
      clearInterval(scope.editorClickInterval)
      scope.editorClickInterval = null
    }
    if (scope.leftMouseButtonDown && scope.selectedTool === 'areaSelect') {
      if (scope.areaSelectEnabled) {
        if (scope.areaSelectX > scope.mouseX) {
          startX = scope.mouseX
          endX = scope.areaSelectX
        } else {
          startX = scope.areaSelectX
          endX = scope.mouseX
        }
        if (scope.areaSelectY > scope.mouseY) {
          startY = scope.mouseY
          endY = scope.areaSelectY
        } else {
          startY = scope.areaSelectY
          endY = scope.mouseY
        }

        if (
          endX <=
            scope.renderManager.camera.getWidth() +
              scope.renderManager.camera.getX() &&
          endY <=
            scope.renderManager.camera.getHeight() +
              scope.renderManager.camera.getY()
        ) {
          firstCodeX = Math.floor(
            (startX + scope.renderManager.camera.getX()) /
              scope.renderManager.mapModel.getTileWidth()
          )
          firstCodeY = Math.floor(
            (startY + scope.renderManager.camera.getY()) /
              scope.renderManager.mapModel.getTileHeight()
          )

          lastCodeX = Math.ceil(
            (endX + scope.renderManager.camera.getX()) /
              scope.renderManager.mapModel.getTileWidth()
          )
          lastCodeY = Math.ceil(
            (endY + scope.renderManager.camera.getY()) /
              scope.renderManager.mapModel.getTileHeight()
          )

          scope.selectedAreaTiles = { rows: [] }

          changeRecorder.pushChange({
            verb: 'AreaSelect',
            startX: firstCodeX,
            startY: firstCodeY,
            endX: lastCodeX - 1,
            endY: lastCodeY - 1,
          })

          for (rowCount = firstCodeY; rowCount < lastCodeY; rowCount++) {
            row = []
            for (cellCount = firstCodeX; cellCount < lastCodeX; cellCount++) {
              row.push(
                scope.renderManager.mapModel
                  .getLayerByZPosition(scope.selectedLayer)
                  .getRow(rowCount)
                  [cellCount].getTileCode()
              )
            }
            scope.selectedAreaTiles.rows.push(row)
          }
          scope.selectedTool = 'pasteTiles'
        }

        // find out which tiles fall within these bounds
        scope.areaSelectEnabled = false
      }
    }

    scope.leftMouseButtonDown = false
  }
  EditorCanvas_MouseOut() {
    'use strict'
    if (scope.leftMouseButtonDown) {
      clearInterval(scope.editorClickInterval)
      scope.editorClickInterval = null
    }
    if (scope.leftMouseButtonDown && scope.selectedTool === 'areaSelect') {
      scope.areaSelectEnabled = false
    }
    scope.leftMouseButtonDown = false
  }
  createNewMap(mapName, tileWidth, tileHeight, tilesAccross, tilesDown) {
    mapModel.set(new Map(scope))

    scope.renderManager.mapModel.createBlankModel(
      mapName,
      tileWidth,
      tileHeight,
      tilesAccross,
      tilesDown
    )
    scope.selectedLayer = 0

    //build the camera and pass in the world and view coordinates
    scope.renderManager.camera = new Camera(scope.renderManager.mapModel)
    scope.renderManager.camera.setPosition(0, 0)
    scope.renderManager.camera.setBounds(
      scope.renderManager.mapModel.getWorldWidth(),
      scope.renderManager.mapModel.getWorldHeight()
    )
    scope.renderManager.camera.setSize(
      document.getElementById('editorCanvas').getBoundingClientRect().width,
      document.getElementById('editorCanvas').getBoundingClientRect().height
    )
  }

  PalletCanvasResize() {
    'use strict'
    if (!document.getElementById('paletteCanvas')) {
      return
    }
    var tilesheetWidth,
      tilesheetHeight,
      tileWidth,
      tileHeight,
      totalTiles,
      tilesPerRow,
      rowCount,
      pickerHeight
    if (scope.selectedLayer !== null) {
      tilesheetWidth = scope.renderManager.mapModel
        .getLayerByZPosition(scope.selectedLayer)
        .getTilesetWidth()
      tilesheetHeight = scope.renderManager.mapModel
        .getLayerByZPosition(scope.selectedLayer)
        .getTilesetHeight()
      tileWidth = scope.renderManager.mapModel.getTileWidth()
      tileHeight = scope.renderManager.mapModel.getTileHeight()
      tilesPerRow = 256 / tileWidth
      totalTiles = (tilesheetWidth / tileWidth) * (tilesheetHeight / tileHeight)
      rowCount = Math.ceil(totalTiles / tilesPerRow)
      pickerHeight = rowCount * tileHeight
      document.getElementById('paletteCanvas').height = pickerHeight
      scope.renderManager.tilesetTilesAccross = tilesheetWidth / tileWidth
      scope.renderManager.tilesetTilesDown = tilesheetHeight / tileHeight
      scope.renderManager.pickerRowCount = rowCount
      scope.renderManager.pickerTilesPerRow = tilesPerRow
      scope.renderManager.totalPickerTiles = totalTiles
    }
  }

  LoadTilesetList() {
    'use strict'

    var result = [
      'brick_tiles_64.png',
      'default_tileset.png',
      'dirt_tiles.png',
      'environment_tiles_64.png',
      'furniture_tiles.png',
      'grass_tiles.png',
      'inside_tiles_64.png',
      'lightgrass_tiles.png',
      'platform_tiles.png',
      'terrain_tiles.png',
      'village_tiles.png',
      'water_tiles.png',
    ]

    scope.LoadTilesetList_Success(result)
  }
  LoadTilesetList_Success(data) {
    'use strict'
    scope.tilesets = data
  }
  showBuildMenu() {
    if (scope.renderManager.mapModel) {
    }
  }
}
