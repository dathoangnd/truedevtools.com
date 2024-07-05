import { useAppDispatch } from '../store/hooks'
import { success } from '../store/message/message.slice'

const useCopyText = () => {
	const dispatch = useAppDispatch()

	return (text: string) => {
		navigator.clipboard.writeText(text)
		dispatch(success('Copied'))
	}
}

export default useCopyText