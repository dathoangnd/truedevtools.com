import { useRef, useState } from 'react'
import { Button, Space } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import { useAppDispatch } from '../../store/hooks'
import { success } from '../../store/message/message.slice'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import HtmlViewerComponent from '../../components/HtmlViewer/HtmlViewer.component'
import htmlSample from '../../data/html-sample.html?raw'

export interface IOptionTypes {
  html: string
}

const HtmlViewer = () => {
	const dispatch = useAppDispatch()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		html: ''
	})

	const generateSample = () => {
		onHtmlChange(htmlSample)
		codeEditorRef.current?.setValue(htmlSample)
	}

	const [viewingHtml, setViewingHtml] = useState<string|null>(null)
	const [updatingFlag, setUpdatingFlag] = useState(false)

	const view = () => {
		setViewingHtml(options.current.html)
		setUpdatingFlag(!updatingFlag)
		dispatch(success())
	}

	const onHtmlChange = (html: string) => {
		options.current.html = html
	}

	return (
		<InputOutputLayout
			InputToolbar={
				<Space>
					<Button size='large' onClick={generateSample}>
						Sample
					</Button>
					<Button type="primary" icon={<ArrowRightOutlined />} size='large' onClick={view}>
						View
					</Button>
				</Space>
			}

			InputView={
				<CodeEditor ref={codeEditorRef} code={options.current.html} language='html' onChange={onHtmlChange} />
			}

			OutputView={
				<HtmlViewerComponent html={viewingHtml} updatingFlag={updatingFlag} white />
			}
		/>
	)
}

export default HtmlViewer