import '../Content/reset.scss'
import '../Content/mapwork.editor.structure.scss'
import '../Content/mapwork.editor.colourscheme.scss'
import '../Content/mapwork.editor.formatting.scss'
import '../Content/jquery.jscrollpane.scss'

import App from './App.svelte'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

import { EditorEnvironment } from './mapwork.editor.environment'
import { ChangeRecorder } from './mapwork.editor.changes'

const changeRecorder = new ChangeRecorder()
const editorInstance = new EditorEnvironment(changeRecorder)

window.$ = window.jQuery = require('jquery')
require('./jquery.jscrollpane.min.js')
require('./jquery.mousewheel.js')
require('./jquery.cookie.js')

const app = new App({
  target: document.getElementById('app'),
  props: {
    editorInstance
  },
})

$(document).ready(function () {
  'use strict'
  //Init Environment
  editorInstance.Init()
})
