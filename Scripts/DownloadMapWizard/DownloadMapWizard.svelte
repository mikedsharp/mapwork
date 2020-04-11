<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  import Dialog from '../Dialog/Dialog'
  function onConfirm() {
    dispatch('wizardCompleted')
  }
  function onCancel() {
    dispatch('wizardCancelled')
  }
</script>

<Dialog
  dialogWidth="500px"
  dialogHeight="500px"
  clickOutsideToCancelAction={onCancel}>
  <h1 slot="dialog-title">Export Map Bundle</h1>
  <div slot="dialog-content">
    <p>Download map fields will go here.</p>
  </div>
  <div slot="dialog-actions">
    <button type="button" on:click={onConfirm}>Ok</button>
    <button type="button" on:click={onCancel}>Cancel</button>
  </div>
</Dialog>
