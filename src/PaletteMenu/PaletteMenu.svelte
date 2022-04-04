<script lang="ts">
  import PaletteTile from '../PaletteTile/PaletteTile.svelte'
  import TilePicker from '../TilePicker/TilePicker.svelte'
  export let editorInstance
  const tilesetsEndpoint =
        'https://mds-mapwork-tilesets.s3-eu-west-1.amazonaws.com'
  const tilesetImage = new Image();
  tilesetImage.src = `${tilesetsEndpoint}/${editorInstance.renderManager.mapModel.getLayerByZPosition(editorInstance.selectedLayer).getTilesetPath()}`;
  const tilesetPath = tilesetImage.src;
  const tilesetWidth = tilesetImage.width;
  const tilesetHeight = tilesetImage.height;

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

  function onPaletteTilePicked(event) {
   editorInstance.renderManager.getPickerTileCode(event.detail.x, event.detail.y);
  }
</script>


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
  <div class="paletteMenu__tiles">
      {#each {length: tilesetHeight/32} as _, i} 
        {#each {length: tilesetWidth/32} as _, j} 
          {#if editorInstance.renderManager.mapModel.getLayerByZPosition(editorInstance.selectedLayer)}
          <PaletteTile on:paletteTilePicked={onPaletteTilePicked} tileCell={j} tileRow={i} {tilesetPath} />
          {/if}
        {/each}
      {/each}
  </div>
</div>

<style lang="scss">
  .paletteMenu {
    &__tiles {
      display: flex;
      flex-wrap: wrap;
      background-color:#aaa;
      margin:0 auto;
    }
  }
  #paletteDialog {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
</style>
