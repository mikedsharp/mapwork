window.$ = window.jQuery = require('jquery');
require('./jquery.jscrollpane.min.js');
require('./jquery.mousewheel.js');
require('./jquery.cookie.js');

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { EditorEnvironment } from './mapwork.editor.environment';
import { ChangeRecorder } from './mapwork.editor.changes';

import '../Content/reset.scss';
import '../Content/mapwork.editor.structure.scss';
import '../Content/mapwork.editor.colourscheme.scss';
import '../Content/mapwork.editor.formatting.scss';
import '../Content/jquery.jscrollpane.scss';

const changeRecorder = new ChangeRecorder();
const editor = new EditorEnvironment(changeRecorder);

$(document).ready(function() {
  'use strict';
  //Init Environment
  editor.Init();
});
