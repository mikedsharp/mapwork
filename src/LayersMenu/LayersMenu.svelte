<script>
  import { onMount } from 'svelte'
  import { mapModel } from '../MapModel/MapModel'
  import { DisplayNotification } from '../NotificationBanner/NotificationService'
  import { Layer } from '../mapwork.model.layer'
  export let editorInstance
  let mapModelInstance
  mapModel.subscribe(value => {
    mapModelInstance = value
  })

  onMount(() => {
    editorInstance.Window_Resize()
  })
  function onCreateNewLayerClick() {
    var layerName, newLayer

    if (mapModelInstance.layers.length < 5) {
      //create new layer
      layerName = 'Untitled Layer ' + mapModelInstance.layers.length

      // adding the new layer to the model
      newLayer = new Layer(editorInstance)
      newLayer.createBlankModelLayer(
        mapModelInstance,
        layerName,
        'default_tileset.png'
      )
      newLayer.setZPosition(mapModelInstance.layers.length)
      editorInstance.selectedLayer = mapModelInstance.layers.length
      mapModelInstance.addLayer(newLayer)
      mapModel.set(mapModelInstance)
    } else {
      DisplayNotification('A map may only have up to 5 layers', 'red')
    }
  }
  function onLayerDelete(event, layer) {
    let layerCount
    mapModelInstance.removeLayer(layer.zPosition)
    for (
      layerCount = 0;
      layerCount < mapModelInstance.getLayers().length;
      layerCount++
    ) {
      mapModelInstance.getLayer(layerCount).setZPosition(layerCount)
    }

    mapModel.set(mapModelInstance)
    if (mapModelInstance.getLayers().length === 0) {
      editorInstance.selectedLayer = null
    } else {
      editorInstance.selectedLayer = mapModelInstance.layers.length - 1
    }
  }
  function onLayerSelect(event, layer) {
    editorInstance.selectedLayer = layer.getZPosition()
  }
  function onMoveLayerDownClick() {
    editorInstance.LayerMoveDown_Click()
  }
  function onMoveLayerUpClick() {
    editorInstance.LayerMoveUp_Click()
  }
</script>

<div id="layersDialog" class="dialogDummy">
  <h3>Layers</h3>
  <div id="layersMenuContainer">
    <p>Manage the order and visibiltiy of map layers here.</p>
  </div>
  <div id="layerInformationContainer" class="layerScroll">
    <ul id="layerList" class="clearfix">
      {#each mapModelInstance.layers as layer}
        <li
          class="layerListItem {layer.getZPosition() === editorInstance.selectedLayer ? 'layerSelected' : 'layerUnselected'}"
          on:click={event => {
            onLayerSelect(event, layer)
          }}>
          <div class="layerListItemDescription">
            <span class="layerName">{layer.getName()}</span>
            <input type="text" class="layerNameInput" />
            <select
              on:change={element => {
                layer.setTilesetPath(element.target.value)
              }}
              value={layer.getTilesetPath()}
              class="layerSelectTileset noPadding marT-10">
              {#each editorInstance.tilesets as tileset}
                <option value={tileset}>{tileset}</option>
              {/each}
            </select>

          </div>
          <div class="layerListItemActions">
            <a class="renameLayer" />
            <a class="toggleLayerVisibility layerVisibilityIconVisible" />
            <a
              class="deleteLayer"
              on:click={event => {
                onLayerDelete(event, layer)
              }} />
          </div>
        </li>
      {/each}
    </ul>
  </div>
  <div id="layerControls" class="clearfix">
    <div
      id="layerCreateNewLayer"
      on:click={event => {
        onCreateNewLayerClick(event)
      }} />
    <div
      id="layerMoveUp"
      on:click={event => {
        onMoveLayerUpClick(event)
      }} />
    <div
      id="layerMoveDown"
      on:click={event => {
        onMoveLayerDownClick(event)
      }} />
  </div>
</div>
