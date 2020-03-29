<script>
  import NameMapStep from './NameMapStep'
  import SetMapDimensionsStep from './SetMapDimensionsStep'
  import { setupStage } from '../Stores/CreateProjectWizard'
  let mapName
  function handleStepCompletion(event) {
    mapName = event.detail.mapName
  }
</script>

{#if $setupStage === 'create-project'}
  <NameMapStep on:stepCompleted={handleStepCompletion} />
{:else if $setupStage === 'set-map-dimensions'}
  <SetMapDimensionsStep {mapName} on:wizardCompleted />
{/if}
