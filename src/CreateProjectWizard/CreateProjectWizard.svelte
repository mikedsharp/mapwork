<script>
  import NameMapStep from './NameMapStep.svelte'
  import SetMapDimensionsStep from './SetMapDimensionsStep.svelte'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  let mapName
  let setupStage = 'create-project'
  function handleWizardStepChange(event) {
    mapName = event.detail.mapName;
    setupStage = 'set-map-dimensions'
  }
</script>

{#if setupStage === 'create-project'}
  <NameMapStep on:wizardCancelled on:stepCompleted={handleWizardStepChange} />
{:else if setupStage === 'set-map-dimensions'}
  <SetMapDimensionsStep {mapName} on:wizardCancelled on:wizardCompleted />
{/if}
