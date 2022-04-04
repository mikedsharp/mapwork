<script lang="ts">
  import SideBar from './Menu/SideBar.svelte';
  import CreateProjectWizard from './CreateProjectWizard/CreateProjectWizard.svelte'
  import DownloadMapWizard from './DownloadMapWizard/DownloadMapWizard.svelte'
  // tool menus
  import PaletteMenu from './PaletteMenu/PaletteMenu.svelte'
  import LayersMenu from './LayersMenu/LayersMenu.svelte'
  import PropertiesMenu from './PropetiesMenu/PropertiesMenu.svelte'
  import SettingsMenu from './SettingsMenu/SettingsMenu.svelte'
  // canvas
  import EditorCanvas from './EditorCanvas/EditorCanvas.svelte'
  // notifications
  import NotificationBanner from './NotificationBanner/NotificationBanner.svelte'
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
        if(openDrawer === drawers['palette']) {
          openDrawer = null;
        } else {
          openDrawer = drawers['palette']
        }
      },
    },
    {
      label: 'layers',
      id: 'layersItem',
      actionHandler: () => {
        if(openDrawer === drawers['layers']) {
          openDrawer = null;
        } else {
          openDrawer = drawers['layers']
        }
      },
    },
    {
      label: 'properties',
      id: 'propertiesItem',
      actionHandler: () => {
        if(openDrawer === drawers['properties']) {
          openDrawer = null;
        } else {
          openDrawer = drawers['properties']
        }
      },
    },
    {
      label: 'settings',
      id: 'settingsItem',
      actionHandler: () => {
        if(openDrawer === drawers['settings']) {
          openDrawer = null;
        } else {
          openDrawer = drawers['settings']
        }
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
    <SideBar actions={primaryActions} />
  </div>
  <EditorCanvas />
  <div id="rightBar" class="rightBar">
    {#if editorInstance.renderManager.mapModel}
      <SideBar actions={secondaryActions} />
    {/if}
    {#if openDrawer !== null}
      <svelte:component this={openDrawer.component} {editorInstance} />
    {/if}
  </div>
</div>
