import { useRef, useState } from 'react'
import { Button, Select, Space } from 'antd'
import { ArrowRightOutlined, CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import { useAppDispatch } from '../../store/hooks'
import { success } from '../../store/message/message.slice'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import htmlSample from '../../data/html-sample.minified.html?raw'
import beautifyHtml from '../../utils/beautifyHtml.utils'

export interface IOptionTypes {
  html: string,
	tabSize: number
}

const HtmlFormatter = () => {
	const dispatch = useAppDispatch()
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		html: '',
		tabSize: 2
	})

	const generateSample = () => {
		onHtmlChange(htmlSample)
		codeEditorRef.current?.setValue(options.current.html)
	}

	const [formattedHtml, setFormattedHtml] = useState<string|null>(null)

	const format = () => {
		const formattedHtml = formatHtml(options.current)
		setFormattedHtml(formattedHtml)
		dispatch(success())
	}

	const formatHtml = (options: IOptionTypes) => {
		const formattedHtml = beautifyHtml(options.html, {
			indentSize: options.tabSize
		})

		return formattedHtml
	}

	const copyOutput = () => {
		copyText(formattedHtml!)
	}

	const onHtmlChange = (html: string) => {
		options.current.html = html
	}

	const onTabSizeChange = (tabSize: number) => {
		options.current.tabSize = tabSize
		const formattedHtml = formatHtml(options.current)
		setFormattedHtml(formattedHtml)
	}

	return (
		<InputOutputLayout
			InputToolbar={
				<Space>
					<Button size='large' onClick={generateSample}>
						Sample
					</Button>
					<Button type="primary" icon={<ArrowRightOutlined />} size='large' onClick={format}>
						Format
					</Button>
				</Space>
			}

			InputView={
				<CodeEditor ref={codeEditorRef} code={options.current.html} language='html' onChange={onHtmlChange} />
			}

			OutputToolbar={
				formattedHtml === null ? <></> :
				<Space>
					<Select
						defaultValue={2}
						options={[
							{ value: 2, label: <>2 spaces</> },
							{ value: 4, label: <>4 spaces</> }
						]}
						onChange={onTabSizeChange}
					/>
					<Button icon={<CopyOutlined />} onClick={copyOutput}>
						Copy
					</Button>
				</Space>
			}

			OutputView={
				<CodeEditor code={formattedHtml} language='html' readonly />
			}
		/>
	)
}

export default HtmlFormatter