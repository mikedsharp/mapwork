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
  import { DisplayNotification } from './NotificationBanner/NotificationService'
  // enums
  import { WizardTypes } from './Wizard/WizardTypes'
  // props
  export let editorInstance

  let selectedWizard = null
  let openDrawer = null

  const wizards = {
    [WizardTypes.WIZARD_CREATE_MAP]: {
      component: CreateProjectWizard,
      onCompleted: handleCreateMapWizardCompletion,
      onCancelled: handleWizardCancelled,
    },
    [WizardTypes.WIZARD_DOWNLOAD_MAP]: {
      component: DownloadMapWizard,
      onCompleted: handleDownloadMapWizardCompletion,
      onCancelled: handleWizardCancelled,
    },
  }

  const drawers = {
    palette: {
      component: PaletteMenu,
    },
    layers: {
      component: LayersMenu,
    },
    properties: {
      component: PropertiesMenu,
    },
    settings: {
      component: SettingsMenu,
    },
  }
  const primaryActions = [
    {
      label: 'New Map',
      id: 'createItem',
      actionHandler: () => {
        selectedWizard = wizards[WizardTypes.WIZARD_CREATE_MAP]
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
      actionHandler: () => {},
    },
    {
      label: 'Download Map',
      id: 'publishItem',
      actionHandler: () => {
        if (editorInstance.renderManager.mapModel) {
          selectedWizard = wizards[WizardTypes.WIZARD_DOWNLOAD_MAP]
        } else {
          DisplayNotification(
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
        openDrawer = drawers['palette']
      },
    },
    {
      label: 'layers',
      id: 'layersItem',
      actionHandler: () => {
        openDrawer = drawers['layers']
      },
    },
    {
      label: 'properties',
      id: 'propertiesItem',
      actionHandler: () => {
        openDrawer = drawers['properties']
      },
    },
    {
      label: 'settings',
      id: 'settingsItem',
      actionHandler: () => {
        openDrawer = drawers['settings']
      },
    },
  ]

  function handleWizardCancelled() {
    selectedWizard = null
  }
  function handleDownloadMapWizardCompletion() {
    selectedWizard = null
  }
  function handleCreateMapWizardCompletion(event) {
    editorInstance.createNewMap(
      event.detail.mapName,
      event.detail.tileWidth,
      event.detail.tileHeight,
      event.detail.tilesAccross,
      event.detail.tilesDown
    )
    selectedWizard = null
  }
</script>

<div id="appContainer">
  {#if selectedWizard !== null}
    <svelte:component
      this={selectedWizard.component}
      on:wizardCancelled={selectedWizard.onCancelled}
      on:wizardCompleted={selectedWizard.onCompleted} />
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
    {#if openDrawer !== null}
      <svelte:component this={openDrawer.component} {editorInstance} />
    {/if}
  </div>
</div>
