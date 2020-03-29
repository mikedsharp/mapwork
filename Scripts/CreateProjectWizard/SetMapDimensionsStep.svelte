<script>
  import Dialog from '../Dialog/Dialog'
  import { setupStage } from '../Stores/CreateProjectWizard'

  function onCancelCreateProject() {
    setupStage.set('')
    alert('project create cancelled!')
  }
  function onConfirmCreateProject() {
    setupStage.set('')
    alert('project create confirmed, creating project...')
  }
</script>

<Dialog {$setupStage} dialogWidth="500px" dialogHeight="500px">
  <h1 slot="dialog-title">New Map</h1>
  <div slot="dialog-content">
    <span>Number of horizontal tiles</span>
    <input type="number" />
    <span>Number of vertical tiles</span>
    <input type="number" />
  </div>
  <div slot="dialog-actions">
    <button type="button" on:click={onConfirmCreateProject}>Ok</button>
    <button type="button" on:click={onCancelCreateProject}>Cancel</button>
  </div>
</Dialog>
