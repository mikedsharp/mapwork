<script>
  import { onMount } from 'svelte'
  export let editorInstance

  function onClick(event) {
    editorInstance.PalletCanvasResize()
    editorInstance.renderManager.getPickerTileCode(
      parseInt(event.offsetX, 10),
      parseInt(event.offsetY, 10)
    )
  }
  onMount(() => {
    editorInstance.Window_Resize()
    editorInstance.PalletCanvasResize()
  })
</script>

<style lang="scss">
  .paletteCanvasContainer {
    overflow: auto;
    overflow-x: hidden;
    canvas {
      cursor: pointer;
    }
  }
</style>

<div class="paletteCanvasContainer">
  <canvas
    id="paletteCanvas"
    on:click={event => {
      onClick(event)
    }} />
</div>
