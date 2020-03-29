<script>
  import { createEventDispatcher } from 'svelte'
  export let action
  const dispatch = createEventDispatcher()
  function handleClick() {
    dispatch(action)
  }
</script>

<style lang="scss">
  .ribbonItem {
    &:hover {
      background-color: red !important;
    }
  }
</style>

<div class="ribbonItem" id={action} title={action} on:click={handleClick} />
