<script>
  export let dialogWidth
  export let dialogHeight
</script>

<style lang="scss">
  * {
    box-sizing: border-box;
  }
  $dialog-background-color: #444;
  .dialog-overlay {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgb(31, 30, 30);
    opacity: 70%;
    z-index: 10;
  }
  .dialog {
    background-color: $dialog-background-color;
    position: absolute;
    top: calc(50% - var(--dialogHeight) / 2);
    left: calc(50% - var(--dialogWidth) / 2);
    width: var(--dialogWidth);
    height: var(--dialogHeight);
    z-index: 11;
    display: flex;
    flex-direction: column;
    padding: 10px;
  }
  .dialog-title {
    min-height: 40px;
    max-height: 100px;
  }
  .dialog-content {
    display: flex;
    flex: 1;
  }
  .dialog-actions {
    min-height: 40px;
    max-height: 40px;
  }
  [slot='dialog-actions'] {
    button {
      background-color: red;
    }
  }
</style>

<div class="dialog-overlay" />
<div
  class="dialog"
  style="--dialogHeight:{dialogHeight};--dialogWidth:{dialogWidth}">
  <div class="dialog-title">
    <slot name="dialog-title" />
  </div>
  <div class="dialog-content">
    <slot name="dialog-content" />
  </div>
  <div class="dialog-actions">
    <slot name="dialog-actions" />
  </div>
</div>
