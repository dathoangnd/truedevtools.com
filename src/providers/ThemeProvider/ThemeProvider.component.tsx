import { FC, PropsWithChildren, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ConfigProvider, theme } from 'antd'
import { selectTheme } from '../../store/theme/theme.selector'

const { defaultAlgorithm, darkAlgorithm } = theme  

const ThemeProvider: FC<PropsWithChildren> = ({children}) => {
	const theme = useSelector(selectTheme())

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme)
	}, [theme])

	return (
		<ConfigProvider
    theme={{
      algorithm: theme === 'dark' ? darkAlgorithm : defaultAlgorithm,
    }}>
			{children}
		</ConfigProvider>
	)
}

export default ThemeProvider