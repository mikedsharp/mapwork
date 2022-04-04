import '../styles/reset.scss'
import '../styles/mapwork.editor.structure.scss'
import '../styles/mapwork.editor.colourscheme.scss'
import '../styles/mapwork.editor.formatting.scss'

import App from './App.svelte'

import { EditorEnvironment } from './mapwork.editor.environment'
import { ChangeRecorder } from './mapwork.editor.changes'

const changeRecorder = new ChangeRecorder()
const editorInstance = new EditorEnvironment(changeRecorder)

const app = new App({
  target: document.getElementById('app'),
  props: {
    editorInstance,
  },
})

document.addEventListener('DOMContentLoaded',function () {
  'use strict'
  //Init Environment
  editorInstance.Init()
} );