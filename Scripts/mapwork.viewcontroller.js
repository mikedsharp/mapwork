/*global $,jQuery,alert,mapwork,document,window,setTimeout,requestAnimationFrame*/
/*jslint plusplus: true, white: true */
window.mapwork.viewcontroller = {
  Init: function() {
    'use strict';
    this.InitiateRenderLoop();
  },
  BindEvent: function() {
    'use strict';
  },
  InitiateRenderLoop: function() {
    'use strict';
    setTimeout(
      mapwork.viewcontroller.DrawMap,
      1000 / mapwork.viewcontroller.DrawMap.viewFPS
    );
  },
  DrawMap: function() {
    'use strict';
    var currentLayer,
      currentRow,
      currentTile,
      layerCount,
      rowCount,
      canvas,
      cellCount,
      context,
      startColumn,
      startRow,
      endRow,
      endColumn,
      tileCode,
      pickerContext,
      pickerCanvas,
      pickerRowCount,
      pickerCellCount,
      startX,
      startY,
      width,
      height,
      totalLayerTiles;

    canvas = document.getElementById('editorCanvas');
    context = canvas.getContext('2d');

    requestAnimationFrame(mapwork.viewcontroller.InitiateRenderLoop);
    // Drawing code goes here
    if (mapwork.viewcontroller.mapModel && mapwork.viewcontroller.renderFlag) {
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);

      endRow =
        (mapwork.viewcontroller.camera.getY() +
          mapwork.viewcontroller.camera.getHeight()) /
        mapwork.viewcontroller.mapModel.getTileHeight();
      endRow = Math.ceil(parseFloat(endRow));
      endColumn =
        (mapwork.viewcontroller.camera.getX() +
          mapwork.viewcontroller.camera.getWidth()) /
        mapwork.viewcontroller.mapModel.getTileWidth();
      endColumn = Math.ceil(parseFloat(endColumn));
      startRow =
        mapwork.viewcontroller.camera.getY() /
        mapwork.viewcontroller.mapModel.getTileHeight();
      startRow = Math.floor(parseFloat(startRow));
      startColumn =
        mapwork.viewcontroller.camera.getX() /
        mapwork.viewcontroller.mapModel.getTileWidth();
      startColumn = Math.floor(parseFloat(startColumn));
      // run render the map
      for (
        layerCount = 0;
        layerCount < mapwork.viewcontroller.mapModel.getLayers().length;
        layerCount++
      ) {
        currentLayer = mapwork.viewcontroller.mapModel.getLayerByZPosition(
          layerCount
        );

        totalLayerTiles =
          (currentLayer.getTilesetWidth() /
            mapwork.viewcontroller.mapModel.getTileWidth()) *
          (currentLayer.getTilesetHeight() /
            mapwork.viewcontroller.mapModel.getTileHeight());

        if (currentLayer.getVisibility() === true) {
          for (rowCount = startRow; rowCount < endRow; rowCount++) {
            currentRow = currentLayer.getRow(rowCount);
            for (cellCount = startColumn; cellCount < endColumn; cellCount++) {
              currentTile = currentRow[cellCount];
              //draw appropriate tiles
              if (
                currentTile.getTileCode() !== -1 &&
                currentTile.getTileCode() < totalLayerTiles
              ) {
                context.drawImage(
                  currentLayer.getTilesetImage(),
                  parseInt(
                    (currentTile.getTileCode() *
                      mapwork.viewcontroller.mapModel.getTileWidth()) %
                      currentLayer.getTilesetWidth(),
                    10
                  ),
                  parseInt(
                    (currentTile.getTileCode() *
                      mapwork.viewcontroller.mapModel.getTileWidth()) /
                      currentLayer.getTilesetWidth(),
                    10
                  ) * mapwork.viewcontroller.mapModel.getTileWidth(),
                  mapwork.viewcontroller.mapModel.getTileWidth(),
                  mapwork.viewcontroller.mapModel.getTileHeight(),
                  cellCount * mapwork.viewcontroller.mapModel.getTileWidth() -
                    mapwork.viewcontroller.camera.getX(),
                  rowCount * mapwork.viewcontroller.mapModel.getTileHeight() -
                    mapwork.viewcontroller.camera.getY(),
                  mapwork.viewcontroller.mapModel.getTileWidth(),
                  mapwork.viewcontroller.mapModel.getTileHeight()
                );
              }
            }
          }
        }
      }

      if (mapwork.editor.environment.areaSelectEnabled) {
        // draw selection box onto canvas, above all other tiles and layers

        if (
          mapwork.editor.environment.areaSelectX >
          mapwork.editor.environment.mouseX
        ) {
          startX = mapwork.editor.environment.mouseX;
          // calculate differences between the start and end point of the box from mouse co-ordinates
          width = Math.abs(
            mapwork.editor.environment.mouseX -
              mapwork.editor.environment.areaSelectX
          );
        } else {
          startX = mapwork.editor.environment.areaSelectX;
          width = Math.abs(
            mapwork.editor.environment.mouseX -
              mapwork.editor.environment.areaSelectX
          );
        }
        if (
          mapwork.editor.environment.areaSelectY >
          mapwork.editor.environment.mouseY
        ) {
          startY = mapwork.editor.environment.mouseY;
          height = Math.abs(
            mapwork.editor.environment.mouseY -
              mapwork.editor.environment.areaSelectY
          );
        } else {
          startY = mapwork.editor.environment.areaSelectY;
          height = Math.abs(
            mapwork.editor.environment.mouseY -
              mapwork.editor.environment.areaSelectY
          );
        }
        // paint a grey rectangle to the screen, representing users selection
        context.strokeStyle = '#ddd';
        context.strokeRect(startX, startY, width, height);
      }
      // when a selection has been made, draw a copy of the selected tiles at the current mouse postion, this represents the pasting stencil
      if (
        mapwork.editor.environment.selectedAreaTiles &&
        mapwork.editor.environment.selectedTool === 'pasteTiles'
      ) {
        for (
          rowCount = 0;
          rowCount < mapwork.editor.environment.selectedAreaTiles.rows.length;
          rowCount++
        ) {
          for (
            cellCount = 0;
            cellCount <
            mapwork.editor.environment.selectedAreaTiles.rows[rowCount].length;
            cellCount++
          ) {
            if (
              mapwork.editor.environment.selectedAreaTiles.rows[rowCount][
                cellCount
              ] !== -1 &&
              mapwork.editor.environment.selectedAreaTiles.rows[rowCount][
                cellCount
              ] < mapwork.viewcontroller.totalPickerTiles
            ) {
              // draw each tile in sequence to represent the stencil
              context.drawImage(
                mapwork.viewcontroller.mapModel
                  .getLayerByZPosition(mapwork.editor.environment.selectedLayer)
                  .getTilesetImage(),
                parseInt(
                  (mapwork.editor.environment.selectedAreaTiles.rows[rowCount][
                    cellCount
                  ] *
                    mapwork.viewcontroller.mapModel.getTileWidth()) %
                    mapwork.viewcontroller.mapModel
                      .getLayerByZPosition(
                        mapwork.editor.environment.selectedLayer
                      )
                      .getTilesetWidth(),
                  10
                ),
                parseInt(
                  (mapwork.editor.environment.selectedAreaTiles.rows[rowCount][
                    cellCount
                  ] *
                    mapwork.viewcontroller.mapModel.getTileWidth()) /
                    mapwork.viewcontroller.mapModel
                      .getLayerByZPosition(
                        mapwork.editor.environment.selectedLayer
                      )
                      .getTilesetWidth(),
                  10
                ) * mapwork.viewcontroller.mapModel.getTileWidth(),
                mapwork.viewcontroller.mapModel.getTileWidth(),
                mapwork.viewcontroller.mapModel.getTileHeight(),
                mapwork.editor.environment.mouseX +
                  mapwork.viewcontroller.mapModel.getTileWidth() * cellCount -
                  (mapwork.viewcontroller.mapModel.getTileWidth() *
                    mapwork.editor.environment.selectedAreaTiles.rows[rowCount]
                      .length) /
                    2,
                mapwork.editor.environment.mouseY +
                  mapwork.viewcontroller.mapModel.getTileHeight() * rowCount -
                  (mapwork.viewcontroller.mapModel.getTileHeight() *
                    mapwork.editor.environment.selectedAreaTiles.rows.length) /
                    2,
                mapwork.viewcontroller.mapModel.getTileWidth(),
                mapwork.viewcontroller.mapModel.getTileHeight()
              );
            }
          }
        }
        // draw an outline around the stencil to make clear where it starts and ends
        context.strokeStyle = '#ddd';

        context.strokeRect(
          mapwork.editor.environment.mouseX -
            (mapwork.viewcontroller.mapModel.getTileWidth() *
              mapwork.editor.environment.selectedAreaTiles.rows[0].length) /
              2,
          mapwork.editor.environment.mouseY -
            (mapwork.viewcontroller.mapModel.getTileHeight() *
              mapwork.editor.environment.selectedAreaTiles.rows.length) /
              2,
          mapwork.editor.environment.selectedAreaTiles.rows[0].length *
            mapwork.viewcontroller.mapModel.getTileWidth(),
          mapwork.editor.environment.selectedAreaTiles.rows.length *
            mapwork.viewcontroller.mapModel.getTileHeight()
        );
      }

      // now the tile picker
      if (
        $('#paletteDialog').is(':visible') &&
        mapwork.viewcontroller.mapModel.getLayers().length > 0 &&
        mapwork.editor.environment.selectedLayer !== null
      ) {
        //draw the tiles in the palette

        pickerCanvas = document.getElementById('paletteCanvas');
        pickerContext = pickerCanvas.getContext('2d');

        pickerContext.fillStyle = '#ccc';
        pickerContext.rect(
          0,
          0,
          $('#paletteCanvas').width(),
          $('#paletteCanvas').height()
        );
        pickerContext.fill();

        tileCode = 0;
        currentLayer = mapwork.viewcontroller.mapModel.getLayerByZPosition(
          mapwork.editor.environment.selectedLayer
        );
        for (
          pickerRowCount = 0;
          pickerRowCount < mapwork.viewcontroller.pickerRowCount;
          pickerRowCount++
        ) {
          for (
            pickerCellCount = 0;
            pickerCellCount < mapwork.viewcontroller.pickerTilesPerRow;
            pickerCellCount++
          ) {
            if (tileCode < mapwork.viewcontroller.totalPickerTiles) {
              pickerContext.drawImage(
                currentLayer.getTilesetImage(),
                parseInt(
                  (tileCode * mapwork.viewcontroller.mapModel.getTileWidth()) %
                    currentLayer.getTilesetWidth(),
                  10
                ),
                parseInt(
                  (tileCode * mapwork.viewcontroller.mapModel.getTileWidth()) /
                    currentLayer.getTilesetWidth(),
                  10
                ) * mapwork.viewcontroller.mapModel.getTileWidth(),
                mapwork.viewcontroller.mapModel.getTileWidth(),
                mapwork.viewcontroller.mapModel.getTileHeight(),
                pickerCellCount *
                  mapwork.viewcontroller.mapModel.getTileWidth(),
                pickerRowCount *
                  mapwork.viewcontroller.mapModel.getTileHeight(),
                mapwork.viewcontroller.mapModel.getTileWidth(),
                mapwork.viewcontroller.mapModel.getTileHeight()
              );
            }

            tileCode++;
          }
        }
      }

      if (mapwork.editor.environment.gridEnabled) {
        // render tile grid
        endRow =
          (mapwork.viewcontroller.camera.getY() +
            mapwork.viewcontroller.camera.getHeight()) /
          mapwork.viewcontroller.mapModel.getTileHeight();
        endRow = Math.ceil(parseFloat(endRow));
        endColumn =
          (mapwork.viewcontroller.camera.getX() +
            mapwork.viewcontroller.camera.getWidth()) /
          mapwork.viewcontroller.mapModel.getTileWidth();
        endColumn = Math.ceil(parseFloat(endColumn));
        startRow =
          mapwork.viewcontroller.camera.getY() /
          mapwork.viewcontroller.mapModel.getTileHeight();
        startRow = Math.floor(parseFloat(startRow));
        startColumn =
          mapwork.viewcontroller.camera.getX() /
          mapwork.viewcontroller.mapModel.getTileWidth();
        startColumn = Math.floor(parseFloat(startColumn));

        for (rowCount = startRow; rowCount < endRow; rowCount++) {
          context.strokeStyle = '#000';
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(
            0,
            rowCount * mapwork.viewcontroller.mapModel.getTileHeight() -
              mapwork.viewcontroller.camera.getY()
          );
          context.lineTo(
            mapwork.viewcontroller.camera.getWidth(),
            rowCount * mapwork.viewcontroller.mapModel.getTileHeight() -
              mapwork.viewcontroller.camera.getY()
          );
          context.stroke();
        }

        for (cellCount = startColumn; cellCount < endColumn; cellCount++) {
          context.strokeStyle = '#000';
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(
            cellCount * mapwork.viewcontroller.mapModel.getTileWidth() -
              mapwork.viewcontroller.camera.getX(),
            0
          );
          context.lineTo(
            cellCount * mapwork.viewcontroller.mapModel.getTileWidth() -
              mapwork.viewcontroller.camera.getX(),
            mapwork.viewcontroller.camera.getHeight()
          );
          context.stroke();
        }
      }
    }
  },
  getPickerTileCode: function(x, y) {
    'use strict';
    var row, col;
    row = Math.floor(y / mapwork.viewcontroller.mapModel.getTileHeight());
    col = Math.floor(x / mapwork.viewcontroller.mapModel.getTileWidth());

    if (
      row * mapwork.viewcontroller.pickerTilesPerRow + col <
      mapwork.viewcontroller.totalPickerTiles
    ) {
      mapwork.editor.environment.selectedPalleteTile =
        row * mapwork.viewcontroller.pickerTilesPerRow + col;
    }
  },
  mapModel: null,
  camera: null,
  renderFlag: true,
  viewFPS: 5,
  tilesetTilesAccross: null,
  tilesetTilesDown: null,
  pickerRowCount: null,
  pickerTilesPerRow: null,
  totalPickerTiles: null
};
