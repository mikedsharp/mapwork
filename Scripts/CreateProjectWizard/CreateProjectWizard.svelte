<script>
  import NameMapStep from './NameMapStep'
  import SetMapDimensionsStep from './SetMapDimensionsStep'
  import { setupStage } from '../Stores/CreateProjectWizard'
</script>

{#if $setupStage === 'create-project'}
  <NameMapStep />
{:else if $setupStage === 'set-map-dimensions'}
  <SetMapDimensionsStep />
{/if}
