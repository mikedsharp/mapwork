import { EditorEnvironment } from './mapwork.editor.environment';
import { ChangeRecorder } from './mapwork.editor.changes';

window.$ = window.jQuery = require('jquery');
const changeRecorder = new ChangeRecorder();
const editor = new EditorEnvironment(changeRecorder);
$(document).ready(function() {
  'use strict';
  //Init Environment
  editor.Init();
});
