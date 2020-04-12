import { writable } from 'svelte/store'

export const NotificationConfig = writable({
  message: null,
  colour: null,
})
