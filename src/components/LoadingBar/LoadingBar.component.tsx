import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import TopLoadingBar, { LoadingBarRef } from 'react-top-loading-bar'

const LoadingBar = () => {
	const location = useLocation()
	const ref = useRef<LoadingBarRef>(null)

	useEffect(() => {
		ref.current!.complete()
		ref.current!.continuousStart()
		
		setTimeout(() => {
			ref.current!.complete()
		}, 100)
	}, [location])

	return (
		<TopLoadingBar
			ref={ref}
			color='#FF9800'
			height={3}
			waitingTime={500}
		/>
	)
}

export default LoadingBar