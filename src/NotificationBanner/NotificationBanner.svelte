<script>
  import { NotificationConfig } from './NotificationStore'
  import { fly } from 'svelte/transition'
  const NOTIFICATION_HEIGHT = 72
  const ANIMATION_DURATION = 200
  const NOTIFICATION_DELAY_TIME = 5000
  let visible = false
  let notificationConfig
  const unsubscribe = NotificationConfig.subscribe(config => {
    if (config.message) {
      notificationConfig = config
      visible = true
      window.setTimeout(() => {
        visible = false
      }, NOTIFICATION_DELAY_TIME)
    }
  })
</script>

<style lang="scss">
  .notification {
    position: absolute;
    left: 72px;
    right: 72px;
    top: 0px;
    z-index: 4;
    display: block;
    padding: 10px 0;
    background-color: var(--bannerColour);
    span {
      display: block;
      font-family: Verdana, Geneva, 'DejaVu Sans', sans-serif;
      font-size: 12px;
      font-weight: bold;
      color: #eee;
    }
  }
</style>

{#if visible}
  <div
    class="notification"
    style="--NOTIFICATION_HEIGHT:{NOTIFICATION_HEIGHT};--bannerColour:{notificationConfig.colour}"
    in:fly={{ y: -NOTIFICATION_HEIGHT, duration: ANIMATION_DURATION }}
    out:fly={{ y: -NOTIFICATION_HEIGHT, duration: ANIMATION_DURATION }}>
    <span class="textCentre">{notificationConfig.message}</span>
  </div>
{/if}
