<script lang="ts">

</script>

<div id="propertiesDialog" class="dialogDummy">
  <h3>Map Properties</h3>
  <div id="mapPropertiesContainer">
    <p>
      Add, remove and edit properties about the maps, layers and specific tile
      types.
    </p>
  </div>

  <div id="propertyFilterContainer" class="marL-10 marR-10">
    <ul class="marTB-10">
      <li class="marTB-10">
        <span>Property Scope:</span>
      </li>
      <li>
        <select
          name="propertyScope"
          class="noPadding w150"
          id="selectPropertyScope">
          <option value="-1">--Select Scope--</option>
          <option value="0">Map</option>
          <option value="1">Layer</option>
          <option value="2">Tile</option>
        </select>
      </li>
    </ul>
    <ul class="marTB-10" id="layerScopeContainer">
      <li class="marTB-10">
        <span>Select a Layer:</span>
      </li>
      <li>
        <select
          name="propertyScope"
          class="noPadding w150"
          id="selectLayerScope"
          disabled>
          <option value="-1">--Select Layer--</option>
          <option value="0">Layer 1</option>
          <option value="1">Collision Layer</option>
          <option value="2">Random Layer</option>
        </select>
      </li>
    </ul>
    <ul class="marTB-10" id="layerTileSelectContainer">
      <li>
        <span>Select a Tile:</span>
      </li>
      <li>
        <a id="propertiesInspectTile" />
      </li>
    </ul>
  </div>
  <div id="mapPropertiesListContainer" class="propertiesScroll">
    <div class="table" id="propertyTable">
      <div class="tableRow border">
        <div class="tableCell border">
          <span class="textCentered">Property</span>
        </div>
        <div class="tableCell border">
          <span class="textCentered">Value</span>
        </div>
      </div>
    </div>
  </div>
</div>
