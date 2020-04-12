<script>
  import NameMapStep from './NameMapStep'
  import SetMapDimensionsStep from './SetMapDimensionsStep'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  let mapName
  let setupStage = 'create-project'
  function handleStepCompletion(event) {
    mapName = event.detail.mapName
    dispatch('wizardStepChange', 'set-map-dimensions')
  }
  function handleWizardStepChange(event) {
    setupStage = 'set-map-dimensions'
  }
</script>

{#if setupStage === 'create-project'}
  <NameMapStep on:wizardCancelled on:stepCompleted={handleWizardStepChange} />
{:else if setupStage === 'set-map-dimensions'}
  <SetMapDimensionsStep {mapName} on:wizardCancelled on:wizardCompleted />
{/if}
