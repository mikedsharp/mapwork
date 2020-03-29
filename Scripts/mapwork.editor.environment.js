import { Map } from './mapwork.model.map'
import { Layer } from './mapwork.model.layer'
import { Camera } from './mapwork.view.camera'
import { ChangeRecorder } from './mapwork.editor.changes'
import { ValidationHelper } from './mapwork.helper.validation'
import { RenderManager } from './mapwork.rendermanager'

// svelte stuff
import { mapModel } from './Stores/MapModel'

const changeRecorder = new ChangeRecorder()
let scope
export class EditorEnvironment {
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
  }
  Init() {
    'use strict'
    // bind all JQuery event handlers
    scope.BindEvent()

    // add custom decoration to elements
    $('.layerScroll').jScrollPane()
    $('.propertiesScroll').jScrollPane()

    // Trigger a window resize to make canvas fit into page
    scope.Window_Resize()
    scope.LoadTilesetList()
    scope.renderManager.Init()
    mapModel.subscribe((value) => {
      scope.renderManager.mapModel = value
    })
  }
  BindEvent() {
    'use strict'

    $(window).resize(scope.Window_Resize.bind(scope))
    $('#editorCanvas').mousedown(scope.EditorCanvas_MouseDown.bind(scope))
    $('#editorCanvas').mouseup(scope.EditorCanvas_MouseUp.bind(scope))
    $('#editorCanvas').mouseout(scope.EditorCanvas_MouseOut.bind(scope))
    $('#editorCanvas').mousemove(scope.EditorCanvas_MouseMove.bind(scope))

    $('#paletteCanvas').click(scope.PaletteCanvas_Click.bind(scope))
    // left ribbon events
    $('#createItem').click(scope.CreateItem_Click.bind(scope))
    $('#buildItem').click(scope.BuildItem_Click.bind(scope))
    $('#saveItem').click(scope.SaveItem_Click.bind(scope))
    $('#publishItem').click(scope.PublishItem_Click.bind(scope))
    // right ribbon events (toolbox context)
    $('#paletteItem').click(scope.PaletteItem_Click.bind(scope))
    $('#layersItem').click(scope.LayersItem_Click.bind(scope))
    $('#propertiesItem').click(scope.PropertiesItem_Click.bind(scope))
    $('#settingsItem').click(scope.SettingsItem_Click.bind(scope))

    $('#createButtonNext').click(scope.CreateButtonNext_Click.bind(scope))
    $('#createButtonOK').click(scope.CreateButtonOK_Click.bind(scope))
    $('#createButtonCancel').click(scope.CreateButtonCancel_Click.bind(scope))
    $('#createButtonCancelTwo').click(
      scope.CreateButtonCancel_Click.bind(scope)
    )

    $('#publishButtonOK').click(scope.PublishButtonOK_Click.bind(scope))
    $('#publishButtonCancel').click(scope.PublishButtonCancel_Click.bind(scope))
    $('#publishButtonCancelPublish').click(
      scope.PublishButtonCancelPublish_Click.bind(scope)
    )
    $('#publishButtonSuccessOK').click(
      scope.PublishButtonSuccessOK_Click.bind(scope)
    )

    //toolbox items
    $('#toolboxItemAreaselect').click(
      scope.ToolboxItemAreaselect_Click.bind(scope)
    )
    $('#toolboxItemInspect').click(scope.ToolboxItemInspect_Click.bind(scope))
    $('#toolboxItemBrush').click(scope.ToolboxItemBrush_Click.bind(scope))
    $('#toolboxItemBucket').click(scope.ToolboxItemBucket_Click.bind(scope))
    $('#toolboxItemEraser').click(scope.ToolboxItemEraser_Click.bind(scope))

    //change events for dialogs
    $('#createExistingProjectName').change(
      scope.CreateExistingProjectName_Change
    )

    //layer selection click event (accounts for appended list elements)
    $('#layerList').on(
      'click',
      '.layerListItemDescription',
      scope.LayerListItemDescription_Click
    )
    $('#layerList').on(
      'click',
      '.renameLayer',
      scope.RenameLayer_Click.bind(scope)
    )
    $('#layerList').on(
      'click',
      '.toggleLayerVisibility',
      scope.ToggleLayerVisibility_Click.bind(scope)
    )
    $('#layerList').on(
      'click',
      '.deleteLayer',
      scope.DeleteLayer_Click.bind(scope)
    )

    $('#layerList').on(
      'change',
      '.layerSelectTileset ',
      scope.LayerSelectTileset_Change.bind(scope)
    )

    $('#layerCreateNewLayer').click(scope.LayerCreateNewLayer_Click.bind(scope))
    $('#layerMoveUp').click(scope.LayerMoveUp_Click.bind(scope))
    $('#layerMoveDown').click(scope.LayerMoveDown_Click.bind(scope))
    $('#propertyTable').on(
      'blur',
      '.propertiesInput',
      scope.PropertiesInput_Blur.bind(scope)
    )

    //binders for map properties section
    $('#selectPropertyScope').change(scope.SelectPropertyScope_Change)
    $('#selectLayerScope').change(scope.SelectLayerScope_Change)

    // settings menu binders
    $('#settingsToggleGrid').click(scope.SettingsToggleGrid_Change.bind(scope))
    $('#settingsSaveChanges').click(scope.SettingsSaveChanges_Click.bind(scope))

    // navigation key handlers
    $(window).keydown(scope.Editor_KeyDown.bind(scope))
    $(window).keyup(scope.Editor_KeyUp.bind(scope))
  }
  Editor_KeyDown(event) {
    'use strict'
    //move the camera around the map with given directional arrow key
    if (scope.renderManager.camera) {
      event = event || window.event
      if (window.opera && !scope.arrowKeyDown) {
        switch (event.keyCode) {
          case 37:
            scope.editorMoveInterval = setInterval(
              scope.renderManager.camera.move('left', 16),
              10
            )
            scope.arrowKeyDown = true
            break
          case 39:
            scope.editorMoveInterval = setInterval(
              scope.renderManager.camera.move('right', 16),
              10
            )
            scope.arrowKeyDown = true
            break
          case 40:
            scope.editorMoveInterval = setInterval(
              scope.renderManager.camera.move('down', 16),
              10
            )
            scope.arrowKeyDown = true
            break
          case 38:
            scope.editorMoveInterval = setInterval(
              scope.renderManager.camera.move('up', 16),
              10
            )
            scope.arrowKeyDown = true
            break
          default:
            break
        }
      } else {
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
      }

      if (scope.selectedTool === 'pasteTiles') {
        if (event.keyCode === 27) {
          scope.selectedAreaTiles = null
          scope.selectedTool = 'areaSelect'
        }
      }
    }
  }
  Editor_KeyUp() {
    'use strict'
    // resolve repeating keys issue in opera
    if (window.opera) {
      clearInterval(scope.editorMoveInterval)
      scope.arrowKeyDown = false
      scope.editorMoveInterval = null
    }
  }
  SettingsToggleGrid_Change() {
    'use strict'
    if ($('#settingsToggleGrid:checked').length > 0) {
      scope.gridEnabled = true
    } else {
      scope.gridEnabled = false
    }
    //user toggles on-screen grid
  }
  SettingsSaveChanges_Click() {
    'use strict'
    var result, valid
    valid = true

    // remove error borders pre-validation
    $('#settingsSelectProject').removeClass('errorBorder')
    $('#settingsMapName').removeClass('errorBorder')
    $('#settingsTilesAccross').removeClass('errorBorder')
    $('#settingsTilesDown').removeClass('errorBorder')
    $('#settingsTileHeight').removeClass('errorBorder')
    $('#settingsTileWidth').removeClass('errorBorder')

    // validate each field an add error borders where appropriate

    result = ValidationHelper.validateInput($('#settingsMapName'), [
      { kind: 'required' },
      { kind: 'istext' },
    ])

    if (result.length > 0) {
      $('#settingsMapName').addClass('errorBorder')
      valid = false
    }

    result = ValidationHelper.validateInput($('#settingsTilesAccross'), [
      { kind: 'required' },
      { kind: 'isnumeric' },
      { kind: 'min', value: 1 },
    ])

    if (result.length > 0) {
      $('#settingsTilesAccross').addClass('errorBorder')
      valid = false
    }
    result = ValidationHelper.validateInput($('#settingsTilesDown'), [
      { kind: 'required' },
      { kind: 'isnumeric' },
      { kind: 'min', value: 1 },
    ])

    if (result.length > 0) {
      $('#settingsTilesDown').addClass('errorBorder')
      valid = false
    }
    //result = ValidationHelper.validateInput($('#settingsTileWidth'),
    //    [{ kind: 'required' },
    //        { kind: 'isnumeric' },
    //        { kind: 'min', value: 1 }]);

    //if (result.length > 0) {
    //    $('#settingsTileWidth').addClass('errorBorder');
    //    valid = false;
    //}
    //result = ValidationHelper.validateInput($('#settingsTileHeight'),
    //    [{ kind: 'required' },
    //        { kind: 'isnumeric' },
    //        { kind: 'min', value: 1 }]);

    //if (result.length > 0) {
    //    $('#settingsTileHeight').addClass('errorBorder');
    //    valid = false;
    //}
    //if ($('#settingsSelectProject').val() === '-1') {
    //    $('#settingsSelectProject').addClass('errorBorder');
    //    valid = false;
    //}

    if (
      parseInt($('#settingsTilesAccross').val(), 10) *
        parseInt($('#settingsTilesDown').val(), 10) >
      16384
    ) {
      scope.DisplayNotification(
        'Tiles per layer must not exceed 16384 (e.g 128x128 or 512x32 etc)',
        'red'
      )
      valid = false
    }

    if (valid) {
      //check if any changes have occured
      if (
        $('#settingsMapName').val() !== scope.renderManager.mapModel.getName()
      ) {
        // update the model
        scope.renderManager.mapModel.setName($('#settingsMapName').val())
      }
      //check if any changes have occured
      if (
        $('#settingsTilesAccross').val() !==
        scope.renderManager.mapModel.getTilesAccross()
      ) {
        // update the model
        scope.renderManager.renderFlag = false
        scope.renderManager.mapModel.resizeMap({
          tilesAccross: $('#settingsTilesAccross').val(),
        })
        //update the camera
        scope.renderManager.camera.setBounds(
          scope.renderManager.mapModel.getWorldWidth(),
          scope.renderManager.mapModel.getWorldHeight()
        )
        //scope.renderManager.camera.setSize(scope.renderManager.camera.getWidth(), scope.renderManager.camera.getHeight());
        scope.renderManager.camera.setSize(
          $('#editorCanvas').width(),
          $('#editorCanvas').height()
        )
        scope.renderManager.camera.setPosition(
          scope.renderManager.camera.getX(),
          scope.renderManager.camera.getY()
        )

        scope.renderManager.renderFlag = true
      }
      //check if any changes have occured
      if (
        $('#settingsTilesDown').val() !==
        scope.renderManager.mapModel.getTilesDown()
      ) {
        // update the model
        scope.renderManager.renderFlag = false
        scope.renderManager.mapModel.resizeMap({
          tilesDown: $('#settingsTilesDown').val(),
        })
        scope.renderManager.camera.setBounds(
          scope.renderManager.mapModel.getWorldWidth(),
          scope.renderManager.mapModel.getWorldHeight()
        )
        scope.renderManager.camera.setSize(
          $('#editorCanvas').width(),
          $('#editorCanvas').height()
        )
        scope.renderManager.camera.setPosition(
          scope.renderManager.camera.getX(),
          scope.renderManager.camera.getY()
        )

        scope.renderManager.renderFlag = true
      }
      ////check if any changes have occured
      //if ($('#settingsTileWidth').val() !== scope.renderManager.mapModel.getTileWidth()) {
      //    // update the model
      //    scope.renderManager.renderFlag = false;
      //    scope.renderManager.mapModel.setTileWidth($('#settingsTileWidth').val());

      //    scope.renderManager.camera.setBounds(scope.renderManager.mapModel.getWorldWidth(), scope.renderManager.mapModel.getWorldHeight());
      //    scope.renderManager.camera.setSize($('#editorCanvas').width(), $('#editorCanvas').height());
      //    scope.renderManager.camera.setPosition(scope.renderManager.camera.getX(), scope.renderManager.camera.getY());
      //    scope.renderManager.renderFlag = true;
      //}
      ////check if any changes have occured
      //if ($('#settingsTileHeight').val() !== scope.renderManager.mapModel.getTileHeight()) {
      //    // update the model
      //    scope.renderManager.renderFlag = false;
      //    scope.renderManager.mapModel.setTileHeight($('#settingsTileHeight').val());
      //    scope.renderManager.camera.setBounds(scope.renderManager.mapModel.getWorldWidth(), scope.renderManager.mapModel.getWorldHeight());
      //    scope.renderManager.camera.setSize($('#editorCanvas').width(), $('#editorCanvas').height());
      //    scope.renderManager.camera.setPosition(scope.renderManager.camera.getX(), scope.renderManager.camera.getY());
      //    scope.renderManager.renderFlag = true;
      //}
      scope.DisplayNotification('Changes Saved', 'green')
    }
  }
  PropertiesInput_Blur(event) {
    'use strict'
    var scopeValue, layerValue, html, properties

    scopeValue = parseInt($('#selectPropertyScope').val(), 10)
    layerValue = parseInt($('#selectLayerScope').val(), 10)

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
        scope.RefreshScrollpane('propertiesScroll')
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
        scope.RefreshScrollpane('propertiesScroll')
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

    scopeValue = parseInt($('#selectPropertyScope').val(), 10)
    inputValue = parseInt($(event.target).val(), 10)

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
      inputValue = parseInt($('#selectLayerScope').val(), 10)
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
    inputValue = parseInt($(this).val(), 10)

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
        $('#selectLayerScope').attr('disabled', true)
        break
      case 1:
        $('#selectLayerScope').attr('disabled', false)
        break
      case 2:
        $('#selectLayerScope').attr('disabled', true)
        break
      case -1:
        $('#selectLayerScope').attr('disabled', true)
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
  ToggleLayerVisibility_Click(event) {
    'use strict'

    // code for changing the sprite from/to visible or hidden
    if ($(event.target).hasClass('layerVisibilityIconVisible')) {
      $(event.target).removeClass('layerVisibilityIconVisible')
      $(event.target).addClass('layerVisibilityIconHidden')
      scope.renderManager.mapModel
        .getLayerByZPosition(
          $(event.target).parent().parent().data('zPosition')
        )
        .setVisibility(false)
    } else {
      $(event.target).addClass('layerVisibilityIconVisible')
      $(event.target).removeClass('layerVisibilityIconHidden')
      scope.renderManager.mapModel
        .getLayerByZPosition(
          $(event.target).parent().parent().data('zPosition')
        )
        .setVisibility(true)
    }
  }
  RenameLayer_Click(event) {
    'use strict'
    var result
    // dummy code for renaming a layer
    $(event.target)
      .parent()
      .parent()
      .find('.layerNameInput')
      .removeClass('errorBorder')

    if (
      $(event.target).parent().parent().find('.layerNameInput').is(':visible')
    ) {
      // validate selection
      result = ValidationHelper.validateInput(
        $(event.target).parent().parent().find('.layerNameInput'),
        [{ kind: 'required' }, { kind: 'istext' }]
      )

      if (result.length < 1) {
        $(event.target).parent().parent().find('.layerName').show()
        $(event.target).parent().parent().find('.layerNameInput').hide()
        $(event.target)
          .parent()
          .parent()
          .find('.layerName')
          .first()
          .text($(event.target).parent().parent().find('.layerNameInput').val())
        scope.renderManager.mapModel
          .getLayer($(event.target).parent().parent().data('zPosition'))
          .setName(
            $(event.target).parent().parent().find('.layerNameInput').val()
          )
      } else {
        $(event.target)
          .parent()
          .parent()
          .find('.layerNameInput')
          .addClass('errorBorder')
      }
    } else {
      $(event.target).parent().parent().find('.layerName').hide()
      $(event.target)
        .parent()
        .parent()
        .find('.layerNameInput')
        .val($(event.target).parent().parent().find('.layerName').text())
      $(event.target).parent().parent().find('.layerNameInput').show()
    }

    scope.RefreshScrollpane('layerScroll')
  }
  DeleteLayer_Click(event) {
    'use strict'
    var layerCount
    // code for physically removing the layer element from the DOM
    scope.renderManager.mapModel.removeLayer(
      $(event.target).parent().parent().data('zPosition')
    )

    // if layer is selected layer, remove selected layer
    scope.selectedLayer = null
    // re-order array
    for (
      layerCount = 0;
      layerCount < scope.renderManager.mapModel.getLayers().length;
      layerCount++
    ) {
      scope.renderManager.mapModel.getLayer(layerCount).setZPosition(layerCount)
    }
    scope.RefreshScrollpane('layerScroll')
    // rebuild the View
    scope.LoadLayersFromModel()
  }

  RefreshScrollpane(element) {
    'use strict'

    var pane, api

    pane = $($('.' + element))
    api = pane.data('jsp')
    api.reinitialise()
  }
  LayerCreateNewLayer_Click() {
    'use strict'

    var layerName, newLayer

    if (scope.renderManager.mapModel.getLayers().length < 5) {
      //create new layer
      layerName =
        'Untitled Layer ' + scope.renderManager.mapModel.getLayers().length

      // adding the new layer to the model
      newLayer = new Layer(scope)
      newLayer.createBlankModelLayer(
        scope.renderManager.mapModel,
        layerName,
        'default_tileset.png'
      )
      newLayer.setZPosition(scope.renderManager.mapModel.getLayers().length)
      scope.selectedLayer = scope.renderManager.mapModel.getLayers().length
      scope.renderManager.mapModel.addLayer(newLayer)

      // refresh layers view
      scope.LoadLayersFromModel()
      //refresh the scrollpane
      scope.RefreshScrollpane('layerScroll')
    } else {
      scope.DisplayNotification('A map may only have up to 5 layers', 'red')
    }
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

  LoadLayersFromModel() {
    'use strict'
    var layerCount,
      html,
      layerName,
      visible,
      tilesetSelect,
      tileset,
      tilesetCount

    //update list of layers with contents of model, starting with emptying previous contents
    $('#layerList').empty()

    for (
      layerCount = 0;
      layerCount < scope.renderManager.mapModel.getLayers().length;
      layerCount++
    ) {
      tileset = scope.renderManager.mapModel
        .getLayer(layerCount)
        .getTilesetPath()
      layerName = scope.renderManager.mapModel.getLayer(layerCount).getName()
      visible = scope.renderManager.mapModel
        .getLayer(layerCount)
        .getVisibility()
      html = $(
        '<li class="layerListItem layerUnselected">' +
          '<div class="layerListItemDescription">' +
          '<span class="layerName">' +
          layerName +
          '</span>' +
          '<input type="text" class="layerNameInput">' +
          '</input>' +
          '<select class="layerSelectTileset noPadding marT-10"> </select>' +
          '</div>' +
          '<div class="layerListItemActions">' +
          '<a class="renameLayer"></a>' +
          '<a class="toggleLayerVisibility ' +
          (visible
            ? 'layerVisibilityIconVisible'
            : 'layerVisibilityIconHidden') +
          '"></a>' +
          '<a class="deleteLayer"></a>' +
          '</div>' +
          '</li>'
      )
      $(html).data(
        'zPosition',
        scope.renderManager.mapModel.getLayer(layerCount).getZPosition()
      )

      // append tileset data to the selected list element
      tilesetSelect = $(html).find('.layerSelectTileset')

      if (scope.tilesets !== null) {
        for (
          tilesetCount = 0;
          tilesetCount < scope.tilesets.length;
          tilesetCount++
        ) {
          tilesetSelect.append(
            '<option value=' +
              scope.tilesets[tilesetCount] +
              '>' +
              scope.tilesets[tilesetCount] +
              '</option>'
          )
        }
      }
      tilesetSelect.val(tileset)

      // check whether layer was previously selected and which layer was
      if ($(html).data('zPosition') === scope.selectedLayer) {
        $(html).removeClass('layerUnselected')
        $(html).addClass('layerSelected')
      }
      $('#layerList').prepend(html)
    }
  }

  LayerMoveUp_Click() {
    'use strict'

    var target
    target = $('#layerList').find('.layerSelected').prev()
    if (target.length > 0) {
      // move list element up above preceeding list element
      scope.renderManager.mapModel.swapLayers(
        $(target).data('zPosition'),
        $(target).next().data('zPosition')
      )
      scope.selectedLayer = $(target).data('zPosition')
      scope.LoadLayersFromModel()
      scope.RefreshScrollpane('layerScroll')
    }
  }

  LayerMoveDown_Click() {
    'use strict'

    var target
    target = $('#layerList').find('.layerSelected').next()
    if (target.length > 0) {
      // move the layer down after next element in list
      scope.renderManager.mapModel.swapLayers(
        $(target).data('zPosition'),
        $(target).prev().data('zPosition')
      )
      scope.selectedLayer = $(target).data('zPosition')
      scope.LoadLayersFromModel()
      scope.RefreshScrollpane('layerScroll')
    }
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

  ToolboxItemAreaselect_Click() {
    'use strict'
    scope.selectedTool = 'areaSelect'
  }

  ToolboxItemInspect_Click() {
    'use strict'
    scope.selectedTool = 'inspectTile'
  }

  ToolboxItemBrush_Click() {
    'use strict'
    scope.selectedTool = 'singleTileBrush'
  }

  ToolboxItemBucket_Click() {
    'use strict'
    scope.selectedTool = 'bucketFill'
  }

  ToolboxItemEraser_Click() {
    'use strict'
    scope.selectedTool = 'eraser'
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
    $('#paletteCanvasContainer').css(
      'top',
      $('#paletteInfo').height().toString() + 'px'
    )
    document.getElementById('paletteCanvas').width = $(
      '#paletteCanvasContainer'
    ).width()
    //document.getElementById('paletteCanvas').height = $('#paletteCanvasContainer').height();

    // reposition dialogs
    $('#createDialog').css(
      'top',
      $('#leftBar').height() / 2 - $('#createDialog').height() / 2 + 'px'
    )
    $('#publishDialog').css(
      'top',
      $('#leftBar').height() / 2 - $('#publishDialog').height() / 2 + 'px'
    )

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
    scope.RefreshScrollpane('layerScroll')
    scope.RefreshScrollpane('propertiesScroll')
  }
  ModifyTile() {
    'use strict'
    var selectedTileX, selectedTileY, queue, currTile, selectedTileType

    if (scope.selectedTool === 'singleTileBrush') {
      if (scope.selectedLayer !== null) {
        selectedTileX = scope.mouseX + scope.renderManager.camera.getX()
        selectedTileX = parseInt(
          selectedTileX / scope.renderManager.mapModel.getTileWidth(),
          10
        )

        selectedTileY = scope.mouseY + scope.renderManager.camera.getY()
        selectedTileY = parseInt(
          selectedTileY / scope.renderManager.mapModel.getTileHeight(),
          10
        )

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
        selectedTileX = scope.mouseX + scope.renderManager.camera.getX()
        selectedTileX = parseInt(
          selectedTileX / scope.renderManager.mapModel.getTileWidth(),
          10
        )

        selectedTileY = scope.mouseY + scope.renderManager.camera.getY()
        selectedTileY = parseInt(
          selectedTileY / scope.renderManager.mapModel.getTileHeight(),
          10
        )

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
        selectedTileX = scope.mouseX + scope.renderManager.camera.getX()
        selectedTileX = parseInt(
          selectedTileX / scope.renderManager.mapModel.getTileWidth(),
          10
        )

        selectedTileY = scope.mouseY + scope.renderManager.camera.getY()
        selectedTileY = parseInt(
          selectedTileY / scope.renderManager.mapModel.getTileHeight(),
          10
        )

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
        // identify world (map) co-ordinates by converting mouse co-ordinates
        selectedTileX = scope.mouseX + scope.renderManager.camera.getX()
        selectedTileX = parseInt(
          selectedTileX / scope.renderManager.mapModel.getTileWidth(),
          10
        )

        selectedTileY = scope.mouseY + scope.renderManager.camera.getY()
        selectedTileY = parseInt(
          selectedTileY / scope.renderManager.mapModel.getTileHeight(),
          10
        )

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
      scope.areaSelectX = event.pageX - $('#editorCanvas').offset().left
      scope.areaSelectY = event.pageY - $('#editorCanvas').offset().top
      scope.mouseX = event.pageX - $('#editorCanvas').offset().left
      scope.mouseY = event.pageY - $('#editorCanvas').offset().top
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
        $('#editorCanvas').offset().left +
        scope.renderManager.mapModel.getTileWidth() / 2 +
        scope.renderManager.camera.getX() -
        (scope.selectedAreaTiles.rows[0].length *
          scope.renderManager.mapModel.getTileWidth()) /
          2
      startTileY =
        event.pageY -
        $('#editorCanvas').offset().top +
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
  PaletteCanvas_Click(event) {
    'use strict'

    scope.renderManager.getPickerTileCode(
      parseInt(event.pageX - $('#paletteCanvas').offset().left, 10),
      parseInt(event.pageY - $('#paletteCanvas').offset().top, 10)
    )
  }
  CreateItem_Click() {
    'use strict'
    scope.PresentRibbonContextMenu('create')
    // centre the create dialog
    $('#createDialog').css(
      'top',
      $('#leftBar').height() / 2 - $('#createDialog').height() / 2 + 'px'
    )
    $('#createDialog').show()
    $('.modalBlocker').show()
    $('#createProjectOptions').hide()
    $('#createExistingProjectName').val(-1)

    // show/hide each step, default to showing step one
    $('#createDialogStepOne').show()
    $('#createDialogStepTwo').hide()

    //refresh validation
    $('#createNewMapName').removeClass('errorBorder')
    $('#createNewProjectName').removeClass('errorBorder')
    $('#createNewProjectDescription').removeClass('errorBorder')
    $('#createExistingProjectName').removeClass('errorBorder')
  }
  CreateButtonOK_Click() {
    'use strict'
    var valid, result

    valid = true

    $('#inpCreateHorizontalTiles').removeClass('errorBorder')
    $('#inpCreateVerticalTiles').removeClass('errorBorder')
    $('#inpCreateTileWidth').removeClass('errorBorder')
    $('#inpCreateTileHeight').removeClass('errorBorder')

    // tiles accross
    result = ValidationHelper.validateInput($('#inpCreateHorizontalTiles'), [
      { kind: 'required' },
      { kind: 'isnumeric' },
      { kind: 'min', value: 1 },
    ])

    if (result.length > 0) {
      $('#inpCreateHorizontalTiles').addClass('errorBorder')
      valid = false
    }

    // tiles down
    result = ValidationHelper.validateInput($('#inpCreateVerticalTiles'), [
      { kind: 'required' },
      { kind: 'isnumeric' },
      { kind: 'min', value: 1 },
    ])

    if (result.length > 0) {
      $('#inpCreateVerticalTiles').addClass('errorBorder')
      valid = false
    }

    if (
      parseInt($('#inpCreateHorizontalTiles').val(), 10) *
        parseInt($('#inpCreateVerticalTiles').val(), 10) >
      16384
    ) {
      scope.DisplayNotification(
        'Tiles per layer must not exceed 16384 (e.g 128x128 or 512x32 etc)',
        'red'
      )
      valid = false
    }

    // tile width
    //result = ValidationHelper.validateInput($('#inpCreateTileWidth'),
    //  [{ kind: 'required' },
    //  { kind: 'isnumeric' },
    //  { kind: 'min', value: 1 }]);

    //if (result.length > 0) {
    //    $('#inpCreateTileWidth').addClass('errorBorder');
    //    valid = false;
    //}
    // tile height
    //result = ValidationHelper.validateInput($('#inpCreateTileHeight'),
    // [{ kind: 'required' },
    // { kind: 'isnumeric' },
    // { kind: 'min', value: 1 }]);

    //if (result.length > 0) {
    //    $('#inpCreateTileHeight').addClass('errorBorder');
    //    valid = false;
    //}

    // if after all of that, the user entered the correct data
    if (valid) {
      // proceed to creating their new map object
      $('#createDialog').hide()
      $('.modalBlocker').hide()

      mapModel.set(new Map(scope))
      //scope.renderManager.mapModel.createBlankModel($('#createNewMapName').val(),
      //    parseInt($('#inpCreateTileWidth').val(), 10),
      //    parseInt($('#inpCreateTileHeight').val(), 10),
      //    parseInt($('#inpCreateHorizontalTiles').val(), 10),
      //    parseInt($('#inpCreateVerticalTiles').val(), 10));

      scope.renderManager.mapModel.createBlankModel(
        $('#createNewMapName').val(),
        parseInt(32, 10),
        parseInt(32, 10),
        parseInt($('#inpCreateHorizontalTiles').val(), 10),
        parseInt($('#inpCreateVerticalTiles').val(), 10)
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
        $('#editorCanvas').width(),
        $('#editorCanvas').height()
      )

      // rebuild UI from model
      scope.BuildUIFromModel()
    }
  }
  PublishButtonOK_Click() {
    'use strict'
    /*$('#publishDialogStepOne').hide();
        $('#publishDialogPending').show();
        // begin serializing and sending map to server and retreiving bundle
        //scope.renderManager.mapModel.serializeCompact();
        scope.renderManager.mapModel.serialize();*/

    scope.DisplayNotification(
      'Feature not implemented in scope edition of MapWork',
      'red'
    )
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
  PostMapForDownload_Success() {
    'use strict'
    $('#publishDialogPending').hide()
    $('#publishDialogSuccess').show()
  }
  CheckDownloadTimer() {
    'use strict'
    var cookieValue
    // if the token previously specified has become a cookie, stop polling for it and let user know that download is complete

    if ($.cookie('bundleDownloadToken') !== null) {
      cookieValue = $.cookie('bundleDownloadToken').toString()
    }

    if (cookieValue === scope.downloadToken) {
      $.cookie('bundleDownloadToken', null)
      scope.downloadToken = null
      clearInterval(scope.downloadInterval)
      scope.downloadInterval = null
      scope.PostMapForDownload_Success()
    }
  }
  PublishButtonCancel_Click() {
    'use strict'
    $('#publishDialog').hide()
    $('#publishDialogStepOne').hide()
    $('.modalBlocker').hide()
  }
  PublishButtonCancelPublish_Click() {
    'use strict'
    $('#publishDialog').hide()
    $('#publishDialogStepOne').hide()
    $('.modalBlocker').hide()
  }
  PublishButtonSuccessOK_Click() {
    'use strict'
    $('#publishDialog').hide()
    $('#publishDialogSuccess').show()
    $('.modalBlocker').hide()
  }
  BuildUIFromModel() {
    'use strict'
    scope.LoadLayersFromModel()
    scope.LoadSettingsFromModel()
  }
  CreateButtonNext_Click() {
    'use strict'
    var valid, result

    valid = true

    //refresh validation
    $('#createNewMapName').removeClass('errorBorder')
    $('#createNewProjectName').removeClass('errorBorder')
    $('#createNewProjectDescription').removeClass('errorBorder')
    $('#createExistingProjectName').removeClass('errorBorder')

    // new map name
    result = ValidationHelper.validateInput($('#createNewMapName'), [
      { kind: 'required' },
      { kind: 'istext' },
    ])

    if (result.length > 0) {
      $('#createNewMapName').addClass('errorBorder')
      $('#createNewMapName').next().addClass('errorText')
      valid = false
    }

    if ($('#createExistingProjectName').val() === '-1') {
      // user hasnt selected a project, get them to
      $('#createExistingProjectName').addClass('errorBorder')
      valid = false
    } else if ($('#createExistingProjectName').val() === '0') {
      // new project name
      result = ValidationHelper.validateInput($('#createNewProjectName'), [
        { kind: 'required' },
        { kind: 'istext' },
      ])

      if (result.length > 0) {
        $('#createNewProjectName').addClass('errorBorder')
        valid = false
      }

      // new project description
      result = ValidationHelper.validateInput(
        $('#createNewProjectDescription'),
        [{ kind: 'required' }, { kind: 'istext' }]
      )

      if (result.length > 0) {
        $('#createNewProjectDescription').addClass('errorBorder')
        valid = false
      }
    }

    if (valid) {
      // go to next step, hide content of previous step
      $('#createDialogStepOne').hide()
      $('#createDialogStepTwo').show()
    }
  }
  CreateButtonCancel_Click() {
    'use strict'
    // clear form
    $('#createNewMapName').val('')
    $('#createExistingProjectName').val(-1)
    $('#createNewProjectName').val('')
    $('#createNewProjectDescription').val('')
    // hide dialog
    $('#createDialog').hide()

    // hide all stages of create dialog
    $('#createDialogStepTwo').hide()
    $('#createDialogStepOne').hide()
    $('.modalBlocker').hide()
  }
  BuildItem_Click() {
    'use strict'
    if (
      scope.renderManager.mapModel !== null &&
      scope.renderManager.mapModel !== undefined
    ) {
      scope.PresentRibbonContextMenu('build')
    }
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
  PublishItem_Click() {
    'use strict'
    if (
      scope.renderManager.mapModel !== null &&
      scope.renderManager.mapModel !== undefined
    ) {
      scope.PresentRibbonContextMenu('publish')
      // centre the create dialog
      $('#publishDialog').css(
        'top',
        $('#leftBar').height() / 2 - $('#publishDialog').height() / 2 + 'px'
      )
      $('#publishDialog').show()
      $('#publishDialogStepOne').show()
      $('#publishDialogSuccess').hide()
      $('#publishDialogError').hide()
      $('#publishDialogPending').hide()

      $('.modalBlocker').show()
    }
  }
  PaletteItem_Click() {
    'use strict'
    scope.PresentRibbonDialog('palette')
  }
  LayersItem_Click() {
    'use strict'
    scope.LoadLayersFromModel()
    scope.PresentRibbonDialog('layers')
  }
  PropertiesItem_Click() {
    'use strict'
    scope.PresentRibbonDialog('properties')
  }
  SettingsItem_Click() {
    'use strict'
    scope.LoadSettingsFromModel()
    scope.PresentRibbonDialog('settings')
  }
  PresentRibbonDialog(kind) {
    'use strict'
    $('#' + kind + 'Dialog').toggle()

    if (kind !== 'palette') {
      $('#paletteDialog').hide()
    } else {
      //// assign a tilesheet to the palette for selected layer
      scope.PalletCanvasResize()
    }

    if (kind !== 'layers') {
      $('#layersDialog').hide()
    } else {
      scope.LoadLayersFromModel()
    }

    if (kind !== 'properties') {
      $('#propertiesDialog').hide()
    } else {
      // reset property selection
      $('#selectPropertyScope').val('-1')
      $('#selectPropertyScope').trigger('change')
    }

    if (kind !== 'settings') {
      $('#settingsDialog').hide()
    } else {
      //clear error validation warnings
      $('#settingsSelectProject').removeClass('errorBorder')
      $('#settingsMapName').removeClass('errorBorder')
      $('#settingsTilesAccross').removeClass('errorBorder')
      $('#settingsTilesDown').removeClass('errorBorder')
      $('#settingsTileHeight').removeClass('errorBorder')
      $('#settingsTileWidth').removeClass('errorBorder')

      scope.LoadSettingsFromModel()
    }

    // alter size of the main canvas, based on dialog being visible or not
    if ($('#' + kind + 'Dialog').is(':visible')) {
      $('#canvasContainer').css('right', '328px')
    } else {
      $('#canvasContainer').css('right', '72px')
    }

    // do a canvas resize based on new dimensions of screen after toggle
    scope.Window_Resize()
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
    scope.DisplayNotification('Failed to retrieve tilesets from server', 'red')
  }
  LayerSelectTileset_Change(event) {
    'use strict'
    $(event.target).parent().parent().data('zPosition')
    scope.renderManager.mapModel
      .getLayerByZPosition(
        parseInt($(event.target).parent().parent().data('zPosition'), 10)
      )
      .setTilesetPath($(event.target).val())
    ;() => {
      scope.PalletCanvasResize()
    }
  }
  DisplayNotification(message, colour) {
    'use strict'
    if (colour === 'red') {
      $('#notificationBanner').addClass('redNotification')
      $('#notificationBanner').removeClass('greenNotification')
    } else if (colour === 'green') {
      $('#notificationBanner').addClass('greenNotification')
      $('#notificationBanner').removeClass('redNotification')
    }

    clearTimeout(scope.notificationTimeout)
    $('#notificationBanner').hide()
    $('#notificationBanner span').text(message)
    $('#notificationBanner').slideDown(200, function () {
      scope.notificationTimeout = setTimeout(function () {
        $('#notificationBanner').slideUp(200)
      }, 5000)
    })
  }
}
