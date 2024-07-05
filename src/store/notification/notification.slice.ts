import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { INotification } from './notification.types'

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [] as INotification[]
  },
  reducers: {
    pushNofication: (state, action: PayloadAction<INotification>) => {
      state.notifications.push(action.payload)
    },
		popNotification: (state) => {
			state.notifications.pop()
		}
  }
})

export const { pushNofication, popNotification } = notificationSlice.actions

export default notificationSlice.reducer