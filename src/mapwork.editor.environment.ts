import { Map } from './mapwork.model.map'
import { Layer } from './mapwork.model.layer'
import { Camera } from './mapwork.view.camera'
import { ChangeRecorder } from './mapwork.editor.changes'
import { ValidationHelper } from './mapwork.helper.validation'
import { RenderManager } from './mapwork.rendermanager'
import { DisplayNotification } from './NotificationBanner/NotificationService'

import { mapModel } from './MapModel/MapModel'
let mapModelInstance

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
    // bind all JQuery event handlers
    scope.BindEvent()

    // Trigger a window resize to make canvas fit into page
    scope.Window_Resize()
    scope.LoadTilesetList()
    scope.renderManager.Init()
  }
  BindEvent() {
    'use strict'

    $(window).resize(scope.Window_Resize.bind(scope))
    $('#editorCanvas').mousedown(scope.EditorCanvas_MouseDown.bind(scope))
    $('#editorCanvas').mouseup(scope.EditorCanvas_MouseUp.bind(scope))
    $('#editorCanvas').mouseout(scope.EditorCanvas_MouseOut.bind(scope))
    $('#editorCanvas').mousemove(scope.EditorCanvas_MouseMove.bind(scope))

    // left ribbon events
    $('#saveItem').click(scope.SaveItem_Click.bind(scope))

    $('#toolboxItemInspect').click(scope.ToolboxItemInspect_Click.bind(scope))

    //change events for dialogs
    $('#createExistingProjectName').change(
      scope.CreateExistingProjectName_Change
    )

    $('#propertyTable').on(
      'blur',
      '.propertiesInput',
      scope.PropertiesInput_Blur.bind(scope)
    )

    //binders for map properties section
    $('#selectPropertyScope').change(scope.SelectPropertyScope_Change)
    $('#selectLayerScope').change(scope.SelectLayerScope_Change)

    // navigation key handlers
    $(window).keydown(scope.Editor_KeyDown.bind(scope))
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
  
  PropertiesInput_Blur(event) {
    'use strict'
    var scopeValue, layerValue, html, properties

    scopeValue = parseInt($('#selectPropertyScope').val().toString(), 10)
    layerValue = parseInt($('#selectLayerScope').val().toString(), 10)

    if (scopeValue === 0) {
      properties = scope.renderManager.mapModel
    } else if (scopeValue === 1) {
      properties = scope.renderManager.mapModel.getLayer(layerValue)
    } else if (scopeValue === 2) {
      properties = scope.selectedTile
    }

    if ($(event.target).parent().parent().hasClass('lastRow')) {
      // last row gets appended if user addes something to previous last row, otherwise, row stays the same
      if (
        $(event.target)
          .parent()
          .parent()
          .children()
          .find('.propertyKey')
          .val() !== ''
      ) {
        // add the property to the model

        $(event.target)
          .parent()
          .parent()
          .data(
            'key',
            $(event.target)
              .parent()
              .parent()
              .children()
              .find('.propertyKey')
              .val()
          )
        $(event.target)
          .parent()
          .parent()
          .data(
            'value',
            $(event.target)
              .parent()
              .parent()
              .children()
              .find('.propertyValue')
              .val()
          )

        properties.addProperty({
          key: $(event.target)
            .parent()
            .parent()
            .children()
            .find('.propertyKey')
            .val(),
          value: $(event.target)
            .parent()
            .parent()
            .children()
            .find('.propertyValue')
            .val(),
        })

        // remove the 'last row class'
        $(event.target).parent().parent().removeClass('lastRow')
        html =
          ' <div class="tableRow border lastRow">' +
          '<div class="tableCell border">' +
          '<input type="text"   class="noPadding propertyKey propertiesInput" />' +
          '</div>' +
          '<div class="tableCell border">' +
          '<input type="text"  class="noPadding propertyValue propertiesInput" />' +
          ' </div>'

        $(html).insertAfter($(event.target).parent().parent())
        // scope.RefreshScrollpane('propertiesScroll')
      }
    } else {
      // scope isnt the bottom row, but does need to be removed from the DOM
      if (
        $(event.target)
          .parent()
          .parent()
          .children()
          .find('.propertyKey')
          .val() === ''
      ) {
        properties.removeProperty($(event.target).parent().parent().data('key'))
        $(event.target).parent().parent().remove()
        // scope.RefreshScrollpane('propertiesScroll')
      } else {
        // property exists, lets modify it
        properties.setProperty({
          oldKey: $(event.target).parent().parent().data('key'),
          newKey: $(event.target)
            .parent()
            .parent()
            .children()
            .find('.propertyKey')
            .val(),
          newValue: $(event.target)
            .parent()
            .parent()
            .children()
            .find('.propertyValue')
            .val(),
        })
      }
    }
  }
  SelectLayerScope_Change(event) {
    'use strict'

    var inputValue, scopeValue

    scopeValue = parseInt($('#selectPropertyScope').val().toString(), 10)
    inputValue = parseInt($(event.target).val().toString(), 10)

    if (inputValue === -1) {
      $('#propertiesInspectTile').off(
        'click',
        scope.PropertiesInspectTile_Click.bind(scope)
      )
    } else {
      if (scopeValue === 2) {
        //Tile-level scope
        $('#propertiesInspectTile').on(
          'click',
          scope.PropertiesInspectTile_Click.bind(scope)
        )
      } else if (scopeValue === 1) {
        scope.BuildPropertyTable('layer')
        $('#propertyTable').show()
      }
    }
  }

  BuildPropertyTable(propertyType) {
    'use strict'
    var properties, html, propertyCount, inputValue

    // empty existing table contents
    $('#propertyTable').empty()

    // add heading
    html = '<div class="tableRow border">'
    html += '<div class="tableCell border">'
    html += '<span class="textCentered">Property</span>'
    html += '</div>'
    html += '<div class="tableCell border">'
    html += '<span class="textCentered">Value</span>'
    html += '</div>'

    $('#propertyTable').append(html)

    // add property data
    if (propertyType === 'map') {
      properties = scope.renderManager.mapModel.getAllProperties()
    } else if (propertyType === 'layer') {
      inputValue = parseInt($('#selectLayerScope').val().toString(), 10)
      properties = scope.renderManager.mapModel
        .getLayer(inputValue)
        .getAllProperties()
      //add properties from the model
    } else if (propertyType === 'tile') {
      properties = scope.selectedTile.getAllProperties()
    }

    for (
      propertyCount = 0;
      propertyCount < properties.length;
      propertyCount++
    ) {
      html = '<div class ="tableRow border">'
      html += '<div class="tableCell border">'
      html +=
        '<input type="text" value="' +
        properties[propertyCount].key +
        '" class="noPadding propertyKey propertiesInput" />'
      html += '</div>'
      html += '<div class="tableCell border">'
      html +=
        '<input type="text" value="' +
        properties[propertyCount].value +
        '" class="noPadding propertyValue propertiesInput" />'
      html += '</div>'
      html += '</div>'
      html = $(html)
      $(html).data('key', properties[propertyCount].key)
      $(html).data('value', properties[propertyCount].value)

      $('#propertyTable').append(html)
    }
    // a final row for enterting a new property
    html = '<div class ="tableRow border lastRow">'
    html += '<div class="tableCell border">'
    html +=
      '<input type="text" value="' +
      '" class="noPadding propertyKey propertiesInput" />'
    html += '</div>'
    html += '<div class="tableCell border">'
    html +=
      '<input type="text" value="' +
      '" class="noPadding propertyValue propertiesInput" />'
    html += '</div>'
    html += '</div>'
    $('#propertyTable').append(html)
  }

  SelectPropertyScope_Change() {
    'use strict'

    var inputValue, html, layerCount
    inputValue = parseInt($(this).val().toString(), 10)

    $('#propertyTable').empty()

    // add heading to property table
    html = '<div class="tableRow border">'
    html += '<div class="tableCell border">'
    html += '<span class="textCentered">Property</span>'
    html += '</div>'
    html += '<div class="tableCell border">'
    html += '<span class="textCentered">Value</span>'
    html += '</div>'

    $('#propertyTable').append(html)
    html = ''

    // set layer scope dropdown to default again
    $('#selectLayerScope').val('-1')
    $('#propertiesInspectTile').off('click', scope.PropertiesInspectTile_Click)

    switch (inputValue) {
      case 0:
        $('#selectLayerScope').attr('disabled', 'true')
        break
      case 1:
        $('#selectLayerScope').attr('disabled', 'false')
        break
      case 2:
        $('#selectLayerScope').attr('disabled', 'true')
        break
      case -1:
        $('#selectLayerScope').attr('disabled', 'true')
        break
      default:
        break
    }
    // map-level logic
    if (inputValue === 0) {
      scope.BuildPropertyTable('map')
      $('#propertyTable').show()
    } else if (inputValue === -1) {
      $('#propertyTable').empty()
      $('#propertyTable').hide()
    } else if (inputValue === 2) {
      $('#propertiesInspectTile').on('click', scope.PropertiesInspectTile_Click)
      $('#propertyTable').show()
    }
    if ($('#selectLayerScope').attr('disabled') !== 'disabled') {
      // populate the list with layer data from the model
      $('#selectLayerScope').empty()
      html = '<option value="-1">--Select Layer--</option>'
      $('#selectLayerScope').append(html)
      for (
        layerCount = 0;
        layerCount < scope.renderManager.mapModel.getLayers().length;
        layerCount++
      ) {
        html =
          '<option value="' +
          layerCount +
          '"> ' +
          scope.renderManager.mapModel.getLayer(layerCount).getName() +
          ' </option>'
        $('#selectLayerScope').append(html)
      }
    }
  }

  PropertiesInspectTile_Click() {
    'use strict'
    scope.selectedTool = 'inspectTile'
  }

  RefreshScrollpane(element) {
    'use strict'

    // var pane, api

    // pane = $($('.' + element))
    // api = pane.data('jsp')
    // api.reinitialise()
  }

  LoadPropertiesFromModel() {
    'use strict'
    if ($('#selectPropertyScope').val() === '2') {
      scope.BuildPropertyTable('tile')
    }
  }

  LoadSettingsFromModel() {
    'use strict'
    $('#settingsMapName').val(scope.renderManager.mapModel.getName())
    $('#settingsTilesAccross').val(
      scope.renderManager.mapModel.getTilesAccross()
    )
    $('#settingsTilesDown').val(scope.renderManager.mapModel.getTilesDown())
    $('#settingsTileWidth').val(scope.renderManager.mapModel.getTileWidth())
    $('#settingsTileHeight').val(scope.renderManager.mapModel.getTileHeight())
  }

  LayerListItemDescription_Click() {
    'use strict'

    // remove the highlighter for all unselected layers
    $('.layerListItem').each(function (index, element) {
      $(element).removeClass('layerSelected')
      $(element).addClass('layerUnselected')
    })
    // add a highlighter to the selected element

    $(this).parent().addClass('layerSelected')
    $(this).parent().removeClass('layerUnselected')
    scope.selectedLayer = $(this).parent().data('zPosition')
    scope.selectedPalleteTile = 0
  }

  CreateExistingProjectName_Change(event) {
    'use strict'

    if ($(event.target).val() === '0') {
      $('#createProjectOptions').show()
    } else {
      $('#createProjectOptions').hide()
    }
  }

  ToolboxItemInspect_Click() {
    'use strict'
    scope.selectedTool = 'inspectTile'
  }

  Window_Resize() {
    'use strict'
    //let's resize the canvas to the size of the window space
    document.getElementById('editorCanvas').width = $(
      '#canvasContainer'
    ).width()
    document.getElementById('editorCanvas').height = $(
      '#canvasContainer'
    ).height()

    //resize the tile palette based on the size of the screen
    if (
      document.getElementById('paletteCanvasContainer') &&
      document.getElementById('paletteCanvas') &&
      document.getElementById('paletteInfo')
    ) {
      $('#paletteCanvasContainer').css(
        'top',
        $('#paletteInfo').height().toString() + 'px'
      )
      document.getElementById('paletteCanvas').width = $(
        '#paletteCanvasContainer'
      ).width()
      document.getElementById('paletteCanvas').height = $(
        '#paletteCanvasContainer'
      ).height()
    }

    //inform mapwork.rendermanager of update
    if (scope.renderManager.camera) {
      scope.renderManager.camera.setSize(
        $('#editorCanvas').width(),
        $('#editorCanvas').height()
      )
      scope.renderManager.camera.setPosition(
        scope.renderManager.camera.getX(),
        scope.renderManager.camera.getY()
      )
    }

    // refresh all scrollbars
    // scope.RefreshScrollpane('layerScroll')
    // scope.RefreshScrollpane('propertiesScroll')
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
          scope.LoadPropertiesFromModel()
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
    if (scope.renderManager.mapModel) {
      scope.mouseX = event.pageX - $('#editorCanvas').offset().left
      scope.mouseY = event.pageY - $('#editorCanvas').offset().top
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

    // rebuild UI from model
    scope.BuildUIFromModel()
  }
  CompressMapData_Success(data) {
    'use strict'
    var encodedData
    //begin sending scope to the server
    encodedData = encodeURIComponent(data)
    scope.PostMapForDownload(encodedData)
  }
  PostMapForDownload() {
    'use strict'
    /*  var fileDownloadCheckTimer, token, assetsIncluded;

        scope.downloadToken = new Date().getTime().toString();

        if ($('#publishIncludeAssets:checked').length > 0) {
            assetsIncluded = 'true';
        }
        else {
            assetsIncluded = 'false';
        }

        //add submission form to view
        $('body').append($('<form/>', {
            id: 'postDownloadMap',
            method: 'POST',
            action: LocationSettings.getMapBundleLocation
        }));
        // momentarily provide hidden fields, including users specifications and an identifying token
        $('#postDownloadMap').append($('<input/>', {
            type: 'hidden',
            name: 'mapData',
            value: mapData
        }));

        $('#postDownloadMap').append($('<input/>', {
            type: 'hidden',
            name: 'mapName',
            value: scope.renderManager.mapModel.getName()
        }));

        $('#postDownloadMap').append($('<input/>', {
            type: 'hidden',
            name: 'exportFormat',
            value: $('#publishSelectOutputFormat').val()
        }));


        $('#postDownloadMap').append($('<input/>', {
            type: 'hidden',
            name: 'includeAssets',
            value: assetsIncluded
        }));

        $('#postDownloadMap').append($('<input/>', {
            type: 'hidden',
            name: 'downloadToken',
            value: scope.downloadToken
        }));


        scope.downloadInterval = window.setInterval(scope.CheckDownloadTimer, 1000);

        $('#postDownloadMap').submit();
        $('#postDownloadMap').empty();
        $('body').remove('#postDownloadMap');

        */
  }
  BuildUIFromModel() {
    'use strict'
    // scope.LoadLayersFromModel()
    scope.LoadSettingsFromModel()
  }
  SaveItem_Click() {
    'use strict'
    if (
      scope.renderManager.mapModel !== null &&
      scope.renderManager.mapModel !== undefined
    ) {
      scope.PresentRibbonContextMenu('save')
    }
  }
  openPropertiesDrawer() {
    'use strict'
    scope.PresentRibbonDialog('properties')
  }
  openSettingsDrawer() {
    'use strict'
    scope.LoadSettingsFromModel()
    scope.PresentRibbonDialog('settings')
  }
  PresentRibbonDialog(kind) {
    // 'use strict'
    // $('#' + kind + 'Dialog').toggle()
    // if (kind !== 'palette') {
    //   $('#paletteDialog').hide()
    // } else {
    //   //// assign a tilesheet to the palette for selected layer
    //   scope.PalletCanvasResize()
    // }
    // if (kind !== 'layers') {
    //   $('#layersDialog').hide()
    // } else {
    //   scope.LoadLayersFromModel()
    // }
    // if (kind !== 'properties') {
    //   $('#propertiesDialog').hide()
    // } else {
    //   // reset property selection
    //   $('#selectPropertyScope').val('-1')
    //   $('#selectPropertyScope').trigger('change')
    // }
    // if (kind !== 'settings') {
    //   $('#settingsDialog').hide()
    // } else {
    //   //clear error validation warnings
    //   $('#settingsSelectProject').removeClass('errorBorder')
    //   $('#settingsMapName').removeClass('errorBorder')
    //   $('#settingsTilesAccross').removeClass('errorBorder')
    //   $('#settingsTilesDown').removeClass('errorBorder')
    //   $('#settingsTileHeight').removeClass('errorBorder')
    //   $('#settingsTileWidth').removeClass('errorBorder')
    //   scope.LoadSettingsFromModel()
    // }
    // // alter size of the main canvas, based on dialog being visible or not
    // if ($('#' + kind + 'Dialog').is(':visible')) {
    //   $('#canvasContainer').css('right', '328px')
    // } else {
    //   $('#canvasContainer').css('right', '72px')
    // }
    // // do a canvas resize based on new dimensions of screen after toggle
    // scope.Window_Resize()
  }
  PresentRibbonContextMenu(kind) {
    'use strict'
    scope.PresentRibbonDialog('none')
    if (kind === 'build') {
      $('#buildContextRibbon').show()
    } else {
      $('#buildContextRibbon').hide()
    }
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
    /*  $.ajax({
            url: 'Editor/GetTilesetFilenames',
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            success: scope.LoadTilesetList_Success,
            error: scope.LoadTilesetList_Error
        });
        */

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
  LoadTilesetList_Error() {
    'use strict'
    DisplayNotification('Failed to retrieve tilesets from server', 'red')
  }
  showBuildMenu() {
    if (scope.renderManager.mapModel) {
      scope.PresentRibbonContextMenu('build')
    }
  }
}
