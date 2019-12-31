window.mapwork.rendermanager = {
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
      mapwork.rendermanager.DrawMap,
      1000 / mapwork.rendermanager.DrawMap.viewFPS
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

    requestAnimationFrame(mapwork.rendermanager.InitiateRenderLoop);
    // Drawing code goes here
    if (mapwork.rendermanager.mapModel && mapwork.rendermanager.renderFlag) {
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);

      endRow =
        (mapwork.rendermanager.camera.getY() +
          mapwork.rendermanager.camera.getHeight()) /
        mapwork.rendermanager.mapModel.getTileHeight();
      endRow = Math.ceil(parseFloat(endRow));
      endColumn =
        (mapwork.rendermanager.camera.getX() +
          mapwork.rendermanager.camera.getWidth()) /
        mapwork.rendermanager.mapModel.getTileWidth();
      endColumn = Math.ceil(parseFloat(endColumn));
      startRow =
        mapwork.rendermanager.camera.getY() /
        mapwork.rendermanager.mapModel.getTileHeight();
      startRow = Math.floor(parseFloat(startRow));
      startColumn =
        mapwork.rendermanager.camera.getX() /
        mapwork.rendermanager.mapModel.getTileWidth();
      startColumn = Math.floor(parseFloat(startColumn));
      // run render the map
      for (
        layerCount = 0;
        layerCount < mapwork.rendermanager.mapModel.getLayers().length;
        layerCount++
      ) {
        currentLayer = mapwork.rendermanager.mapModel.getLayerByZPosition(
          layerCount
        );

        totalLayerTiles =
          (currentLayer.getTilesetWidth() /
            mapwork.rendermanager.mapModel.getTileWidth()) *
          (currentLayer.getTilesetHeight() /
            mapwork.rendermanager.mapModel.getTileHeight());

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
                      mapwork.rendermanager.mapModel.getTileWidth()) %
                      currentLayer.getTilesetWidth(),
                    10
                  ),
                  parseInt(
                    (currentTile.getTileCode() *
                      mapwork.rendermanager.mapModel.getTileWidth()) /
                      currentLayer.getTilesetWidth(),
                    10
                  ) * mapwork.rendermanager.mapModel.getTileWidth(),
                  mapwork.rendermanager.mapModel.getTileWidth(),
                  mapwork.rendermanager.mapModel.getTileHeight(),
                  cellCount * mapwork.rendermanager.mapModel.getTileWidth() -
                    mapwork.rendermanager.camera.getX(),
                  rowCount * mapwork.rendermanager.mapModel.getTileHeight() -
                    mapwork.rendermanager.camera.getY(),
                  mapwork.rendermanager.mapModel.getTileWidth(),
                  mapwork.rendermanager.mapModel.getTileHeight()
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
              ] < mapwork.rendermanager.totalPickerTiles
            ) {
              // draw each tile in sequence to represent the stencil
              context.drawImage(
                mapwork.rendermanager.mapModel
                  .getLayerByZPosition(mapwork.editor.environment.selectedLayer)
                  .getTilesetImage(),
                parseInt(
                  (mapwork.editor.environment.selectedAreaTiles.rows[rowCount][
                    cellCount
                  ] *
                    mapwork.rendermanager.mapModel.getTileWidth()) %
                    mapwork.rendermanager.mapModel
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
                    mapwork.rendermanager.mapModel.getTileWidth()) /
                    mapwork.rendermanager.mapModel
                      .getLayerByZPosition(
                        mapwork.editor.environment.selectedLayer
                      )
                      .getTilesetWidth(),
                  10
                ) * mapwork.rendermanager.mapModel.getTileWidth(),
                mapwork.rendermanager.mapModel.getTileWidth(),
                mapwork.rendermanager.mapModel.getTileHeight(),
                mapwork.editor.environment.mouseX +
                  mapwork.rendermanager.mapModel.getTileWidth() * cellCount -
                  (mapwork.rendermanager.mapModel.getTileWidth() *
                    mapwork.editor.environment.selectedAreaTiles.rows[rowCount]
                      .length) /
                    2,
                mapwork.editor.environment.mouseY +
                  mapwork.rendermanager.mapModel.getTileHeight() * rowCount -
                  (mapwork.rendermanager.mapModel.getTileHeight() *
                    mapwork.editor.environment.selectedAreaTiles.rows.length) /
                    2,
                mapwork.rendermanager.mapModel.getTileWidth(),
                mapwork.rendermanager.mapModel.getTileHeight()
              );
            }
          }
        }
        // draw an outline around the stencil to make clear where it starts and ends
        context.strokeStyle = '#ddd';

        context.strokeRect(
          mapwork.editor.environment.mouseX -
            (mapwork.rendermanager.mapModel.getTileWidth() *
              mapwork.editor.environment.selectedAreaTiles.rows[0].length) /
              2,
          mapwork.editor.environment.mouseY -
            (mapwork.rendermanager.mapModel.getTileHeight() *
              mapwork.editor.environment.selectedAreaTiles.rows.length) /
              2,
          mapwork.editor.environment.selectedAreaTiles.rows[0].length *
            mapwork.rendermanager.mapModel.getTileWidth(),
          mapwork.editor.environment.selectedAreaTiles.rows.length *
            mapwork.rendermanager.mapModel.getTileHeight()
        );
      }

      // now the tile picker
      if (
        $('#paletteDialog').is(':visible') &&
        mapwork.rendermanager.mapModel.getLayers().length > 0 &&
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
        currentLayer = mapwork.rendermanager.mapModel.getLayerByZPosition(
          mapwork.editor.environment.selectedLayer
        );
        for (
          pickerRowCount = 0;
          pickerRowCount < mapwork.rendermanager.pickerRowCount;
          pickerRowCount++
        ) {
          for (
            pickerCellCount = 0;
            pickerCellCount < mapwork.rendermanager.pickerTilesPerRow;
            pickerCellCount++
          ) {
            if (tileCode < mapwork.rendermanager.totalPickerTiles) {
              pickerContext.drawImage(
                currentLayer.getTilesetImage(),
                parseInt(
                  (tileCode * mapwork.rendermanager.mapModel.getTileWidth()) %
                    currentLayer.getTilesetWidth(),
                  10
                ),
                parseInt(
                  (tileCode * mapwork.rendermanager.mapModel.getTileWidth()) /
                    currentLayer.getTilesetWidth(),
                  10
                ) * mapwork.rendermanager.mapModel.getTileWidth(),
                mapwork.rendermanager.mapModel.getTileWidth(),
                mapwork.rendermanager.mapModel.getTileHeight(),
                pickerCellCount * mapwork.rendermanager.mapModel.getTileWidth(),
                pickerRowCount * mapwork.rendermanager.mapModel.getTileHeight(),
                mapwork.rendermanager.mapModel.getTileWidth(),
                mapwork.rendermanager.mapModel.getTileHeight()
              );
            }

            tileCode++;
          }
        }
      }

      if (mapwork.editor.environment.gridEnabled) {
        // render tile grid
        endRow =
          (mapwork.rendermanager.camera.getY() +
            mapwork.rendermanager.camera.getHeight()) /
          mapwork.rendermanager.mapModel.getTileHeight();
        endRow = Math.ceil(parseFloat(endRow));
        endColumn =
          (mapwork.rendermanager.camera.getX() +
            mapwork.rendermanager.camera.getWidth()) /
          mapwork.rendermanager.mapModel.getTileWidth();
        endColumn = Math.ceil(parseFloat(endColumn));
        startRow =
          mapwork.rendermanager.camera.getY() /
          mapwork.rendermanager.mapModel.getTileHeight();
        startRow = Math.floor(parseFloat(startRow));
        startColumn =
          mapwork.rendermanager.camera.getX() /
          mapwork.rendermanager.mapModel.getTileWidth();
        startColumn = Math.floor(parseFloat(startColumn));

        for (rowCount = startRow; rowCount < endRow; rowCount++) {
          context.strokeStyle = '#000';
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(
            0,
            rowCount * mapwork.rendermanager.mapModel.getTileHeight() -
              mapwork.rendermanager.camera.getY()
          );
          context.lineTo(
            mapwork.rendermanager.camera.getWidth(),
            rowCount * mapwork.rendermanager.mapModel.getTileHeight() -
              mapwork.rendermanager.camera.getY()
          );
          context.stroke();
        }

        for (cellCount = startColumn; cellCount < endColumn; cellCount++) {
          context.strokeStyle = '#000';
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(
            cellCount * mapwork.rendermanager.mapModel.getTileWidth() -
              mapwork.rendermanager.camera.getX(),
            0
          );
          context.lineTo(
            cellCount * mapwork.rendermanager.mapModel.getTileWidth() -
              mapwork.rendermanager.camera.getX(),
            mapwork.rendermanager.camera.getHeight()
          );
          context.stroke();
        }
      }
    }
  },
  getPickerTileCode: function(x, y) {
    'use strict';
    var row, col;
    row = Math.floor(y / mapwork.rendermanager.mapModel.getTileHeight());
    col = Math.floor(x / mapwork.rendermanager.mapModel.getTileWidth());

    if (
      row * mapwork.rendermanager.pickerTilesPerRow + col <
      mapwork.rendermanager.totalPickerTiles
    ) {
      mapwork.editor.environment.selectedPalleteTile =
        row * mapwork.rendermanager.pickerTilesPerRow + col;
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
