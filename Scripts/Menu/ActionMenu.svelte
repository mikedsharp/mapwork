<script>
  import MenuItem from './MenuItem'
  export let actions
</script>

<div class="verticalCentered">
  <div class="itemContainer">
    {#each actions as action}
      <MenuItem label={action.label} {action} />
    {/each}
  </div>
</div>
