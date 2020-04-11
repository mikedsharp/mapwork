<script>
  import ActionMenu from './Menu/ActionMenu'
  import CreateProjectWizard from './CreateProjectWizard/CreateProjectWizard'
  import DownloadMapWizard from './DownloadMapWizard/DownloadMapWizard'
  // tool menus
  import PaletteMenu from './PaletteMenu/PaletteMenu'
  import LayersMenu from './LayersMenu/LayersMenu'
  import PropertiesMenu from './PropetiesMenu/PropertiesMenu'
  import SettingsMenu from './SettingsMenu/SettingsMenu'
  // canvas
  import EditorCanvas from './EditorCanvas/EditorCanvas'
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
  <DownloadMapWizard />
  <!-- centre region -->
  <EditorCanvas />
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
