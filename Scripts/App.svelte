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
  // notifications
  import NotificationBanner from './NotificationBanner/NotificationBanner'
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
        if (editorInstance.renderManager.mapModel) {
          activeWizard = wizardTypes.WIZARD_DOWNLOAD_MAP
        } else {
          editorInstance.DisplayNotification(
            'Please create a map before attempting to download the project.',
            'red'
          )
        }
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
  function handleDownloadMapWizardCompletion() {
    activeWizard = wizardTypes.WIZARD_NONE
  }
  function handleCreateMapWizardCompletion(event) {
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
      on:wizardCompleted={handleCreateMapWizardCompletion} />
  {:else if activeWizard === wizardTypes.WIZARD_DOWNLOAD_MAP}
    <DownloadMapWizard
      on:wizardCancelled={handleWizardCancelled}
      on:wizardCompleted={handleDownloadMapWizardCompletion} />
  {/if}
  <NotificationBanner />
  <div id="leftBar" class="leftBar">
    <ActionMenu actions={primaryActions} />
  </div>
  <EditorCanvas />
  <div id="rightBar" class="rightBar">
    {#if editorInstance.renderManager.mapModel}
      <ActionMenu actions={secondaryActions} />
    {/if}
    <PaletteMenu />
    <LayersMenu />
    <PropertiesMenu />
    <SettingsMenu />
  </div>
</div>
