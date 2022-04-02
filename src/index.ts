import '../styles/reset.scss'
import '../styles/mapwork.editor.structure.scss'
import '../styles/mapwork.editor.colourscheme.scss'
import '../styles/mapwork.editor.formatting.scss'

import App from './App.svelte'

import { EditorEnvironment } from './mapwork.editor.environment'
import { ChangeRecorder } from './mapwork.editor.changes'
import jquery from 'jquery';

const changeRecorder = new ChangeRecorder()
const editorInstance = new EditorEnvironment(changeRecorder)

//@ts-ignore
window.$ = jquery;
//@ts-ignore
window.jQuery  = window.$;

//@ts-ignore
const app = new App({
  target: document.getElementById('app'),
  props: {
    editorInstance,
  },
})
//@ts-ignore
$(document).ready(function () {
  'use strict'
  //Init Environment
  editorInstance.Init()
})
