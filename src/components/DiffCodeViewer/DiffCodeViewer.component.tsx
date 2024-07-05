import { MutableRefObject, forwardRef, useEffect, useMemo, useRef } from 'react'
import { Empty } from 'antd'
import * as monaco from 'monaco-editor'
import { useSelector } from 'react-redux'
import { selectTheme } from '../../store/theme/theme.selector'

interface IDiffCodeViewerProps {
	original: string|null,
	modified: string|null,
	language: string,
	className?: string
}

const DiffCodeViewer = forwardRef<monaco.editor.IStandaloneDiffEditor, IDiffCodeViewerProps>(({original, modified, language, className}, ref) => {
	const theme = useSelector(selectTheme())
	const editorRef = useRef<HTMLDivElement|null>(null)
	const localEditor = useRef<monaco.editor.IStandaloneDiffEditor>()
	const editor = (ref || localEditor) as MutableRefObject<monaco.editor.IStandaloneDiffEditor>

	const wordWrap = useMemo((): 'on'|'off' => {
		if (language === 'text') return 'on'

		return 'off'
	}, [language])

	useEffect(() => {
		if (original === null || modified === null) return

		editor.current = monaco.editor.createDiffEditor(editorRef.current!, {
			theme: theme === 'dark' ? 'vs-dark' : '',
			enableSplitViewResizing: true,
			renderSideBySide:true,
			renderIndicators: true,
			fontSize: 14,
			contextmenu: false,
			readOnly: true,
			scrollBeyondLastLine: false,
			automaticLayout: true,
			ignoreTrimWhitespace: false,
			wordWrap,
			padding: {
				top: 16,
				bottom: 16
			},
			minimap: {
				enabled: false
			},
			scrollbar: {
				horizontalScrollbarSize: 8,
				verticalScrollbarSize: 8,
			}
		})

		editor.current.setModel({
			original: monaco.editor.createModel(original, language),
			modified: monaco.editor.createModel(modified, language),
		})

		return () => editor.current.dispose()
	}, [original, modified, language])

	useEffect(() => {
		monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : '')
	}, [theme])

	return (
		<div ref={editorRef} className={`border border-solid border-gray-300 h-full ${className}`}>
			{
			(original === null || modified === null) &&
			<div className='h-full flex items-center justify-center'>
				<Empty />
			</div>
			}
		</div>
	)
})

export default DiffCodeViewer