import { FC, PropsWithChildren } from 'react'
import { Analytics } from '@vercel/analytics/react'

const AnalyticsProvider: FC<PropsWithChildren> = ({children}) => {
	return (
		<>
			{children}
			<Analytics />
		</>
	)
}

export default AnalyticsProvider