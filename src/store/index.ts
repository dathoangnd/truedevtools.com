import { configureStore } from '@reduxjs/toolkit'
import notificationSlice from './notification/notification.slice'
import messageSlice from './message/message.slice'
import themeSlice from './theme/theme.slice'

const store = configureStore({
  reducer: {
		notification: notificationSlice,
		message: messageSlice,
		theme: themeSlice
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({
		serializableCheck: false
	})
})

export type IRootState = ReturnType<typeof store.getState>
export type IDispatch = typeof store.dispatch

export default store