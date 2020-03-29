<script>
  import Dialog from '../Dialog/Dialog'
  import { setupStage } from '../Stores/CreateProjectWizard'
  let mapName = 'untitled map 1'
  function onCancelCreateProject() {
    setupStage.set('')
  }
  function onConfirmCreateProject() {
    setupStage.set('set-map-dimensions')
  }
  $: valid = mapName && mapName.length > 0
</script>

<Dialog {$setupStage} dialogWidth="500px" dialogHeight="500px">
  <h1 slot="dialog-title">New Map</h1>
  <div slot="dialog-content">
    <span>Enter a name for your new map</span>
    <input bind:value={mapName} type="text" />
  </div>
  <div slot="dialog-actions">
    <button type="button" disabled={!valid} on:click={onConfirmCreateProject}>
      Next
    </button>
    <button type="button" on:click={onCancelCreateProject}>Cancel</button>
  </div>
</Dialog>
