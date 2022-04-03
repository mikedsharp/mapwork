import { mapModel } from './MapModel/MapModel'
export class RenderManager {
  EditorEnvironment: any
  mapModel: any
  camera: any
  renderFlag: boolean
  viewFPS: number
  tilesetTilesAccross: any
  tilesetTilesDown: any
  pickerRowCount: any
  pickerTilesPerRow: any
  totalPickerTiles: any
  mapSubscriber: any
  constructor(EditorEnvironment) {
    // inject dependencies
    this.EditorEnvironment = EditorEnvironment

    this.mapModel = null
    this.camera = null
    this.renderFlag = true
    this.viewFPS = 20
    this.tilesetTilesAccross = null
    this.tilesetTilesDown = null
    this.pickerRowCount = null
    this.pickerTilesPerRow = null
    this.totalPickerTiles = null

    this.mapSubscriber = mapModel.subscribe((value) => {
      this.mapModel = value
    })
  }
  Init() {
    'use strict'
    this.InitiateRenderLoop()
  }
  InitiateRenderLoop() {
    'use strict'
    window.setTimeout(() => {
      this.DrawMap()
    }, 1000 / this.viewFPS)
  }
  DrawMap() {
    'use strict'
    var canvas, context

    canvas = document.getElementById('editorCanvas')
    context = canvas.getContext('2d')

    requestAnimationFrame(() => {
      this.InitiateRenderLoop()
    })

    // Drawing code goes here
    if (!this.mapModel || !this.renderFlag) {
      return
    }

    this.clearCanvas(context, canvas.width, canvas.height)
    this.renderMapTiles(context)
    this.renderAreaSelectTool(context)
    this.drawStencilBrush(context)

    // now the tile picker
    this.renderTilePicker()
    this.renderGrid(context)
  }

  clearCanvas(context, width, height) {
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
  }

  drawStencilBrush(context) {
    let rowCount, cellCount
    // when a selection has been made, draw a copy of the selected tiles at the current mouse postion, this represents the pasting stencil
    if (
      this.EditorEnvironment.selectedAreaTiles &&
      this.EditorEnvironment.selectedTool === 'pasteTiles'
    ) {
      for (
        rowCount = 0;
        rowCount < this.EditorEnvironment.selectedAreaTiles.rows.length;
        rowCount++
      ) {
        for (
          cellCount = 0;
          cellCount <
          this.EditorEnvironment.selectedAreaTiles.rows[rowCount].length;
          cellCount++
        ) {
          if (
            this.EditorEnvironment.selectedAreaTiles.rows[rowCount][
              cellCount
            ] !== -1 &&
            this.EditorEnvironment.selectedAreaTiles.rows[rowCount][cellCount] <
              this.totalPickerTiles
          ) {
            // draw each tile in sequence to represent the stencil
            context.drawImage(
              this.mapModel
                .getLayerByZPosition(this.EditorEnvironment.selectedLayer)
                .getTilesetImage(),
              parseInt(
               ( (this.EditorEnvironment.selectedAreaTiles.rows[rowCount][
                cellCount
              ] *
                this.mapModel.getTileWidth()) %
                this.mapModel
                  .getLayerByZPosition(this.EditorEnvironment.selectedLayer)
                  .getTilesetWidth()).toString(),
                10
              ),
              parseInt(
                ((this.EditorEnvironment.selectedAreaTiles.rows[rowCount][
                  cellCount
                ] *
                  this.mapModel.getTileWidth()) /
                  this.mapModel
                    .getLayerByZPosition(this.EditorEnvironment.selectedLayer)
                    .getTilesetWidth()).toString(),
                10
              ) * this.mapModel.getTileWidth(),
              this.mapModel.getTileWidth(),
              this.mapModel.getTileHeight(),
              this.EditorEnvironment.mouseX +
                this.mapModel.getTileWidth() * cellCount -
                (this.mapModel.getTileWidth() *
                  this.EditorEnvironment.selectedAreaTiles.rows[rowCount]
                    .length) /
                  2,
              this.EditorEnvironment.mouseY +
                this.mapModel.getTileHeight() * rowCount -
                (this.mapModel.getTileHeight() *
                  this.EditorEnvironment.selectedAreaTiles.rows.length) /
                  2,
              this.mapModel.getTileWidth(),
              this.mapModel.getTileHeight()
            )
          }
        }
      }
      // draw an outline around the stencil to make clear where it starts and ends
      context.strokeStyle = '#ddd'

      context.strokeRect(
        this.EditorEnvironment.mouseX -
          (this.mapModel.getTileWidth() *
            this.EditorEnvironment.selectedAreaTiles.rows[0].length) /
            2,
        this.EditorEnvironment.mouseY -
          (this.mapModel.getTileHeight() *
            this.EditorEnvironment.selectedAreaTiles.rows.length) /
            2,
        this.EditorEnvironment.selectedAreaTiles.rows[0].length *
          this.mapModel.getTileWidth(),
        this.EditorEnvironment.selectedAreaTiles.rows.length *
          this.mapModel.getTileHeight()
      )
    }
  }
  renderMapTiles(context) {
    let startRow,
      endRow,
      startColumn,
      endColumn,
      layerCount,
      rowCount,
      cellCount,
      currentLayer,
      currentRow,
      currentTile,
      totalLayerTiles
    endRow =
      (this.camera.getY() + this.camera.getHeight()) /
      this.mapModel.getTileHeight()
    endRow = Math.ceil(parseFloat(endRow))
    endColumn =
      (this.camera.getX() + this.camera.getWidth()) /
      this.mapModel.getTileWidth()
    endColumn = Math.ceil(parseFloat(endColumn))
    startRow = this.camera.getY() / this.mapModel.getTileHeight()
    startRow = Math.floor(parseFloat(startRow))
    startColumn = this.camera.getX() / this.mapModel.getTileWidth()
    startColumn = Math.floor(parseFloat(startColumn))
    // run render the map
    for (
      layerCount = this.mapModel.getLayers().length - 1;
      layerCount >= 0;
      layerCount--
    ) {
      currentLayer = this.mapModel.getLayerByZPosition(layerCount)

      totalLayerTiles =
        (currentLayer.getTilesetWidth() / this.mapModel.getTileWidth()) *
        (currentLayer.getTilesetHeight() / this.mapModel.getTileHeight())

      if (currentLayer.getVisibility() === true) {
        for (rowCount = startRow; rowCount < endRow; rowCount++) {
          currentRow = currentLayer.getRow(rowCount)
          for (cellCount = startColumn; cellCount < endColumn; cellCount++) {
            currentTile = currentRow[cellCount]
            //draw appropriate tiles
            if (
              currentTile.getTileCode() !== -1 &&
              currentTile.getTileCode() < totalLayerTiles
            ) {
              context.drawImage(
                currentLayer.getTilesetImage(),
                parseInt(
                  (  (currentTile.getTileCode() * this.mapModel.getTileWidth()) %
                  currentLayer.getTilesetWidth()).toString(),
                  10
                ),
                parseInt(
                  ((currentTile.getTileCode() * this.mapModel.getTileWidth()) /
                  currentLayer.getTilesetWidth()).toString(),
                  10
                ) * this.mapModel.getTileWidth(),
                this.mapModel.getTileWidth(),
                this.mapModel.getTileHeight(),
                cellCount * this.mapModel.getTileWidth() - this.camera.getX(),
                rowCount * this.mapModel.getTileHeight() - this.camera.getY(),
                this.mapModel.getTileWidth(),
                this.mapModel.getTileHeight()
              )
            }
          }
        }
      }
    }
  }
  renderAreaSelectTool(context) {
    let startX, startY, width, height
    if (this.EditorEnvironment.areaSelectEnabled) {
      // draw selection box onto canvas, above all other tiles and layers

      if (this.EditorEnvironment.areaSelectX > this.EditorEnvironment.mouseX) {
        startX = this.EditorEnvironment.mouseX
        // calculate differences between the start and end point of the box from mouse co-ordinates
        width = Math.abs(
          this.EditorEnvironment.mouseX - this.EditorEnvironment.areaSelectX
        )
      } else {
        startX = this.EditorEnvironment.areaSelectX
        width = Math.abs(
          this.EditorEnvironment.mouseX - this.EditorEnvironment.areaSelectX
        )
      }
      if (this.EditorEnvironment.areaSelectY > this.EditorEnvironment.mouseY) {
        startY = this.EditorEnvironment.mouseY
        height = Math.abs(
          this.EditorEnvironment.mouseY - this.EditorEnvironment.areaSelectY
        )
      } else {
        startY = this.EditorEnvironment.areaSelectY
        height = Math.abs(
          this.EditorEnvironment.mouseY - this.EditorEnvironment.areaSelectY
        )
      }
      // paint a grey rectangle to the screen, representing users selection
      context.strokeStyle = '#ddd'
      context.strokeRect(startX, startY, width, height)
    }
  }

  renderGrid(context) {
    if (this.EditorEnvironment.gridEnabled) {
      let startRow, endRow, startColumn, endColumn
      let rowCount, cellCount
      // render tile grid
      endRow =
        (this.camera.getY() + this.camera.getHeight()) /
        this.mapModel.getTileHeight()
      endRow = Math.ceil(parseFloat(endRow))
      endColumn =
        (this.camera.getX() + this.camera.getWidth()) /
        this.mapModel.getTileWidth()
      endColumn = Math.ceil(parseFloat(endColumn))
      startRow = this.camera.getY() / this.mapModel.getTileHeight()
      startRow = Math.floor(parseFloat(startRow))
      startColumn = this.camera.getX() / this.mapModel.getTileWidth()
      startColumn = Math.floor(parseFloat(startColumn))

      for (rowCount = startRow; rowCount < endRow; rowCount++) {
        context.strokeStyle = '#000'
        context.lineWidth = 1
        context.beginPath()
        context.moveTo(
          0,
          rowCount * this.mapModel.getTileHeight() - this.camera.getY()
        )
        context.lineTo(
          this.camera.getWidth(),
          rowCount * this.mapModel.getTileHeight() - this.camera.getY()
        )
        context.stroke()
      }

      for (cellCount = startColumn; cellCount < endColumn; cellCount++) {
        context.strokeStyle = '#000'
        context.lineWidth = 1
        context.beginPath()
        context.moveTo(
          cellCount * this.mapModel.getTileWidth() - this.camera.getX(),
          0
        )
        context.lineTo(
          cellCount * this.mapModel.getTileWidth() - this.camera.getX(),
          this.camera.getHeight()
        )
        context.stroke()
      }
    }
  }

  renderTilePicker(palletteDialogVisible = false) {
    let pickerRowCount
    let pickerCellCount
    let tileCode
    const paletteDialog = document.getElementById('paletteDialog');
    if(!paletteDialog) {
      return;
    }
    const paletteDialogStyles = window.getComputedStyle(paletteDialog);
    const paletteDialogVisible = paletteDialogStyles.display !== 'none';
    if (
      (paletteDialogVisible || palletteDialogVisible) &&
      this.mapModel.getLayers().length > 0 &&
      this.EditorEnvironment.selectedLayer !== null
    ) {
      //draw the tiles in the palette

      const pickerCanvas:any = document.getElementById('paletteCanvas')
      const pickerContext:any = pickerCanvas.getContext('2d')

      pickerContext.fillStyle = '#ccc'
      pickerContext.rect(
        0,
        0,
        pickerCanvas.getBoundingClientRect().width,
        pickerCanvas.getBoundingClientRect().height
      )
      pickerContext.fill()

      tileCode = 0
      const currentLayer = this.mapModel.getLayerByZPosition(
        this.EditorEnvironment.selectedLayer
      )
      for (
        pickerRowCount = 0;
        pickerRowCount < this.pickerRowCount;
        pickerRowCount++
      ) {
        for (
          pickerCellCount = 0;
          pickerCellCount < this.pickerTilesPerRow;
          pickerCellCount++
        ) {
          if (tileCode < this.totalPickerTiles) {
            pickerContext.drawImage(
              currentLayer.getTilesetImage(),
              parseInt(
              (  (tileCode * this.mapModel.getTileWidth()) %
              currentLayer.getTilesetWidth()).toString(),
                10
              ),
              parseInt(
                ((tileCode * this.mapModel.getTileWidth()) /
                currentLayer.getTilesetWidth()).toString(),
                10
              ) * this.mapModel.getTileWidth(),
              this.mapModel.getTileWidth(),
              this.mapModel.getTileHeight(),
              pickerCellCount * this.mapModel.getTileWidth(),
              pickerRowCount * this.mapModel.getTileHeight(),
              this.mapModel.getTileWidth(),
              this.mapModel.getTileHeight()
            )
          }

          tileCode++
        }
      }
    }
  }

  getPickerTileCode(x, y) {
    'use strict'
    var row, col
    row = Math.floor(y / this.mapModel.getTileHeight())
    col = Math.floor(x / this.mapModel.getTileWidth())

    if (row * this.pickerTilesPerRow + col < this.totalPickerTiles) {
      this.EditorEnvironment.selectedPalleteTile =
        row * this.pickerTilesPerRow + col
    }
  }
}
