<script>
  import MenuItem from "./Menu/MenuItem.svelte";
</script>

<div id="appContainer">
  <!--@*Notification Banner *@-->
  <div id="notificationBanner">
    <span class="textCentre" />
  </div>
  <!-- left region -->
  <div id="leftBar" class="leftBar">
    <div class="verticalCentered">
      <div class="itemContainer">
        <MenuItem action={'createItem'} />
        <MenuItem action={'buildItem'} />
        <MenuItem action={'saveItem'} />
        <MenuItem action={'publishItem'} />
      </div>
    </div>
  </div>
  <div class="modalBlocker" />
  <div id="createDialog" class="leftDialog">
    <h3 class="textCentre">New Map</h3>
    <div class="dialogContainer clearfix">
      <div id="createDialogStepOne" class="dialogStep">
        <div id="createNameOptions" class="clearfix marTB-10">
          <ul>
            <li>
              <span>Enter a name for your new map</span>
            </li>
            <li class="marT-5">
              <input class="noPadding" type="text" id="createNewMapName" />
            </li>
            <li class="marT-5">
              <span>Select the project you wish to add this map to</span>
            </li>
            <li class="marT-5">
              <select
                name="project"
                class="noPadding"
                id="createExistingProjectName">
                @*
                <option value="-1">Project Name</option>
                <option value="0">--Add New Project--</option>
                *@
                <option value="1">Default</option>
              </select>
            </li>
          </ul>
        </div>
        <div id="createProjectOptions" class="clearfix marTB-10">
          <ul>
            <li class="marT-5">
              <span>Name your new project</span>
            </li>
            <li class="marT-5">
              <input type="text" class="noPadding" id="createNewProjectName" />
            </li>
            <li class="marT-5">
              <span>Enter a description for your project</span>
            </li>

            <li class="marT-5">
              <textarea
                class="fullWidth noPadding"
                id="createNewProjectDescription"
                rows="5" />
            </li>
          </ul>
        </div>
        <div class="dialogButtonBox clearfix marT-5">
          <ul class="horizontalList">
            <li>
              <button
                type="button "
                class="button"
                id="createButtonNext"
                title="Next">
                Next
              </button>
            </li>
            <li>
              <button
                type="button"
                class="button"
                id="createButtonCancel"
                title="Cancel">
                Cancel
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div id="createDialogStepTwo" class="dialogStep">
        <div id="" class="clearfix marTB-10">
          <ul>
            <li class="marT-5">
              <span>Number of horizontal tiles</span>
            </li>
            <li class="marT-5">
              <input
                type="text"
                id="inpCreateHorizontalTiles"
                class="noPadding" />
            </li>
            <li class="marT-5">
              <span>Number of vertical tiles</span>
            </li>
            <li class="marT-5">
              <input
                type="text"
                id="inpCreateVerticalTiles"
                class="noPadding" />
            </li>
            <!--  @*  <li class="marT-5"><span>Tile width(in pixels)</span>
              </li>*@
              <li class="marT-5">
                <input type="text" id="inpCreateTileWidth" class="noPadding" />
              </li>
             @* <li class="marT-5"><span>Tile height(in pixels)</span>
             </li>*@ -->
            <li class="marT-5">
              <input type="text" id="inpCreateTileHeight" class="noPadding" />
            </li>
          </ul>
        </div>
        <div class="dialogButtonBox clearfix marT-5">
          <ul class="horizontalList">
            <li>
              <button
                type="button "
                class="button"
                id="createButtonOK"
                title="Next">
                OK
              </button>
            </li>
            <li>
              <button
                type="button"
                class="button"
                id="createButtonCancelTwo"
                title="Cancel">
                Cancel
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div id="publishDialog" class="leftDialog">
    <h3 class="textCentre">Export Map Bundle</h3>
    <div class="dialogContainer clearfix">
      <div id="publishDialogStepOne" class="dialogStep">
        <div id="" class="clearfix marTB-10">
          <ul>
            <li class="marT-5">
              <span>Select an output format</span>
            </li>
            <li class="marT-5">
              <select class="noPadding" id="publishSelectOutputFormat">
                <option value="JSON">JSON</option>
                <option value="XML">XML</option>
              </select>
            </li>
            <li class="marT-5">
              <span>Include all assets?</span>
            </li>
            <li class="marT-5">
              <input
                type="checkbox"
                id="publishIncludeAssets"
                checked="checked" />
            </li>
          </ul>
        </div>
        <div class="dialogButtonBox clearfix marT-5">
          <ul class="horizontalList">
            <li>
              <button
                type="button "
                class="button"
                id="publishButtonOK"
                title="Next">
                OK
              </button>
            </li>
            <li>
              <button
                type="button"
                class="button"
                id="publishButtonCancel"
                title="Cancel">
                Cancel
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div id="publishDialogPending" class="dialogStep">
        <ul>
          <li class="marT-5">
            <span class="block textCentre">
              Your mapwork Bundle is being prepared
            </span>
          </li>
          <li class="marT-5">
            <span class="block textCentre">Please Wait...</span>
          </li>
          <li class="marTB-20">
            <img class="centre block" src="/Images/360.gif" />
          </li>
        </ul>
        <div class="dialogButtonBox clearfix marT-5">
          <ul class="horizontalList">
            <li>
              <button
                type="button"
                class="button"
                id="publishButtonCancelPublish"
                title="Cancel">
                Cancel
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div id="publishDialogSuccess" class="dialogStep">
        <ul>
          <li class="marT-5">
            <span class="block textCentre">
              Your mapwork Bundle has been delivered!
            </span>
          </li>
        </ul>
        <div class="dialogButtonBox clearfix marT-5">
          <ul class="horizontalList">
            <li>
              <button
                type="button"
                class="button"
                id="publishButtonSuccessOK"
                title="Cancel">
                OK
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div id="publishDialogError" class="dialogStep" />
    </div>
  </div>
  <!-- centre region -->
  <div id="canvasContainer">
    <canvas id="editorCanvas" class="editorCanvas" width="0" height="0" />
  </div>
  <!-- right region -->
  <div id="rightBar" class="rightBar">
    <div class="verticalCentered">
      <div class="itemContainer" id="buildContextRibbon">
        <div class="ribbonItem" id="paletteItem" title="palette" />
        <div class="ribbonItem" id="layersItem" title="layers" />
        <div class="ribbonItem" id="propertiesItem" title="properties" />
        <div class="ribbonItem" id="settingsItem" title="settings" />
      </div>
    </div>
  </div>
  <div id="paletteDialog" class="dialogDummy">
    <div id="paletteInfo" class="clearfix">
      <h3>Palette</h3>
      <p>
        Select a tile from the palette below, if required, upload a new tileset.
      </p>
      <div id="paletteToolbox">
        <div class="table">
          <div class="tableRow">
            <div class="tableCell toolboxItem" id="toolboxItemAreaselect" />
            <div class="tableCell toolboxItem" id="toolboxItemInspect" />
            <div class="tableCell toolboxItem" id="toolboxItemBrush" />
            <div class="tableCell toolboxItem" id="toolboxItemBucket" />
            <div class="tableCell toolboxItem" id="toolboxItemEraser" />
          </div>
        </div>
      </div>
    </div>

    <div id="paletteCanvasContainer">
      <canvas id="paletteCanvas" />
    </div>
  </div>
  <div id="layersDialog" class="dialogDummy">
    <h3>Layers</h3>
    <div id="layersMenuContainer">
      <p>Manage the order and visibiltiy of map layers here.</p>
    </div>
    <div id="layerInformationContainer" class="layerScroll">
      <ul id="layerList" class="clearfix" />
    </div>
    <div id="layerControls" class="clearfix">
      <div id="layerCreateNewLayer">
        <img src="/Images/layer_new.png" />
      </div>
      <div id="layerMoveUp">
        <img src="/Images/layer_moveup.png" />
      </div>
      <div id="layerMoveDown">
        <img src="/Images/layer_movedown.png" />
      </div>
    </div>
  </div>
  <div id="propertiesDialog" class="dialogDummy">
    <h3>Map Properties</h3>
    <div id="mapPropertiesContainer">
      <p>
        Add, remove and edit properties about the maps, layers and specific tile
        types.
      </p>
    </div>

    <div id="propertyFilterContainer" class="marL-10 marR-10">
      <ul class="marTB-10">
        <li class="marTB-10">
          <span>Property Scope:</span>
        </li>
        <li>
          <select
            name="propertyScope"
            class="noPadding w150"
            id="selectPropertyScope">
            <option value="-1">--Select Scope--</option>
            <option value="0">Map</option>
            <option value="1">Layer</option>
            <option value="2">Tile</option>
          </select>
        </li>
      </ul>
      <ul class="marTB-10" id="layerScopeContainer">
        <li class="marTB-10">
          <span>Select a Layer:</span>
        </li>
        <li>
          <select
            name="propertyScope"
            class="noPadding w150"
            id="selectLayerScope"
            disabled="disabled">
            <option value="-1">--Select Layer--</option>
            <option value="0">Layer 1</option>
            <option value="1">Collision Layer</option>
            <option value="2">Random Layer</option>
          </select>
        </li>
      </ul>
      <ul class="marTB-10" id="layerTileSelectContainer">
        <li>
          <span>Select a Tile:</span>
        </li>
        <li>
          <a id="propertiesInspectTile" />
        </li>
      </ul>
    </div>
    <div id="mapPropertiesListContainer" class="propertiesScroll">
      <div class="table" id="propertyTable">
        <div class="tableRow border">
          <div class="tableCell border">
            <span class="textCentered">Property</span>
          </div>
          <div class="tableCell border">
            <span class="textCentered">Value</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="settingsDialog" class="dialogDummy ">
    <h3>Settings</h3>
    <div id="mapSettingsContainer">
      <p>Change export and editor settings here.</p>
      <div>
        <ul class="marL-10 marR-10 marTB-10">
          <li class="marT-5">
            <h4>Map</h4>
          </li>
          <li class="marT-5">
            <span class="noPadding">Map Name:</span>
          </li>
          <li class="marT-5">
            <input type="text" class="noPadding w150" id="settingsMapName" />
          </li>
          <!--  @* <li class="marT-5">
              <span class="noPadding">Project Name:</span>
            </li>
            <li class="marT-5">
              <select class="noPadding w150" id="settingsSelectProject">
                <option value="-1">-- Select A Project --</option>
                <option value="0">Project A</option>
                <option value="1">Project B</option>
              </select>
            </li>*@ -->
          <li class="marT-5">
            <span class="noPadding">Tiles Accross:</span>
          </li>
          <li class="marT-5">
            <input
              type="text"
              class="noPadding w150"
              id="settingsTilesAccross" />
          </li>
          <li class="marT-5">
            <span class="noPadding">Tiles Down:</span>
          </li>
          <li class="marT-5">
            <input type="text" class="noPadding w150" id="settingsTilesDown" />
          </li>
          <!-- @* <li class="marT-5">
              <span class="noPadding">Tile Width: </span>
            </li>*@ -->
          <li class="marT-5">
            <input type="text" class="noPadding w150" id="settingsTileWidth" />
          </li>
          <!--@* <li class="marT-5">
              <span class="noPadding">Tile Height: </span>
            </li>*@ -->
          <li class="marT-5">
            <input type="text" class="noPadding w150" id="settingsTileHeight" />
          </li>
          <li class="marTB-10">
            <a class="button" id="settingsSaveChanges">Save Changes</a>
          </li>
        </ul>

        <ul class="marL-10 marR-10 marTB-10">
          <li class="marT-5">
            <h4>Editor</h4>
          </li>
          <li class="marT-5">
            <span>Show Grid:</span>
          </li>
          <li class="marT-5">
            <input
              type="checkbox"
              checked="checked"
              class="noPadding"
              id="settingsToggleGrid" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
