<script>
  export let action;
</script>

<style lang="scss">
  .ribbonItem {
    &:hover {
      background-color: red !important;
    }
  }
</style>

<div class="ribbonItem" id={action} title={action} />
