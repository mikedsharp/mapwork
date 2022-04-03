<script lang="ts">
  import { onMount } from 'svelte'
  import { mapModel } from '../MapModel/MapModel'
  export let editorInstance
  let mapModelInstance
  let tilesAccross = 0;
  let tilesDown = 0;
  let mapName = 'sefwseg';

  mapModel.subscribe(value => {
    mapModelInstance = value
    mapName = value.name;
    tilesAccross = parseInt(value.tilesAccross);
    tilesDown = parseInt(value.tilesDown);
  })
  onMount(() => {
    editorInstance.Window_Resize()
  })
  function onGridEnabledToggle() {
    editorInstance.gridEnabled = !editorInstance.gridEnabled;
  }
  function onSaveSettings() {
    mapModel.update(map => {
      map.setName(mapName);
      editorInstance.renderManager.renderFlag = false;
      map.resizeMap({
        tilesAccross,
        tilesDown
      })
      editorInstance.renderManager.camera.setBounds(
        editorInstance.renderManager.mapModel.getWorldWidth(),
        editorInstance.renderManager.mapModel.getWorldHeight()
      )
      const editorCanvas = document.getElementById('editorCanvas');
      editorInstance.renderManager.camera.setSize(
        editorCanvas.getBoundingClientRect().width,
        editorCanvas.getBoundingClientRect().height
        )
        editorInstance.renderManager.camera.setPosition(
          editorInstance.renderManager.camera.getX(),
          editorInstance.renderManager.camera.getY()
        )
      editorInstance.renderManager.renderFlag = true;
      editorInstance.Window_Resize();
      return map;
    });
  }
</script>
<div id="settingsDialog" class="dialogDummy">
  <h3>Settings</h3>
  <div id="mapSettingsContainer">
    <p>Change export and editor settings here.</p>
    <div>
      <ul class="marL-10 marR-10 marTB-10">
        <li class="marT-5">
          <h4>Map</h4>
        </li>
        <li class="marT-5">
          <span class="noPadding">Map Name:</span>
        </li>
        <li class="marT-5">
          <input type="text" bind:value={mapName} class="noPadding w150" id="settingsMapName" />
        </li>
        <li class="marT-5">
          <span class="noPadding">Tiles Accross:</span>
        </li>
        <li class="marT-5">
          <input type="text" bind:value={tilesAccross} class="noPadding w150" id="settingsTilesAccross" />
        </li>
        <li class="marT-5">
          <span class="noPadding">Tiles Down:</span>
        </li>
        <li class="marT-5">
          <input type="text" bind:value={tilesDown} class="noPadding w150" id="settingsTilesDown" />
        </li>
        <li class="marT-5">
          <input type="text" class="noPadding w150" id="settingsTileHeight" />
        </li>
        <li class="marTB-10">
          <a class="button" on:click={() => onSaveSettings()}>Save Changes</a>
        </li>
      </ul>

      <ul class="marL-10 marR-10 marTB-10">
        <li class="marT-5">
          <h4>Editor</h4>
        </li>
        <li class="marT-5">
          <span>Show Grid:</span>
        </li>
        <li class="marT-5">
          <input
            type="checkbox"
            checked={editorInstance.gridEnabled}
            on:change={() => {onGridEnabledToggle()}}
            class="noPadding"
            id="settingsToggleGrid" />
        </li>
      </ul>
    </div>
  </div>
</div>
