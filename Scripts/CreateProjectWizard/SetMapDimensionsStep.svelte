<script>
  import Dialog from '../Dialog/Dialog'
  import { setupStage } from '../Stores/CreateProjectWizard'
  let tilesAccross = 32
  let tilesDown = 32

  function onCancelCreateProject() {
    setupStage.set('')
  }
  function onConfirmCreateProject() {
    setupStage.set('')
  }
  function isInvalid() {
    return true
  }
  $: valid = tilesAccross > 0 && tilesDown > 0
</script>

<style lang="scss">
  .set-map-dimensions-content {
    display: flex;
    flex-direction: column;
  }
</style>

<Dialog {$setupStage} dialogWidth="500px" dialogHeight="500px">
  <h1 slot="dialog-title">New Map</h1>
  <div class="set-map-dimensions-content" slot="dialog-content">
    <span>Number of horizontal tiles</span>
    <input type="number" bind:value={tilesAccross} />
    <span>Number of vertical tiles</span>
    <input type="number" bind:value={tilesDown} />
  </div>
  <div slot="dialog-actions">
    <button disabled={!valid} type="button" on:click={onConfirmCreateProject}>
      Ok
    </button>
    <button type="button" on:click={onCancelCreateProject}>Cancel</button>
  </div>
</Dialog>
