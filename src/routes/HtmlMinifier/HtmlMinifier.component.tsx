import { useRef, useState } from 'react'
import { Button, Space } from 'antd'
import { ArrowRightOutlined, CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import { useAppDispatch } from '../../store/hooks'
import { success } from '../../store/message/message.slice'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import htmlSample from '../../data/html-sample.html?raw'
import minifyHtml from '../../utils/minifyHtml.utils'

export interface IOptionTypes {
  html: string
}

const HtmlMinifier = () => {
	const dispatch = useAppDispatch()
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		html: ''
	})

	const generateSample = () => {
		onHtmlChange(htmlSample)
		codeEditorRef.current?.setValue(htmlSample)
	}

	const [minifiedHtml, setMinifiedHtml] = useState<string|null>(null)

	const minify = () => {
		const minifiedHtml = minifyHtml(options.current.html)
		setMinifiedHtml(minifiedHtml)
		dispatch(success())
	}

	const copyOutput = () => {
		copyText(minifiedHtml!)
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
					<Button type="primary" icon={<ArrowRightOutlined />} size='large' onClick={minify}>
						Minify
					</Button>
				</Space>
			}

			InputView={
				<CodeEditor ref={codeEditorRef} code={options.current.html} language='html' onChange={onHtmlChange} />
			}

			OutputToolbar={
				minifiedHtml === null ? <></> :
				<Space>
					<Button icon={<CopyOutlined />} onClick={copyOutput}>
						Copy
					</Button>
				</Space>
			}

			OutputView={
				<CodeEditor code={minifiedHtml} language='html' readonly />
			}
		/>
	)
}

export default HtmlMinifier