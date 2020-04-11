<div id="publishDialog" class="leftDialog">
  <h3 class="textCentre">Export Map Bundle</h3>
  <div class="dialogContainer clearfix">
    <div id="publishDialogStepOne" class="dialogStep">
      <div id="" class="clearfix marTB-10">
        <ul>
          <li class="marT-5">
            <span>Select an output format</span>
          </li>
          <li class="marT-5">
            <select class="noPadding" id="publishSelectOutputFormat">
              <option value="JSON">JSON</option>
              <option value="XML">XML</option>
            </select>
          </li>
          <li class="marT-5">
            <span>Include all assets?</span>
          </li>
          <li class="marT-5">
            <input
              type="checkbox"
              id="publishIncludeAssets"
              checked="checked" />
          </li>
        </ul>
      </div>
      <div class="dialogButtonBox clearfix marT-5">
        <ul class="horizontalList">
          <li>
            <button
              type="button "
              class="button"
              id="publishButtonOK"
              title="Next">
              OK
            </button>
          </li>
          <li>
            <button
              type="button"
              class="button"
              id="publishButtonCancel"
              title="Cancel">
              Cancel
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div id="publishDialogPending" class="dialogStep">
      <ul>
        <li class="marT-5">
          <span class="block textCentre">
            Your mapwork Bundle is being prepared
          </span>
        </li>
        <li class="marT-5">
          <span class="block textCentre">Please Wait...</span>
        </li>
        <li class="marTB-20">
          <img class="centre block" src="/Images/360.gif" />
        </li>
      </ul>
      <div class="dialogButtonBox clearfix marT-5">
        <ul class="horizontalList">
          <li>
            <button
              type="button"
              class="button"
              id="publishButtonCancelPublish"
              title="Cancel">
              Cancel
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div id="publishDialogSuccess" class="dialogStep">
      <ul>
        <li class="marT-5">
          <span class="block textCentre">
            Your mapwork Bundle has been delivered!
          </span>
        </li>
      </ul>
      <div class="dialogButtonBox clearfix marT-5">
        <ul class="horizontalList">
          <li>
            <button
              type="button"
              class="button"
              id="publishButtonSuccessOK"
              title="Cancel">
              OK
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div id="publishDialogError" class="dialogStep" />
  </div>
</div>
