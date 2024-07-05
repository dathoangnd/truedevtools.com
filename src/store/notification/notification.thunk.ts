import { IDispatch } from '..'
import { INotification } from './notification.types'
import { popNotification, pushNofication } from './notification.slice'

export const showNotification = (notification: INotification) => async (dispatch: IDispatch) => {
	dispatch(pushNofication(notification))

	setTimeout(() => {
		dispatch(popNotification())
	}, 3000)
}