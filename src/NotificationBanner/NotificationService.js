import { NotificationConfig } from './NotificationStore';
export function DisplayNotification(message = '', colour = 'green') {
  NotificationConfig.set({ message, colour });
}
