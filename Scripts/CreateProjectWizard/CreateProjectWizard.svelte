<script>
  import NameMapStep from './NameMapStep'
  import SetMapDimensionsStep from './SetMapDimensionsStep'
  import { setupStage } from '../Stores/CreateProjectWizard'
  let mapName
  function handleStepCompletion(event) {
    mapName = event.detail.mapName
      setupStage.set('set-map-dimensions');
  }
  function handleWizardCancelled() {
    setupStage.set('');
  }
</script>

{#if $setupStage === 'create-project'}
  <NameMapStep on:wizardCancelled={handleWizardCancelled} on:stepCompleted={handleStepCompletion} />
{:else if $setupStage === 'set-map-dimensions'}
  <SetMapDimensionsStep {mapName} on:wizardCancelled={handleWizardCancelled} on:wizardCompleted />
{/if}
