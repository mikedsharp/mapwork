<script>
  import Dialog from '../Dialog/Dialog'
  import { setupStage } from '../Stores/CreateProjectWizard'

  function onCancelCreateProject() {
    setupStage.set('')
    alert('project create cancelled!')
  }
  function onConfirmCreateProject() {
    setupStage.set('set-map-dimensions')
    alert('project create confirmed, moving to next step!')
  }
</script>

<Dialog {$setupStage} dialogWidth="500px" dialogHeight="500px">
  <h1 slot="dialog-title">New Map</h1>
  <div slot="dialog-content">
    <span>Enter a name for your new map</span>
    <input type="text" />
  </div>
  <div slot="dialog-actions">
    <button type="button" on:click={onConfirmCreateProject}>Next</button>
    <button type="button" on:click={onCancelCreateProject}>Cancel</button>
  </div>
</Dialog>
