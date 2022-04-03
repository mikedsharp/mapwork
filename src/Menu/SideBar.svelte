<script>
  import MenuItem from './MenuItem.svelte'
  export let actions
</script>

<div class="verticalCentered">
  <div class="itemContainer">
    {#each actions as action}
      <MenuItem label={action.label} {action} />
    {/each}
  </div>
</div>
