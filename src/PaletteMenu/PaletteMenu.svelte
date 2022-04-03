<script lang="ts">
  import TilePicker from '../TilePicker/TilePicker.svelte'
  export let editorInstance

  function onBrushToolSelected() {
    editorInstance.selectedTool = 'singleTileBrush'
  }
  function onAreaSelectToolSelected() {
    editorInstance.selectedTool = 'areaSelect'
  }
  function onBucketToolSelected() {
    editorInstance.selectedTool = 'bucketFill'
  }
  function onEraserToolSelected() {
    editorInstance.selectedTool = 'eraser'
  }
</script>

<style lang="scss">
  #paletteDialog {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
</style>

<div id="paletteDialog" class="dialogDummy">
  <div id="paletteInfo" class="clearfix">
    <h3>Palette</h3>
    <p>
      Select a tile from the palette below, if required, upload a new tileset.
    </p>
    <div id="paletteToolbox">
      <div class="table">
        <div class="tableRow">
          <div
            class="tableCell toolboxItem"
            id="toolboxItemAreaselect"
            on:click={() => {
              onAreaSelectToolSelected()
            }} />
          <div
            class="tableCell toolboxItem"
            id="toolboxItemBrush"
            on:click={() => {
              onBrushToolSelected()
            }} />
          <div
            class="tableCell toolboxItem"
            id="toolboxItemBucket"
            on:click={() => {
              onBucketToolSelected()
            }} />
          <div
            class="tableCell toolboxItem"
            id="toolboxItemEraser"
            on:click={() => {
              onEraserToolSelected()
            }} />
        </div>
      </div>
    </div>
  </div>

  <TilePicker {editorInstance} />
</div>
