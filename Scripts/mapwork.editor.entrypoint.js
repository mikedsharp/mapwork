window.$ = window.jQuery = require('jquery');
window.mapwork = window.mapwork || {};
$(document).ready(function() {
  'use strict';
  //Init Environment
  mapwork.editor.environment.Init();
  mapwork.rendermanager.Init();
  //   mapwork.worker.Init();
});
