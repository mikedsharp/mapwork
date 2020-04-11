<script>
  import ActionMenu from './Menu/ActionMenu'
  import CreateProjectWizard from './CreateProjectWizard/CreateProjectWizard'
  // tool menus
  import PaletteMenu from './PaletteMenu/PaletteMenu'
  import LayersMenu from './LayersMenu/LayersMenu'
  import PropertiesMenu from './PropetiesMenu/PropertiesMenu'
  import SettingsMenu from './SettingsMenu/SettingsMenu'
  // props
  export let editorInstance
  const wizardTypes = {
    WIZARD_NONE: -1,
    WIZARD_CREATE_MAP: 0,
    WIZARD_SAVE_MAP: 1,
    WIZARD_DOWNLOAD_MAP: 2,
  }
  let activeWizard = wizardTypes.WIZARD_NONE
  const primaryActions = [
    {
      label: 'New Map',
      id: 'createItem',
      actionHandler: () => {
        activeWizard = wizardTypes.WIZARD_CREATE_MAP
      },
    },
    {
      label: 'Map Tools',
      id: 'buildItem',
      actionHandler: () => {
        editorInstance.showBuildMenu()
      },
    },
    {
      label: 'Save Map',
      id: 'saveItem',
      actionHandler: () => {
        activeWizard = wizardTypes.WIZARD_SAVE_MAP
      },
    },
    {
      label: 'Download Map',
      id: 'publishItem',
      actionHandler: () => {
        activeWizard = wizardTypes.WIZARD_DOWNLOAD_MAP
      },
    },
  ]
  const secondaryActions = [
    {
      label: 'palette',
      id: 'paletteItem',
      actionHandler: () => {
        editorInstance.openPaletteDrawer()
      },
    },
    {
      label: 'layers',
      id: 'layersItem',
      actionHandler: () => {
        editorInstance.openLayersDrawer()
      },
    },
    {
      label: 'properties',
      id: 'propertiesItem',
      actionHandler: () => {
        editorInstance.openPropertiesDrawer()
      },
    },
    {
      label: 'settings',
      id: 'settingsItem',
      actionHandler: () => {
        editorInstance.openSettingsDrawer()
      },
    },
  ]
  function handleWizardCancelled() {
    activeWizard = wizardTypes.WIZARD_NONE
  }
  function handleWizardCompletion(event) {
    editorInstance.createNewMap(
      event.detail.mapName,
      event.detail.tileWidth,
      event.detail.tileHeight,
      event.detail.tilesAccross,
      event.detail.tilesDown
    )
    activeWizard = wizardTypes.WIZARD_NONE
  }
</script>

<div id="appContainer">
  {#if activeWizard === wizardTypes.WIZARD_CREATE_MAP}
    <CreateProjectWizard
      on:wizardCancelled={handleWizardCancelled}
      on:wizardCompleted={handleWizardCompletion} />
  {/if}
  <!--@*Notification Banner *@-->
  <div id="notificationBanner">
    <span class="textCentre" />
  </div>
  <!-- left region -->
  <div id="leftBar" class="leftBar">
    <ActionMenu actions={primaryActions} />
  </div>
  <div class="modalBlocker" />
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
    {#if editorInstance.renderManager.mapModel}
      <ActionMenu actions={secondaryActions} />
    {/if}
  </div>
  <PaletteMenu />
  <LayersMenu />
  <PropertiesMenu />
  <SettingsMenu />
</div>
