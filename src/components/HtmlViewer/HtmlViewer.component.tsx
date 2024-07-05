import { FC, useEffect, useRef } from 'react'
import { Empty } from 'antd'
import { useSelector } from 'react-redux'
import { selectTheme } from '../../store/theme/theme.selector'

interface IHtmlViewerProps {
	html: string|null,
	white?: boolean,
	updatingFlag?: boolean
}

const HtmlViewer: FC<IHtmlViewerProps> = ({html, white, updatingFlag}) => {
	const theme = useSelector(selectTheme())
	const iframeRef = useRef<HTMLIFrameElement|null>(null)

	useEffect(() => {
		if (html === null) return

		iframeRef.current!.src = 'about:blank'

		setTimeout(() => {
			const iframeDoc = iframeRef.current!.contentDocument || iframeRef.current!.contentWindow!.document
			
			if (theme === 'dark') {
				if (white) {
					iframeDoc.body.style.backgroundColor = 'white'
				} else {
					iframeDoc.body.style.color = 'white'
				}
			}

			iframeDoc.body.innerHTML = html
		}, 100)
	}, [html, white, theme, updatingFlag])

	return (
		<>
			{
			html === null ?
			<div className='border border-solid border-gray-300 w-full h-full min-h-[250px] flex items-center justify-center'>
				<Empty />
			</div> :
			<iframe ref={iframeRef} className='border border-solid border-gray-300 w-full h-full min-h-[250px]'></iframe>
			}
		</>
	)
}

export default HtmlViewer