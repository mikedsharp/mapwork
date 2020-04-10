<script>
  export let action
  export let label;
</script>

<style lang="scss">

</style>

<div class="ribbonItem" id={action.id} title={label} on:click={() => {action.actionHandler()}} />
