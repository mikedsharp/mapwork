<div id="settingsDialog" class="dialogDummy ">
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
          <input type="text" class="noPadding w150" id="settingsMapName" />
        </li>
        <!--  @* <li class="marT-5">
              <span class="noPadding">Project Name:</span>
            </li>
            <li class="marT-5">
              <select class="noPadding w150" id="settingsSelectProject">
                <option value="-1">-- Select A Project --</option>
                <option value="0">Project A</option>
                <option value="1">Project B</option>
              </select>
            </li>*@ -->
        <li class="marT-5">
          <span class="noPadding">Tiles Accross:</span>
        </li>
        <li class="marT-5">
          <input type="text" class="noPadding w150" id="settingsTilesAccross" />
        </li>
        <li class="marT-5">
          <span class="noPadding">Tiles Down:</span>
        </li>
        <li class="marT-5">
          <input type="text" class="noPadding w150" id="settingsTilesDown" />
        </li>
        <!-- @* <li class="marT-5">
              <span class="noPadding">Tile Width: </span>
            </li>*@ -->
        <li class="marT-5">
          <input type="text" class="noPadding w150" id="settingsTileWidth" />
        </li>
        <!--@* <li class="marT-5">
              <span class="noPadding">Tile Height: </span>
            </li>*@ -->
        <li class="marT-5">
          <input type="text" class="noPadding w150" id="settingsTileHeight" />
        </li>
        <li class="marTB-10">
          <a class="button" id="settingsSaveChanges">Save Changes</a>
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
            checked
            class="noPadding"
            id="settingsToggleGrid" />
        </li>
      </ul>
    </div>
  </div>
</div>
