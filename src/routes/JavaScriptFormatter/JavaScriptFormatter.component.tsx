import { useRef, useState } from 'react'
import { Button, Select, Space } from 'antd'
import { ArrowRightOutlined, CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import { useAppDispatch } from '../../store/hooks'
import { success } from '../../store/message/message.slice'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import jsSample from '../../data/js-sample.minified.js?raw'
import beautifyJs from '../../utils/beautifyJs.utils'

export interface IOptionTypes {
  js: string,
	tabSize: number
}

const JavaScriptFormatter = () => {
	const dispatch = useAppDispatch()
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		js: '',
		tabSize: 2
	})

	const generateSample = async () => {
		onJsChange(jsSample)
		codeEditorRef.current?.setValue(options.current.js)
	}

	const [formattedJs, setFormattedJs] = useState<string|null>(null)

	const format = () => {
		const formattedJs = formatJs(options.current)
		setFormattedJs(formattedJs)
		dispatch(success())
	}

	const formatJs = (options: IOptionTypes) => {
		const formattedJs = beautifyJs(options.js, {
			indentSize: options.tabSize
		})

		return formattedJs
	}

	const copyOutput = () => {
		copyText(formattedJs!)
	}

	const onJsChange = (js: string) => {
		options.current.js = js
	}

	const onTabSizeChange = (tabSize: number) => {
		options.current.tabSize = tabSize
		const formattedJs = formatJs(options.current)
		setFormattedJs(formattedJs)
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
				<CodeEditor ref={codeEditorRef} code={options.current.js} language='javascript' onChange={onJsChange} />
			}

			OutputToolbar={
				formattedJs === null ? <></> :
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
				<CodeEditor code={formattedJs} language='javascript' readonly />
			}
		/>
	)
}

export default JavaScriptFormatter