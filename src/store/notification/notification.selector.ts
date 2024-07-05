import { IRootState } from '..'

export const selectNotifications = () => (state: IRootState) => state.notification.notifications