import {Map} from './mapwork.model.map';
window.mapwork.editor.environment = {

    Init: function () {
        "use strict";

        // bind all JQuery event handlers
        this.BindEvent();

        // add custom decoration to elements
        $('.layerScroll').jScrollPane();
        $('.propertiesScroll').jScrollPane();

        // Trigger a window resize to make canvas fit into page
        this.Window_Resize();
        mapwork.editor.environment.LoadTilesetList();

    },
    BindEvent: function () {
        "use strict";

        $(window).resize(this.Window_Resize);
        $('#editorCanvas').mousedown(this.EditorCanvas_MouseDown);
        $('#editorCanvas').mouseup(this.EditorCanvas_MouseUp);
        $('#editorCanvas').mouseout(this.EditorCanvas_MouseOut);
        $('#editorCanvas').mousemove(this.EditorCanvas_MouseMove);


        $('#paletteCanvas').click(this.PaletteCanvas_Click);
        // left ribbon events
        $('#createItem').click(this.CreateItem_Click);
        $('#buildItem').click(this.BuildItem_Click);
        $('#saveItem').click(this.SaveItem_Click);
        $('#publishItem').click(this.PublishItem_Click);
        // right ribbon events (toolbox context)
        $('#paletteItem').click(this.PaletteItem_Click);
        $('#layersItem').click(this.LayersItem_Click);
        $('#propertiesItem').click(this.PropertiesItem_Click);
        $('#settingsItem').click(this.SettingsItem_Click);

        $('#createButtonNext').click(this.CreateButtonNext_Click);
        $('#createButtonOK').click(this.CreateButtonOK_Click);
        $('#createButtonCancel').click(this.CreateButtonCancel_Click);
        $('#createButtonCancelTwo').click(this.CreateButtonCancel_Click);

        $('#publishButtonOK').click(this.PublishButtonOK_Click);
        $('#publishButtonCancel').click(this.PublishButtonCancel_Click);
        $('#publishButtonCancelPublish').click(this.PublishButtonCancelPublish_Click);
        $('#publishButtonSuccessOK').click(this.PublishButtonSuccessOK_Click);


        //toolbox items
        $('#toolboxItemAreaselect').click(this.ToolboxItemAreaselect_Click);
        $('#toolboxItemInspect').click(this.ToolboxItemInspect_Click);
        $('#toolboxItemBrush').click(this.ToolboxItemBrush_Click);
        $('#toolboxItemBucket').click(this.ToolboxItemBucket_Click);
        $('#toolboxItemEraser').click(this.ToolboxItemEraser_Click);

        //change events for dialogs
        $('#createExistingProjectName').change(this.CreateExistingProjectName_Change);

        //layer selection click event (accounts for appended list elements)
        $("#layerList").on("click", '.layerListItemDescription', this.LayerListItemDescription_Click);
        $("#layerList").on("click", '.renameLayer', this.RenameLayer_Click);
        $("#layerList").on("click", '.toggleLayerVisibility', this.ToggleLayerVisibility_Click);
        $("#layerList").on("click", '.deleteLayer', this.DeleteLayer_Click);


        $("#layerList").on("change", '.layerSelectTileset ', this.LayerSelectTileset_Change);


        $('#layerCreateNewLayer').click(this.LayerCreateNewLayer_Click);
        $('#layerMoveUp').click(this.LayerMoveUp_Click);
        $('#layerMoveDown').click(this.LayerMoveDown_Click);
        $('#propertyTable').on('blur', '.propertiesInput', this.PropertiesInput_Blur);

        //binders for map properties section
        $('#selectPropertyScope').change(this.SelectPropertyScope_Change);
        $('#selectLayerScope').change(this.SelectLayerScope_Change);

        // settings menu binders
        $('#settingsToggleGrid').click(this.SettingsToggleGrid_Change);
        $('#settingsSaveChanges').click(this.SettingsSaveChanges_Click);

        // navigation key handlers
        $(window).keydown(this.Editor_KeyDown);
        $(window).keyup(this.Editor_KeyUp);
    },
    Editor_KeyDown: function (event) {
        "use strict";
        //move the camera around the map with given directional arrow key
        if (mapwork.viewcontroller.camera) {
            event = event || window.event;
            if (window.opera && !mapwork.editor.environment.arrowKeyDown) {
                switch (event.keyCode) {
                    case 37: mapwork.editor.environment.editorMoveInterval = setInterval(mapwork.viewcontroller.camera.move("left", 16), 10); mapwork.editor.environment.arrowKeyDown = true; break;
                    case 39: mapwork.editor.environment.editorMoveInterval = setInterval(mapwork.viewcontroller.camera.move("right", 16), 10); mapwork.editor.environment.arrowKeyDown = true; break;
                    case 40: mapwork.editor.environment.editorMoveInterval = setInterval(mapwork.viewcontroller.camera.move("down", 16), 10); mapwork.editor.environment.arrowKeyDown = true; break;
                    case 38: mapwork.editor.environment.editorMoveInterval = setInterval(mapwork.viewcontroller.camera.move("up", 16), 10); mapwork.editor.environment.arrowKeyDown = true; break;
                    default: break;
                }
            }
            else {
                switch (event.keyCode) {
                    case 37: mapwork.viewcontroller.camera.move("left", 16); break;
                    case 39: mapwork.viewcontroller.camera.move("right", 16); break;
                    case 40: mapwork.viewcontroller.camera.move("down", 16); break;
                    case 38: mapwork.viewcontroller.camera.move("up", 16); break;
                }
            }

            if (mapwork.editor.environment.selectedTool === 'pasteTiles') {
                if (event.keyCode === 27) {
                    mapwork.editor.environment.selectedAreaTiles = null;
                    mapwork.editor.environment.selectedTool = 'areaSelect';
                }
            }

        }
    },
    Editor_KeyUp: function (event) {
        "use strict";
        // resolve repeating keys issue in opera
        if (window.opera) {
            clearInterval(mapwork.editor.environment.editorMoveInterval);
            mapwork.editor.environment.arrowKeyDown = false;
            mapwork.editor.environment.editorMoveInterval = null;
        }
    },
    SettingsToggleGrid_Change: function (event) {
        "use strict";
        if ($('#settingsToggleGrid:checked').length > 0) {
            mapwork.editor.environment.gridEnabled = true;
        }
        else {
            mapwork.editor.environment.gridEnabled = false;
        }
        //user toggles on-screen grid
    },
    SettingsSaveChanges_Click: function (event) {
        "use strict";
        var result, valid;
        valid = true;

        // remove error borders pre-validation
        $('#settingsSelectProject').removeClass('errorBorder');
        $('#settingsMapName').removeClass('errorBorder');
        $('#settingsTilesAccross').removeClass('errorBorder');
        $('#settingsTilesDown').removeClass('errorBorder');
        $('#settingsTileHeight').removeClass('errorBorder');
        $('#settingsTileWidth').removeClass('errorBorder');


        // validate each field an add error borders where appropriate

        result = mapwork.helper.validation.ValidateInput($('#settingsMapName'),
                 [{ kind: 'required' },
                { kind: 'istext' }]);

        if (result.length > 0) {
            $('#settingsMapName').addClass('errorBorder');
            valid = false;
        }

        result = mapwork.helper.validation.ValidateInput($('#settingsTilesAccross'),
            [{ kind: 'required' },
                { kind: 'isnumeric' },
                { kind: 'min', value: 1 }]);

        if (result.length > 0) {
            $('#settingsTilesAccross').addClass('errorBorder');
            valid = false;

        }
        result = mapwork.helper.validation.ValidateInput($('#settingsTilesDown'),
           [{ kind: 'required' },
               { kind: 'isnumeric' },
               { kind: 'min', value: 1 }]);

        if (result.length > 0) {
            $('#settingsTilesDown').addClass('errorBorder');
            valid = false;
        }
        //result = mapwork.helper.validation.ValidateInput($('#settingsTileWidth'),
        //    [{ kind: 'required' },
        //        { kind: 'isnumeric' },
        //        { kind: 'min', value: 1 }]);

        //if (result.length > 0) {
        //    $('#settingsTileWidth').addClass('errorBorder');
        //    valid = false;
        //}
        //result = mapwork.helper.validation.ValidateInput($('#settingsTileHeight'),
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

        if ((parseInt($('#settingsTilesAccross').val(), 10) * parseInt($('#settingsTilesDown').val(), 10)) > 16384) {
            mapwork.editor.environment.DisplayNotification('Tiles per layer must not exceed 16384 (e.g 128x128 or 512x32 etc)', 'red');
            valid = false;
        }


        if (valid) {
            //check if any changes have occured
            if ($('#settingsMapName').val() !== mapwork.viewcontroller.mapModel.getName()) {
                // update the model
                mapwork.viewcontroller.mapModel.setName($('#settingsMapName').val());
            }
            //check if any changes have occured
            if ($('#settingsTilesAccross').val() !== mapwork.viewcontroller.mapModel.getTilesAccross()) {
                // update the model
                mapwork.viewcontroller.renderFlag = false;
                mapwork.viewcontroller.mapModel.resizeMap({ tilesAccross: $('#settingsTilesAccross').val() });
                //update the camera
                mapwork.viewcontroller.camera.setBounds(mapwork.viewcontroller.mapModel.getWorldWidth(), mapwork.viewcontroller.mapModel.getWorldHeight());
                //mapwork.viewcontroller.camera.setSize(mapwork.viewcontroller.camera.getWidth(), mapwork.viewcontroller.camera.getHeight());
                mapwork.viewcontroller.camera.setSize($('#editorCanvas').width(), $('#editorCanvas').height());
                mapwork.viewcontroller.camera.setPosition(mapwork.viewcontroller.camera.getX(), mapwork.viewcontroller.camera.getY());

                mapwork.viewcontroller.renderFlag = true;
            }
            //check if any changes have occured
            if ($('#settingsTilesDown').val() !== mapwork.viewcontroller.mapModel.getTilesDown()) {
                // update the model
                mapwork.viewcontroller.renderFlag = false;
                mapwork.viewcontroller.mapModel.resizeMap({ tilesDown: $('#settingsTilesDown').val() });
                mapwork.viewcontroller.camera.setBounds(mapwork.viewcontroller.mapModel.getWorldWidth(), mapwork.viewcontroller.mapModel.getWorldHeight());
                mapwork.viewcontroller.camera.setSize($('#editorCanvas').width(), $('#editorCanvas').height());
                mapwork.viewcontroller.camera.setPosition(mapwork.viewcontroller.camera.getX(), mapwork.viewcontroller.camera.getY());

                mapwork.viewcontroller.renderFlag = true;

            }
            ////check if any changes have occured
            //if ($('#settingsTileWidth').val() !== mapwork.viewcontroller.mapModel.getTileWidth()) {
            //    // update the model
            //    mapwork.viewcontroller.renderFlag = false;
            //    mapwork.viewcontroller.mapModel.setTileWidth($('#settingsTileWidth').val());

            //    mapwork.viewcontroller.camera.setBounds(mapwork.viewcontroller.mapModel.getWorldWidth(), mapwork.viewcontroller.mapModel.getWorldHeight());
            //    mapwork.viewcontroller.camera.setSize($('#editorCanvas').width(), $('#editorCanvas').height());
            //    mapwork.viewcontroller.camera.setPosition(mapwork.viewcontroller.camera.getX(), mapwork.viewcontroller.camera.getY());
            //    mapwork.viewcontroller.renderFlag = true;
            //}
            ////check if any changes have occured
            //if ($('#settingsTileHeight').val() !== mapwork.viewcontroller.mapModel.getTileHeight()) {
            //    // update the model
            //    mapwork.viewcontroller.renderFlag = false;
            //    mapwork.viewcontroller.mapModel.setTileHeight($('#settingsTileHeight').val());
            //    mapwork.viewcontroller.camera.setBounds(mapwork.viewcontroller.mapModel.getWorldWidth(), mapwork.viewcontroller.mapModel.getWorldHeight());
            //    mapwork.viewcontroller.camera.setSize($('#editorCanvas').width(), $('#editorCanvas').height());
            //    mapwork.viewcontroller.camera.setPosition(mapwork.viewcontroller.camera.getX(), mapwork.viewcontroller.camera.getY());
            //    mapwork.viewcontroller.renderFlag = true;
            //}
            mapwork.editor.environment.DisplayNotification('Changes Saved', 'green');

        }
    },
    PropertiesInput_Blur: function (event) {
        "use strict";
        var scopeValue, layerValue, tileValue, html, properties, x, y;

        scopeValue = parseInt($('#selectPropertyScope').val(), 10);
        layerValue = parseInt($('#selectLayerScope').val(), 10);

        if (scopeValue === 0) {
            properties = mapwork.viewcontroller.mapModel;
        }
        else if (scopeValue === 1) {
            properties = mapwork.viewcontroller.mapModel.getLayer(layerValue);
        }
        else if (scopeValue === 2) {
            properties = mapwork.editor.environment.selectedTile;
        }


        if ($(this).parent().parent().hasClass('lastRow')) {
            // last row gets appended if user addes something to previous last row, otherwise, row stays the same
            if ($(this).parent().parent().children().find('.propertyKey').val() !== '') {
                // add the property to the model

                $(this).parent().parent().data('key', $(this).parent().parent().children().find('.propertyKey').val());
                $(this).parent().parent().data('value', $(this).parent().parent().children().find('.propertyValue').val());

                properties.addProperty({
                    key: $(this).parent().parent().children().find('.propertyKey').val(),
                    value: $(this).parent().parent().children().find('.propertyValue').val()
                });


                // remove the 'last row class'
                $(this).parent().parent().removeClass('lastRow');
                html = ' <div class="tableRow border lastRow">' +
                          '<div class="tableCell border">' +
                            '<input type="text"   class="noPadding propertyKey propertiesInput" />' +
                          '</div>' +
                        '<div class="tableCell border">' +
                          '<input type="text"  class="noPadding propertyValue propertiesInput" />' +
                       ' </div>';

                $(html).insertAfter($(this).parent().parent());
                mapwork.editor.environment.RefreshScrollpane('propertiesScroll');
            }
        }
        else {
            // this isnt the bottom row, but does need to be removed from the DOM
            if ($(this).parent().parent().children().find('.propertyKey').val() === '') {

                properties.removeProperty($(this).parent().parent().data('key'));
                $(this).parent().parent().remove();
                mapwork.editor.environment.RefreshScrollpane('propertiesScroll');
            }
            else {
                // property exists, lets modify it
                properties.setProperty({
                    oldKey: $(this).parent().parent().data('key'),
                    newKey: $(this).parent().parent().children().find('.propertyKey').val(),
                    newValue: $(this).parent().parent().children().find('.propertyValue').val()
                });
            }
        }

    },
    SelectLayerScope_Change: function (event) {
        "use strict";

        var inputValue, scopeValue, propertyCount, layerProperties, html;

        scopeValue = parseInt($('#selectPropertyScope').val(), 10);
        inputValue = parseInt($(this).val(), 10);

        if (inputValue === -1) {
            $('#propertiesInspectTile').off('click', mapwork.editor.environment.PropertiesInspectTile_Click);
        }
        else {
            if (scopeValue === 2) {
                //Tile-level scope
                $('#propertiesInspectTile').on('click', mapwork.editor.environment.PropertiesInspectTile_Click);
            }
            else if (scopeValue === 1) {
                mapwork.editor.environment.BuildPropertyTable('layer');
                $('#propertyTable').show();

            }
        }
    },
    BuildPropertyTable: function (scope) {
        "use strict";
        var properties, html, propertyCount, inputValue;

        // empty existing table contents
        $('#propertyTable').empty();

        // add heading
        html = '<div class="tableRow border">';
        html += '<div class="tableCell border">';
        html += '<span class="textCentered">Property</span>';
        html += '</div>';
        html += '<div class="tableCell border">';
        html += '<span class="textCentered">Value</span>';
        html += '</div>';

        $('#propertyTable').append(html);

        // add property data
        if (scope === 'map') {
            properties = mapwork.viewcontroller.mapModel.getAllProperties();

        }
        else if (scope === 'layer') {
            inputValue = parseInt($('#selectLayerScope').val(), 10);
            properties = mapwork.viewcontroller.mapModel.getLayer(inputValue).getAllProperties();
            //add properties from the model
        }
        else if (scope === 'tile') {
            properties = mapwork.editor.environment.selectedTile.getAllProperties();
        }

        for (propertyCount = 0; propertyCount < properties.length; propertyCount++) {
            html = '<div class ="tableRow border">';
            html += '<div class="tableCell border">';
            html += '<input type="text" value="' + properties[propertyCount].key + '" class="noPadding propertyKey propertiesInput" />';
            html += '</div>';
            html += '<div class="tableCell border">';
            html += '<input type="text" value="' + properties[propertyCount].value + '" class="noPadding propertyValue propertiesInput" />';
            html += '</div>';
            html += '</div>';
            html = $(html);
            $(html).data('key', properties[propertyCount].key);
            $(html).data('value', properties[propertyCount].value);

            $('#propertyTable').append(html);
        }
        // a final row for enterting a new property
        html = '<div class ="tableRow border lastRow">';
        html += '<div class="tableCell border">';
        html += '<input type="text" value="' + '" class="noPadding propertyKey propertiesInput" />';
        html += '</div>';
        html += '<div class="tableCell border">';
        html += '<input type="text" value="' + '" class="noPadding propertyValue propertiesInput" />';
        html += '</div>';
        html += '</div>';
        $('#propertyTable').append(html);


    },
    SelectPropertyScope_Change: function (event) {
        "use strict";

        var inputValue, html, layerCount;
        inputValue = parseInt($(this).val(), 10);

        $('#propertyTable').empty();

        // add heading to property table
        html = '<div class="tableRow border">';
        html += '<div class="tableCell border">';
        html += '<span class="textCentered">Property</span>';
        html += '</div>';
        html += '<div class="tableCell border">';
        html += '<span class="textCentered">Value</span>';
        html += '</div>';

        $('#propertyTable').append(html);
        html = '';

        // set layer scope dropdown to default again
        $('#selectLayerScope').val('-1');
        $('#propertiesInspectTile').off('click', mapwork.editor.environment.PropertiesInspectTile_Click);

        switch (inputValue) {
            case 0: $('#selectLayerScope').attr('disabled', true); break;
            case 1: $('#selectLayerScope').attr('disabled', false); break;
            case 2: $('#selectLayerScope').attr('disabled', true); break;
            case -1: $('#selectLayerScope').attr('disabled', true); break;
            default: break;
        }
        // map-level logic
        if (inputValue === 0) {
            mapwork.editor.environment.BuildPropertyTable('map');
            $('#propertyTable').show();
        }
        else if (inputValue === -1) {
            $('#propertyTable').empty();
            $('#propertyTable').hide();
        }
        else if (inputValue === 2) {
            $('#propertiesInspectTile').on('click', mapwork.editor.environment.PropertiesInspectTile_Click);
            $('#propertyTable').show();
        }
        if ($('#selectLayerScope').attr('disabled') !== 'disabled') {
            // populate the list with layer data from the model
            $('#selectLayerScope').empty();
            html = '<option value="-1">--Select Layer--</option>';
            $('#selectLayerScope').append(html);
            for (layerCount = 0; layerCount < mapwork.viewcontroller.mapModel.getLayers().length; layerCount++) {
                html = '<option value="' + layerCount + '"> ' + mapwork.viewcontroller.mapModel.getLayer(layerCount).getName() + ' </option>';
                $('#selectLayerScope').append(html);
            }
        }


    },
    PropertiesInspectTile_Click: function (event) {
        "use strict";
        mapwork.editor.environment.selectedTool = 'inspectTile';
    },
    ToggleLayerVisibility_Click: function (event) {
        "use strict";

        // code for changing the sprite from/to visible or hidden
        if ($(this).hasClass('layerVisibilityIconVisible')) {
            $(this).removeClass('layerVisibilityIconVisible');
            $(this).addClass('layerVisibilityIconHidden');
            mapwork.viewcontroller.mapModel.getLayerByZPosition($(this).parent().parent().data('zPosition')).setVisibility(false);
        }
        else {
            $(this).addClass('layerVisibilityIconVisible');
            $(this).removeClass('layerVisibilityIconHidden');
            mapwork.viewcontroller.mapModel.getLayerByZPosition($(this).parent().parent().data('zPosition')).setVisibility(true);
        }
    },
    RenameLayer_Click: function (event) {
        "use strict";
        var result;
        // dummy code for renaming a layer
        $(this).parent().parent().find('.layerNameInput').removeClass('errorBorder');

        if ($(this).parent().parent().find('.layerNameInput').is(':visible')) {
            // validate selection
            result = mapwork.helper.validation.ValidateInput($(this).parent().parent().find('.layerNameInput'),
             [{ kind: 'required' },
             { kind: 'istext' }]);

            if (result.length < 1) {
                $(this).parent().parent().find('.layerName').show();
                $(this).parent().parent().find('.layerNameInput').hide();
                $(this).parent().parent().find('.layerName').first().text($(this).parent().parent().find('.layerNameInput').val());
                mapwork.viewcontroller.mapModel.getLayer($(this).parent().parent().data('zPosition'))
                    .setName($(this).parent().parent().find('.layerNameInput').val());
            }
            else {
                $(this).parent().parent().find('.layerNameInput').addClass('errorBorder');
            }

        }
        else {
            $(this).parent().parent().find('.layerName').hide();
            $(this).parent().parent().find('.layerNameInput').val($(this).parent().parent().find('.layerName').text());
            $(this).parent().parent().find('.layerNameInput').show();
        }

        mapwork.editor.environment.RefreshScrollpane('layerScroll');
    },
    DeleteLayer_Click: function (event) {
        "use strict";
        var layerCount;
        // code for physically removing the layer element from the DOM
        mapwork.viewcontroller.mapModel.removeLayer($(this).parent().parent().data('zPosition'));

        // if layer is selected layer, remove selected layer
        mapwork.editor.environment.selectedLayer = null;
        // re-order array
        for (layerCount = 0; layerCount < mapwork.viewcontroller.mapModel.getLayers().length; layerCount++) {
            mapwork.viewcontroller.mapModel.getLayer(layerCount).setZPosition(layerCount);
        }
        mapwork.editor.environment.RefreshScrollpane('layerScroll');
        // rebuild the View
        mapwork.editor.environment.LoadLayersFromModel();
    },
    RefreshScrollpane: function (element) {
        "use strict";

        var pane, api;

        pane = $($('.' + element));
        api = pane.data('jsp');
        api.reinitialise();
    },
    LayerCreateNewLayer_Click: function (event) {
        "use strict";

        var html, layerName, newLayer;

        if (mapwork.viewcontroller.mapModel.getLayers().length < 5) {
            //create new layer
            layerName = 'Untitled Layer ' + mapwork.viewcontroller.mapModel.getLayers().length;

            // adding the new layer to the model
            newLayer = new mapwork.model.Layer();
            newLayer.createBlankModelLayer(mapwork.viewcontroller.mapModel, layerName, 'default_tileset.png');
            newLayer.setZPosition(mapwork.viewcontroller.mapModel.getLayers().length);
            mapwork.editor.environment.selectedLayer = mapwork.viewcontroller.mapModel.getLayers().length;
            mapwork.viewcontroller.mapModel.addLayer(newLayer);

            // refresh layers view
            mapwork.editor.environment.LoadLayersFromModel();
            //refresh the scrollpane
            mapwork.editor.environment.RefreshScrollpane('layerScroll');
        }
        else {
            mapwork.editor.environment.DisplayNotification('A map may only have up to 5 layers', 'red');
        }



    },
    LoadPropertiesFromModel: function () {
        "use strict";
        if ($('#selectPropertyScope').val() === '2') {
            mapwork.editor.environment.BuildPropertyTable('tile');
        }
    },
    LoadSettingsFromModel: function () {
        "use strict";
        $('#settingsMapName').val(mapwork.viewcontroller.mapModel.getName());
        $('#settingsTilesAccross').val(mapwork.viewcontroller.mapModel.getTilesAccross());
        $('#settingsTilesDown').val(mapwork.viewcontroller.mapModel.getTilesDown());
        $('#settingsTileWidth').val(mapwork.viewcontroller.mapModel.getTileWidth());
        $('#settingsTileHeight').val(mapwork.viewcontroller.mapModel.getTileHeight());
    },
    LoadLayersFromModel: function () {
        "use strict";
        var layerCount, html, layerName, visible, tilesetSelect, tileset, tilesetCount;

        //update list of layers with contents of model, starting with emptying previous contents
        $('#layerList').empty();

        for (layerCount = 0; layerCount < mapwork.viewcontroller.mapModel.getLayers().length; layerCount++) {
            tileset = mapwork.viewcontroller.mapModel.getLayer(layerCount).getTilesetPath();
            layerName = mapwork.viewcontroller.mapModel.getLayer(layerCount).getName();
            visible = mapwork.viewcontroller.mapModel.getLayer(layerCount).getVisibility();
            html = $('<li class="layerListItem layerUnselected">' +
                  '<div class="layerListItemDescription">' +
                     '<span class="layerName">' + layerName + '</span>' +
                      '<input type="text" class="layerNameInput">' + '</input>' +
                      '<select class="layerSelectTileset noPadding marT-10"> </select>' +
                  '</div>' +
                  '<div class="layerListItemActions">' +
                     '<a class="renameLayer"></a>' +
                     '<a class="toggleLayerVisibility ' + (visible ? 'layerVisibilityIconVisible' : 'layerVisibilityIconHidden') + '"></a>' +
                     '<a class="deleteLayer"></a>' +
                  '</div>' +
              '</li>');
            $(html).data('zPosition', mapwork.viewcontroller.mapModel.getLayer(layerCount).getZPosition());

            // append tileset data to the selected list element
            tilesetSelect = $(html).find('.layerSelectTileset');

            if (mapwork.editor.environment.tilesets !== null) {
                for (tilesetCount = 0; tilesetCount < mapwork.editor.environment.tilesets.length; tilesetCount++) {
                    tilesetSelect.append('<option value=' + mapwork.editor.environment.tilesets[tilesetCount] + '>' + mapwork.editor.environment.tilesets[tilesetCount] + '</option>');
                }
            }
            tilesetSelect.val(tileset);

            // check whether layer was previously selected and which layer was
            if ($(html).data('zPosition') === mapwork.editor.environment.selectedLayer) {
                $(html).removeClass('layerUnselected');
                $(html).addClass('layerSelected');
            }
            $('#layerList').prepend(html);


        }
    },
    LayerMoveUp_Click: function (event) {
        "use strict";

        var target;
        target = $('#layerList').find('.layerSelected').prev();
        if (target.length > 0) {
            // move list element up above preceeding list element
            mapwork.viewcontroller.mapModel.swapLayers($(target).data('zPosition'), $(target).next().data('zPosition'));
            mapwork.editor.environment.selectedLayer = $(target).data('zPosition');
            mapwork.editor.environment.LoadLayersFromModel();
            mapwork.editor.environment.RefreshScrollpane('layerScroll');
        }
    },
    LayerMoveDown_Click: function (event) {
        "use strict";

        var target;
        target = $('#layerList').find('.layerSelected').next();
        if (target.length > 0) {
            // move the layer down after next element in list
            mapwork.viewcontroller.mapModel.swapLayers($(target).data('zPosition'), $(target).prev().data('zPosition'));
            mapwork.editor.environment.selectedLayer = $(target).data('zPosition');
            mapwork.editor.environment.LoadLayersFromModel();
            mapwork.editor.environment.RefreshScrollpane('layerScroll');
        }
    },
    LayerListItemDescription_Click: function (event) {
        "use strict";


        // remove the highlighter for all unselected layers
        $('.layerListItem').each(function (index, element) {
            $(element).removeClass('layerSelected');
            $(element).addClass('layerUnselected');
        });
        // add a highlighter to the selected element

        $(this).parent().addClass('layerSelected');
        $(this).parent().removeClass('layerUnselected');
        mapwork.editor.environment.selectedLayer = $(this).parent().data('zPosition');
        mapwork.editor.environment.selectedPalleteTile = 0;
    },
    CreateExistingProjectName_Change: function (event) {
        "use strict";

        if ($(this).val() === '0') {
            $('#createProjectOptions').show();
        }
        else {
            $('#createProjectOptions').hide();
        }
    },
    ToolboxItemAreaselect_Click: function (event) {
        "use strict";
        mapwork.editor.environment.selectedTool = 'areaSelect';
    },
    ToolboxItemInspect_Click: function (event) {
        "use strict";
        mapwork.editor.environment.selectedTool = 'inspectTile';
    },
    ToolboxItemBrush_Click: function (event) {
        "use strict";
        mapwork.editor.environment.selectedTool = 'singleTileBrush';
    },
    ToolboxItemBucket_Click: function (event) {
        "use strict";
        mapwork.editor.environment.selectedTool = 'bucketFill';
    },
    ToolboxItemEraser_Click: function (event) {
        "use strict";
        mapwork.editor.environment.selectedTool = 'eraser';
    },
    Window_Resize: function () {
        "use strict";
        //let's resize the canvas to the size of the window space
        document.getElementById('editorCanvas').width = $('#canvasContainer').width();
        document.getElementById('editorCanvas').height = $('#canvasContainer').height();

        //resize the tile palette based on the size of the screen
        $('#paletteCanvasContainer').css('top', ($('#paletteInfo').height().toString() + "px"));
        document.getElementById('paletteCanvas').width = $('#paletteCanvasContainer').width();
        //document.getElementById('paletteCanvas').height = $('#paletteCanvasContainer').height();

        // reposition dialogs
        $('#createDialog').css('top', ((($('#leftBar').height() / 2) - $('#createDialog').height() / 2) + "px"));
        $('#publishDialog').css('top', ((($('#leftBar').height() / 2) - $('#publishDialog').height() / 2) + "px"));

        //inform viewcontroller of update
        if (mapwork.viewcontroller.camera) {
            mapwork.viewcontroller.camera.setSize($('#editorCanvas').width(), $('#editorCanvas').height());
            mapwork.viewcontroller.camera.setPosition(mapwork.viewcontroller.camera.getX(), mapwork.viewcontroller.camera.getY());
        }

        // refresh all scrollbars
        mapwork.editor.environment.RefreshScrollpane('layerScroll');
        mapwork.editor.environment.RefreshScrollpane('propertiesScroll');
    },
    ModifyTile: function () {
        "use strict";
        var selectedTileX, selectedTileY, queue, currTile, selectedTileType;


        if (mapwork.editor.environment.selectedTool === 'singleTileBrush') {

            if (mapwork.editor.environment.selectedLayer !== null) {
                selectedTileX = (mapwork.editor.environment.mouseX) + mapwork.viewcontroller.camera.getX();
                selectedTileX = parseInt(selectedTileX / mapwork.viewcontroller.mapModel.getTileWidth(), 10);

                selectedTileY = (mapwork.editor.environment.mouseY) + mapwork.viewcontroller.camera.getY();
                selectedTileY = parseInt(selectedTileY / mapwork.viewcontroller.mapModel.getTileHeight(), 10);

                if ((selectedTileX < mapwork.viewcontroller.mapModel.getTilesAccross()) && (selectedTileY < mapwork.viewcontroller.mapModel.getTilesDown())) {

                    if (mapwork.viewcontroller.mapModel.getTile(mapwork.editor.environment.selectedLayer, selectedTileX, selectedTileY).getTileCode() != mapwork.editor.environment.selectedPalleteTile) {
                        mapwork.viewcontroller.mapModel.modifyTile(mapwork.editor.environment.selectedLayer, selectedTileX, selectedTileY, [{ key: 'tileCode', value: mapwork.editor.environment.selectedPalleteTile }]);
                        mapwork.editor.changes.PushChange({ verb: 'PaintSingleTile', x: selectedTileX, y: selectedTileY, z: mapwork.editor.environment.selectedLayer, tileCode: mapwork.editor.environment.selectedPalleteTile });
                    }


                }
            }

        }
        else if (mapwork.editor.environment.selectedTool === 'eraser') {

            if (mapwork.editor.environment.selectedLayer !== null) {
                selectedTileX = (mapwork.editor.environment.mouseX) + mapwork.viewcontroller.camera.getX();
                selectedTileX = parseInt(selectedTileX / mapwork.viewcontroller.mapModel.getTileWidth(), 10);

                selectedTileY = (mapwork.editor.environment.mouseY) + mapwork.viewcontroller.camera.getY();
                selectedTileY = parseInt(selectedTileY / mapwork.viewcontroller.mapModel.getTileHeight(), 10);

                if ((selectedTileX < mapwork.viewcontroller.mapModel.getTilesAccross()) && (selectedTileY < mapwork.viewcontroller.mapModel.getTilesDown())) {
                    if (mapwork.viewcontroller.mapModel.getTile(mapwork.editor.environment.selectedLayer, selectedTileX, selectedTileY).getTileCode() != -1) {
                        mapwork.viewcontroller.mapModel.modifyTile(mapwork.editor.environment.selectedLayer, selectedTileX, selectedTileY, [{ key: 'tileCode', value: -1 }]);
                        mapwork.editor.changes.PushChange({ verb: 'EraseSingleTile', x: selectedTileX, y: selectedTileY, z: mapwork.editor.environment.selectedLayer, tileCode: mapwork.editor.environment.selectedPalleteTile });
                    }
                }
            }

        }
        else if (mapwork.editor.environment.selectedTool === 'inspectTile') {


            if (mapwork.editor.environment.selectedLayer !== null) {
                selectedTileX = (mapwork.editor.environment.mouseX) + mapwork.viewcontroller.camera.getX();
                selectedTileX = parseInt(selectedTileX / mapwork.viewcontroller.mapModel.getTileWidth(), 10);

                selectedTileY = (mapwork.editor.environment.mouseY) + mapwork.viewcontroller.camera.getY();
                selectedTileY = parseInt(selectedTileY / mapwork.viewcontroller.mapModel.getTileHeight(), 10);


                if ((selectedTileX < mapwork.viewcontroller.mapModel.getTilesAccross()) && (selectedTileY < mapwork.viewcontroller.mapModel.getTilesDown())) {
                    mapwork.editor.environment.selectedTile = mapwork.viewcontroller.mapModel.getLayerByZPosition(mapwork.editor.environment.selectedLayer).getRow(selectedTileY)[selectedTileX];
                    mapwork.editor.environment.LoadPropertiesFromModel();
                }
            }
        }
        else if (mapwork.editor.environment.selectedTool === 'bucketFill') {

            if (mapwork.editor.environment.selectedLayer !== null) {
                // identify world (map) co-ordinates by converting mouse co-ordinates
                selectedTileX = (mapwork.editor.environment.mouseX) + mapwork.viewcontroller.camera.getX();
                selectedTileX = parseInt(selectedTileX / mapwork.viewcontroller.mapModel.getTileWidth(), 10);

                selectedTileY = (mapwork.editor.environment.mouseY) + mapwork.viewcontroller.camera.getY();
                selectedTileY = parseInt(selectedTileY / mapwork.viewcontroller.mapModel.getTileHeight(), 10);


                // queue of filled tiles (used in the 4-neighbour algorithm)
                queue = [];
                currTile = null;

                // determine the tilecode for selected tile
                selectedTileType = mapwork.viewcontroller.mapModel.getLayerByZPosition(mapwork.editor.environment.selectedLayer)
                    .getRow(selectedTileY)[selectedTileX].getTileCode();

                // if the chosen tile differs from the selected tile from the palette, begin to fill it in (and its adjacent neighbours)
                if (selectedTileType !== mapwork.editor.environment.selectedPalleteTile) {

                    mapwork.editor.changes.PushChange({ verb: 'BucketFill', x: selectedTileX, y: selectedTileY, z: mapwork.editor.environment.selectedLayer, tileCode: selectedTileType });

                    // add the processed tile to the queue
                    queue.push({
                        data: mapwork.viewcontroller.mapModel.getLayerByZPosition(mapwork.editor.environment.selectedLayer)
                            .getRow(selectedTileY)[selectedTileX], x: selectedTileX, y: selectedTileY
                    });

                    while (queue.length !== 0) {
                        // move front entry off queue
                        currTile = queue.shift();

                        if (currTile.data.getTileCode() === selectedTileType) {
                            // modify tile code to match the one selected in the palette
                            currTile.data.setTileCode(mapwork.editor.environment.selectedPalleteTile);

                            // record all neighbours (iterating through to check them also)
                            if (currTile.x > 0) {
                                queue.push({
                                    data: mapwork.viewcontroller.mapModel.getLayerByZPosition(mapwork.editor.environment.selectedLayer)
                                        .getRow(currTile.y)[currTile.x - 1], x: currTile.x - 1, y: currTile.y
                                });
                            }
                            if ((currTile.x) < (mapwork.viewcontroller.mapModel.getTilesAccross() - 1)) {
                                queue.push({
                                    data: mapwork.viewcontroller.mapModel.getLayerByZPosition(mapwork.editor.environment.selectedLayer)
                                        .getRow(currTile.y)[currTile.x + 1], x: currTile.x + 1, y: currTile.y
                                });
                            }
                            if (currTile.y > 0) {
                                queue.push({
                                    data: mapwork.viewcontroller.mapModel.getLayerByZPosition(mapwork.editor.environment.selectedLayer)
                                        .getRow(currTile.y - 1)[currTile.x], x: currTile.x, y: currTile.y - 1
                                });
                            }
                            if (currTile.y < (mapwork.viewcontroller.mapModel.getTilesDown() - 1)) {
                                queue.push({
                                    data: mapwork.viewcontroller.mapModel.getLayerByZPosition(mapwork.editor.environment.selectedLayer)
                                        .getRow(currTile.y + 1)[currTile.x], x: currTile.x, y: currTile.y + 1
                                });

                            }
                        }

                    }
                }

            }
        }




    },
    EditorCanvas_MouseMove: function (event) {
        "use strict";
        if (mapwork.viewcontroller.mapModel) {
            mapwork.editor.environment.mouseX = (event.pageX - $('#editorCanvas').offset().left);
            mapwork.editor.environment.mouseY = (event.pageY - $('#editorCanvas').offset().top);
        }

    },
    EditorCanvas_MouseDown: function (event) {
        "use strict";
        var rowCount, cellCount, currentTile, startTileX, startTileY, tilePasteX, tilePasteY;

        mapwork.editor.environment.ModifyTile();
        if (!mapwork.editor.environment.leftMouseButtonDown && mapwork.editor.environment.selectedTool === 'singleTileBrush') {
            mapwork.editor.environment.editorClickInterval = setInterval(mapwork.editor.environment.ModifyTile, 10);
            mapwork.editor.environment.leftMouseButtonDown = true;
        }
        if (!mapwork.editor.environment.leftMouseButtonDown && mapwork.editor.environment.selectedTool === 'eraser') {
            mapwork.editor.environment.editorClickInterval = setInterval(mapwork.editor.environment.ModifyTile, 10);
            mapwork.editor.environment.leftMouseButtonDown = true;
        }


        if (!mapwork.editor.environment.leftMouseButtonDown && mapwork.editor.environment.selectedTool === 'areaSelect') {
            // grab mouse co-ordinates for start point of area selection
            mapwork.editor.environment.areaSelectX = (event.pageX - $('#editorCanvas').offset().left);
            mapwork.editor.environment.areaSelectY = (event.pageY - $('#editorCanvas').offset().top);
            mapwork.editor.environment.mouseX = (event.pageX - $('#editorCanvas').offset().left);
            mapwork.editor.environment.mouseY = (event.pageY - $('#editorCanvas').offset().top);
            // trigger drawing of the selection box and stop capturing any additional co-ordinates until mouse button is released
            mapwork.editor.environment.leftMouseButtonDown = true;
            mapwork.editor.environment.areaSelectEnabled = true;
            mapwork.editor.environment.selectedAreaTiles = null;
        }
        else if (!mapwork.editor.environment.leftMouseButtonDown && mapwork.editor.environment.selectedTool === 'pasteTiles') {
            // begin pasting tiles to map

            startTileX = (event.pageX - $('#editorCanvas').offset().left) + (mapwork.viewcontroller.mapModel.getTileWidth() / 2) + mapwork.viewcontroller.camera.getX()
                - ((mapwork.editor.environment.selectedAreaTiles.rows[0].length * mapwork.viewcontroller.mapModel.getTileWidth()) / 2);
            startTileY = (event.pageY - $('#editorCanvas').offset().top) + (mapwork.viewcontroller.mapModel.getTileHeight() / 2) + mapwork.viewcontroller.camera.getY()
                - ((mapwork.editor.environment.selectedAreaTiles.rows.length * mapwork.viewcontroller.mapModel.getTileHeight()) / 2);

            startTileX = Math.floor(startTileX / mapwork.viewcontroller.mapModel.getTileWidth());
            startTileY = Math.floor(startTileY / mapwork.viewcontroller.mapModel.getTileHeight());


            for (rowCount = 0; rowCount < mapwork.editor.environment.selectedAreaTiles.rows.length; rowCount++) {
                for (cellCount = 0; cellCount < mapwork.editor.environment.selectedAreaTiles.rows[rowCount].length; cellCount++) {
                    currentTile = mapwork.editor.environment.selectedAreaTiles.rows[rowCount][cellCount];
                    // verify that this tile is being placed onto a part of the map that actually exists

                    tilePasteX = (startTileX + cellCount);
                    tilePasteY = (startTileY + rowCount);

                    if ((tilePasteX < mapwork.viewcontroller.mapModel.getTilesAccross()) && (tilePasteY < mapwork.viewcontroller.mapModel.getTilesDown())
                        && (tilePasteX >= 0) && (tilePasteY >= 0)) {
                        mapwork.viewcontroller.mapModel.getLayerByZPosition(mapwork.editor.environment.selectedLayer).getRow(startTileY + rowCount)[startTileX + cellCount].setTileCode(currentTile);
                        mapwork.editor.changes.PushChange({ verb: 'PaintSingleTile', x: tilePasteX, y: tilePasteY, z: mapwork.editor.environment.selectedLayer, tileCode: currentTile});

                    }

                }
            }

            // clear the array of copied tiles
            mapwork.editor.environment.leftMouseButtonDown = true;
            mapwork.editor.environment.selectedAreaTiles = null;
            mapwork.editor.environment.selectedTool = 'areaSelect';
        }

    },
    EditorCanvas_MouseUp: function (event) {
        "use strict";
        var eventCount, startX, startY, endX, endY, selectedTiles, firstTile, lastTile, firstCodeX, firstCodeY, lastCodeX, lastCodeY, row, rowCount, cellCount;
        if (mapwork.editor.environment.leftMouseButtonDown) {
            clearInterval(mapwork.editor.environment.editorClickInterval);
            mapwork.editor.environment.editorClickInterval = null;
        }
        if (mapwork.editor.environment.leftMouseButtonDown && mapwork.editor.environment.selectedTool === 'areaSelect') {
            if (mapwork.editor.environment.areaSelectEnabled) {

                if (mapwork.editor.environment.areaSelectX > mapwork.editor.environment.mouseX) {
                    startX = mapwork.editor.environment.mouseX;
                    endX = mapwork.editor.environment.areaSelectX;
                }
                else {
                    startX = mapwork.editor.environment.areaSelectX;
                    endX = mapwork.editor.environment.mouseX;
                }
                if (mapwork.editor.environment.areaSelectY > mapwork.editor.environment.mouseY) {
                    startY = mapwork.editor.environment.mouseY;
                    endY = mapwork.editor.environment.areaSelectY;
                }
                else {
                    startY = mapwork.editor.environment.areaSelectY;
                    endY = mapwork.editor.environment.mouseY;
                }

                if ((endX <= (mapwork.viewcontroller.camera.getWidth() + (mapwork.viewcontroller.camera.getX()))) && (endY <= (mapwork.viewcontroller.camera.getHeight() + (mapwork.viewcontroller.camera.getY())))) {
                    firstCodeX = Math.floor((startX + mapwork.viewcontroller.camera.getX()) / mapwork.viewcontroller.mapModel.getTileWidth());
                    firstCodeY = Math.floor((startY + mapwork.viewcontroller.camera.getY()) / mapwork.viewcontroller.mapModel.getTileHeight());

                    lastCodeX = Math.ceil((endX + mapwork.viewcontroller.camera.getX()) / mapwork.viewcontroller.mapModel.getTileWidth());
                    lastCodeY = Math.ceil((endY + mapwork.viewcontroller.camera.getY()) / mapwork.viewcontroller.mapModel.getTileHeight());


                    mapwork.editor.environment.selectedAreaTiles = { rows: [] };

                    mapwork.editor.changes.PushChange({ verb: 'AreaSelect', startX: firstCodeX, startY: firstCodeY, endX: lastCodeX-1, endY: lastCodeY-1});


                    for (rowCount = firstCodeY; rowCount < lastCodeY; rowCount++) {
                        row = [];
                        for (cellCount = firstCodeX; cellCount < lastCodeX; cellCount++) {
                            row.push(mapwork.viewcontroller.mapModel.getLayerByZPosition(mapwork.editor.environment.selectedLayer).getRow(rowCount)[cellCount].getTileCode());
                        }
                        mapwork.editor.environment.selectedAreaTiles.rows.push(row);
                    }
                    mapwork.editor.environment.selectedTool = 'pasteTiles';
                }

                // find out which tiles fall within these bounds
                mapwork.editor.environment.areaSelectEnabled = false;
            }



        }


        mapwork.editor.environment.leftMouseButtonDown = false;
    },
    EditorCanvas_MouseOut: function (event) {
        "use strict";
        var eventCount;
        if (mapwork.editor.environment.leftMouseButtonDown) {
            clearInterval(mapwork.editor.environment.editorClickInterval);
            mapwork.editor.environment.editorClickInterval = null;
        }
        if (mapwork.editor.environment.leftMouseButtonDown && mapwork.editor.environment.selectedTool === 'areaSelect') {
            mapwork.editor.environment.areaSelectEnabled = false;

        }
        mapwork.editor.environment.leftMouseButtonDown = false;

    },
    PaletteCanvas_Click: function (event) {
        "use strict";

        mapwork.viewcontroller.getPickerTileCode(parseInt(event.pageX - $('#paletteCanvas').offset().left, 10), parseInt(event.pageY - $('#paletteCanvas').offset().top, 10));
    },
    CreateItem_Click: function (event) {
        "use strict";
        mapwork.editor.environment.PresentRibbonContextMenu('create');
        // centre the create dialog
        $('#createDialog').css('top', ((($('#leftBar').height() / 2) - $('#createDialog').height() / 2) + "px"));
        $('#createDialog').show();
        $('.modalBlocker').show();
        $('#createProjectOptions').hide();
        $('#createExistingProjectName').val(-1);

        // show/hide each step, default to showing step one
        $('#createDialogStepOne').show();
        $('#createDialogStepTwo').hide();

        //refresh validation
        $('#createNewMapName').removeClass('errorBorder');
        $('#createNewProjectName').removeClass('errorBorder');
        $('#createNewProjectDescription').removeClass('errorBorder');
        $('#createExistingProjectName').removeClass('errorBorder');
    },
    CreateButtonOK_Click: function (event) {
        "use strict";
        var valid, result, newLayer;

        valid = true;

        $('#inpCreateHorizontalTiles').removeClass('errorBorder');
        $('#inpCreateVerticalTiles').removeClass('errorBorder');
        $('#inpCreateTileWidth').removeClass('errorBorder');
        $('#inpCreateTileHeight').removeClass('errorBorder');


        // tiles accross
        result = mapwork.helper.validation.ValidateInput($('#inpCreateHorizontalTiles'),
          [{ kind: 'required' },
          { kind: 'isnumeric' },
          { kind: 'min', value: 1 }]);

        if (result.length > 0) {
            $('#inpCreateHorizontalTiles').addClass('errorBorder');
            valid = false;
        }

        // tiles down
        result = mapwork.helper.validation.ValidateInput($('#inpCreateVerticalTiles'),
          [{ kind: 'required' },
          { kind: 'isnumeric' },
          { kind: 'min', value: 1 }]);

        if (result.length > 0) {
            $('#inpCreateVerticalTiles').addClass('errorBorder');
            valid = false;
        }

        if ((parseInt($('#inpCreateHorizontalTiles').val(), 10) * parseInt($('#inpCreateVerticalTiles').val(), 10)) > 16384) {
            mapwork.editor.environment.DisplayNotification('Tiles per layer must not exceed 16384 (e.g 128x128 or 512x32 etc)', 'red');
            valid = false;
        }

        // tile width
        //result = mapwork.helper.validation.ValidateInput($('#inpCreateTileWidth'),
        //  [{ kind: 'required' },
        //  { kind: 'isnumeric' },
        //  { kind: 'min', value: 1 }]);

        //if (result.length > 0) {
        //    $('#inpCreateTileWidth').addClass('errorBorder');
        //    valid = false;
        //}
        // tile height
        //result = mapwork.helper.validation.ValidateInput($('#inpCreateTileHeight'),
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
            $('#createDialog').hide();
            $('.modalBlocker').hide();


            mapwork.viewcontroller.mapModel = new Map();

            //mapwork.viewcontroller.mapModel.createBlankModel($('#createNewMapName').val(),
            //    parseInt($('#inpCreateTileWidth').val(), 10),
            //    parseInt($('#inpCreateTileHeight').val(), 10),
            //    parseInt($('#inpCreateHorizontalTiles').val(), 10),
            //    parseInt($('#inpCreateVerticalTiles').val(), 10));

            mapwork.viewcontroller.mapModel.createBlankModel($('#createNewMapName').val(),
                parseInt(32, 10),
                parseInt(32, 10),
                parseInt($('#inpCreateHorizontalTiles').val(), 10),
                parseInt($('#inpCreateVerticalTiles').val(), 10));


            mapwork.editor.environment.selectedLayer = 0;


            //build the camera and pass in the world and view coordinates
            mapwork.viewcontroller.camera = new mapwork.view.Camera();
            mapwork.viewcontroller.camera.setPosition(0, 0);
            mapwork.viewcontroller.camera.setBounds(mapwork.viewcontroller.mapModel.getWorldWidth(), mapwork.viewcontroller.mapModel.getWorldHeight());
            mapwork.viewcontroller.camera.setSize($('#editorCanvas').width(), $('#editorCanvas').height());


            // rebuild UI from model
            mapwork.editor.environment.BuildUIFromModel();
        }
    },
    PublishButtonOK_Click: function (event) {
        "use strict";
        /*$('#publishDialogStepOne').hide();
        $('#publishDialogPending').show();
        // begin serializing and sending map to server and retreiving bundle
        //mapwork.viewcontroller.mapModel.serializeCompact();
        mapwork.viewcontroller.mapModel.serialize();*/

        mapwork.editor.environment.DisplayNotification('Feature not implemented in this edition of MapWork', 'red');
    },
    CompressMapData_Success: function (data) {
        "use strict";
        var encodedData;
        //begin sending this to the server
        encodedData = encodeURIComponent(data);
        mapwork.editor.environment.PostMapForDownload(encodedData);
    },
    PostMapForDownload: function (mapData) {
        "use strict";
      /*  var fileDownloadCheckTimer, token, assetsIncluded;

        mapwork.editor.environment.downloadToken = new Date().getTime().toString();

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
            value: mapwork.viewcontroller.mapModel.getName()
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
            value: mapwork.editor.environment.downloadToken
        }));


        mapwork.editor.environment.downloadInterval = window.setInterval(mapwork.editor.environment.CheckDownloadTimer, 1000);

        $('#postDownloadMap').submit();
        $('#postDownloadMap').empty();
        $('body').remove('#postDownloadMap');

        */

    },
    PostMapForDownload_Success: function () {
        "use strict";
        $('#publishDialogPending').hide();
        $('#publishDialogSuccess').show();
    },
    CheckDownloadTimer: function () {
        "use strict";
        var cookieValue;
        // if the token previously specified has become a cookie, stop polling for it and let user know that download is complete

        if ($.cookie('bundleDownloadToken') !== null) {
            cookieValue = $.cookie('bundleDownloadToken').toString();
        }

        if (cookieValue === mapwork.editor.environment.downloadToken) {
            $.cookie('bundleDownloadToken', null);
            mapwork.editor.environment.downloadToken = null;
            clearInterval(mapwork.editor.environment.downloadInterval);
            mapwork.editor.environment.downloadInterval = null;
            mapwork.editor.environment.PostMapForDownload_Success();
        }

    },
    PublishButtonCancel_Click: function (event) {
        "use strict";
        $('#publishDialog').hide();
        $('#publishDialogStepOne').hide();
        $('.modalBlocker').hide();
    },
    PublishButtonCancelPublish_Click: function (event) {
        "use strict";
        $('#publishDialog').hide();
        $('#publishDialogStepOne').hide();
        $('.modalBlocker').hide();
    },
    PublishButtonSuccessOK_Click: function (event) {
        "use strict";
        $('#publishDialog').hide();
        $('#publishDialogSuccess').show();
        $('.modalBlocker').hide();
    },
    BuildUIFromModel: function () {
        "use strict";
        mapwork.editor.environment.LoadLayersFromModel();
        mapwork.editor.environment.LoadSettingsFromModel();
    },
    CreateButtonNext_Click: function (event) {
        "use strict";
        var valid, result;

        valid = true;

        //refresh validation
        $('#createNewMapName').removeClass('errorBorder');
        $('#createNewProjectName').removeClass('errorBorder');
        $('#createNewProjectDescription').removeClass('errorBorder');
        $('#createExistingProjectName').removeClass('errorBorder');


        // new map name
        result = mapwork.helper.validation.ValidateInput($('#createNewMapName'),
          [{ kind: 'required' },
          { kind: 'istext' }]);

        if (result.length > 0) {
            $('#createNewMapName').addClass('errorBorder');
            $('#createNewMapName').next().addClass('errorText');
            valid = false;
        }

        if ($('#createExistingProjectName').val() === '-1') {
            // user hasnt selected a project, get them to
            $('#createExistingProjectName').addClass('errorBorder');
            valid = false;
        }
        else if ($('#createExistingProjectName').val() === '0') {

            // new project name
            result = mapwork.helper.validation.ValidateInput($('#createNewProjectName'),
              [{ kind: 'required' },
              { kind: 'istext' }]);

            if (result.length > 0) {
                $('#createNewProjectName').addClass('errorBorder');
                valid = false;
            }

            // new project description
            result = mapwork.helper.validation.ValidateInput($('#createNewProjectDescription'),
              [{ kind: 'required' },
              { kind: 'istext' }]);

            if (result.length > 0) {
                $('#createNewProjectDescription').addClass('errorBorder');
                valid = false;
            }
        }

        if (valid) {
            // go to next step, hide content of previous step
            $('#createDialogStepOne').hide();
            $('#createDialogStepTwo').show();
        }

    },
    CreateButtonCancel_Click: function (event) {
        "use strict";
        // clear form
        $('#createNewMapName').val('');
        $('#createExistingProjectName').val(-1);
        $('#createNewProjectName').val('');
        $('#createNewProjectDescription').val('');
        // hide dialog
        $('#createDialog').hide();

        // hide all stages of create dialog
        $('#createDialogStepTwo').hide();
        $('#createDialogStepOne').hide();
        $('.modalBlocker').hide();


    },
    BuildItem_Click: function (event) {
        "use strict";
        if (mapwork.viewcontroller.mapModel !== null && mapwork.viewcontroller.mapModel !== undefined) {
            mapwork.editor.environment.PresentRibbonContextMenu('build');
        }
    },
    SaveItem_Click: function (event) {
        "use strict";
        if (mapwork.viewcontroller.mapModel !== null && mapwork.viewcontroller.mapModel !== undefined) {
            mapwork.editor.environment.PresentRibbonContextMenu('save');
        }
    },
    PublishItem_Click: function (event) {
        "use strict";
        if (mapwork.viewcontroller.mapModel !== null && mapwork.viewcontroller.mapModel !== undefined) {
            mapwork.editor.environment.PresentRibbonContextMenu('publish');
            // centre the create dialog
            $('#publishDialog').css('top', ((($('#leftBar').height() / 2) - $('#publishDialog').height() / 2) + "px"));
            $('#publishDialog').show();
            $('#publishDialogStepOne').show();
            $('#publishDialogSuccess').hide();
            $('#publishDialogError').hide();
            $('#publishDialogPending').hide();

            $('.modalBlocker').show();
        }

    },
    PaletteItem_Click: function (event) {
        "use strict";
        mapwork.editor.environment.PresentRibbonDialog('palette');
    },
    LayersItem_Click: function (event) {
        "use strict";
        mapwork.editor.environment.LoadLayersFromModel();
        mapwork.editor.environment.PresentRibbonDialog('layers');
    },
    PropertiesItem_Click: function (event) {
        "use strict";
        mapwork.editor.environment.PresentRibbonDialog('properties');
    },
    SettingsItem_Click: function (event) {
        "use strict";
        mapwork.editor.environment.LoadSettingsFromModel();
        mapwork.editor.environment.PresentRibbonDialog('settings');
    },
    PresentRibbonDialog: function (kind) {
        "use strict";
        $('#' + kind + 'Dialog').toggle();

        if (kind !== 'palette') {

            $('#paletteDialog').hide();
        }
        else {
            //// assign a tilesheet to the palette for selected layer
            mapwork.editor.environment.PalletCanvasResize();
        }

        if (kind !== 'layers') {
            $('#layersDialog').hide();
        }
        else {
            this.LoadLayersFromModel();
        }

        if (kind !== 'properties') {
            $('#propertiesDialog').hide();
        }
        else {
            // reset property selection
            $('#selectPropertyScope').val('-1');
            $('#selectPropertyScope').trigger('change');
        }

        if (kind !== 'settings') {
            $('#settingsDialog').hide();
        }
        else {
            //clear error validation warnings
            $('#settingsSelectProject').removeClass('errorBorder');
            $('#settingsMapName').removeClass('errorBorder');
            $('#settingsTilesAccross').removeClass('errorBorder');
            $('#settingsTilesDown').removeClass('errorBorder');
            $('#settingsTileHeight').removeClass('errorBorder');
            $('#settingsTileWidth').removeClass('errorBorder');

            this.LoadSettingsFromModel();
        }


        // alter size of the main canvas, based on dialog being visible or not
        if ($('#' + kind + 'Dialog').is(':visible')) {
            $('#canvasContainer').css('right', '328px');
        }
        else {
            $('#canvasContainer').css('right', '72px');
        }

        // do a canvas resize based on new dimensions of screen after toggle
        mapwork.editor.environment.Window_Resize();
    },
    PresentRibbonContextMenu: function (kind) {
        "use strict";
        mapwork.editor.environment.PresentRibbonDialog('none');
        if (kind === 'build') {
            $('#buildContextRibbon').show();
        }
        else {
            $('#buildContextRibbon').hide();
        }
    },
    PalletCanvasResize: function () {
        "use strict";
        var tilesheetWidth, tilesheetHeight, tileWidth, tileHeight, totalTiles, tilesPerRow, rowCount, pickerWidth, pickerHeight;
        if (this.selectedLayer !== null) {
            tilesheetWidth = mapwork.viewcontroller.mapModel.getLayerByZPosition(mapwork.editor.environment.selectedLayer).getTilesetWidth();
            tilesheetHeight = mapwork.viewcontroller.mapModel.getLayerByZPosition(mapwork.editor.environment.selectedLayer).getTilesetHeight();
            tileWidth = mapwork.viewcontroller.mapModel.getTileWidth();
            tileHeight = mapwork.viewcontroller.mapModel.getTileHeight();
            tilesPerRow = (256 / tileWidth);
            totalTiles = (tilesheetWidth / tileWidth) * (tilesheetHeight / tileHeight);
            rowCount = Math.ceil(totalTiles / tilesPerRow);
            pickerHeight = rowCount * tileHeight;
            pickerWidth = (rowCount * tileWidth);


            document.getElementById('paletteCanvas').height = pickerHeight;
            mapwork.viewcontroller.tilesetTilesAccross = (tilesheetWidth / tileWidth);
            mapwork.viewcontroller.tilesetTilesDown = (tilesheetHeight / tileHeight);
            mapwork.viewcontroller.pickerRowCount = rowCount;
            mapwork.viewcontroller.pickerTilesPerRow = tilesPerRow;
            mapwork.viewcontroller.totalPickerTiles = totalTiles;
        }

    },
    LoadTilesetList: function () {
        "use strict";
      /*  $.ajax({
            url: 'Editor/GetTilesetFilenames',
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            success: mapwork.editor.environment.LoadTilesetList_Success,
            error: mapwork.editor.environment.LoadTilesetList_Error
        });
        */

        var result = ["brick_tiles_64.png","default_tileset.png","dirt_tiles.png","environment_tiles_64.png","furniture_tiles.png","grass_tiles.png","inside_tiles_64.png","lightgrass_tiles.png","platform_tiles.png","terrain_tiles.png","village_tiles.png","water_tiles.png"];

        mapwork.editor.environment.LoadTilesetList_Success(result);
    },
    LoadTilesetList_Success: function (data) {
        "use strict";
        mapwork.editor.environment.tilesets = data;
    },
    LoadTilesetList_Error: function (data) {
        "use strict";
        mapwork.editor.environment.DisplayNotification('Failed to retrieve tilesets from server', 'red');
    },
    LayerSelectTileset_Change: function (event) {
        "use strict";
        $(this).parent().parent().data('zPosition');
        mapwork.viewcontroller.mapModel.getLayerByZPosition(parseInt($(this).parent().parent().data('zPosition'), 10)).setTilesetPath($(this).val());
    },
    DisplayNotification: function (message, colour) {
        "use strict";
        if (colour === 'red') {
            $('#notificationBanner').addClass('redNotification');
            $('#notificationBanner').removeClass('greenNotification');

        }
        else if (colour === 'green') {
            $('#notificationBanner').addClass('greenNotification');
            $('#notificationBanner').removeClass('redNotification');
        }

        clearTimeout(mapwork.editor.environment.notificationTimeout);
        $('#notificationBanner').hide();
        $('#notificationBanner span').text(message);
        $('#notificationBanner').slideDown(200, function () {
            mapwork.editor.environment.notificationTimeout = setTimeout(function () {
                $('#notificationBanner').slideUp(200);
            }, 5000);
        });
    },
    editorMoveInterval: null,
    editorClickInterval: null,
    selectedLayer: null,
    selectedTool: null,
    selectedPalleteTile: 0,
    selectedTile: null,
    leftMouseButtonDown: false,
    arrowKeyDown: false,
    mouseX: null,
    mouseY: null,
    areaSelectEnabled: false,
    areaSelectX: null,
    areaSelectY: null,
    selectedAreaTiles: null,
    gridEnabled: true,
    downloadToken: null,
    downloadInterval: null,
    tilesets: null,
    notificationTimeout: null

};
