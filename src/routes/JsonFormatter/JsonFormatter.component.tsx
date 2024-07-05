import { useRef, useState } from 'react'
import { Button, Select, Space } from 'antd'
import { ArrowRightOutlined, CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import { useAppDispatch } from '../../store/hooks'
import { success } from '../../store/message/message.slice'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import jsonSample from '../../data/json-sample.minified.json?raw'
import beautifyJs from '../../utils/beautifyJs.utils'

export interface IOptionTypes {
  json: string,
	tabSize: number
}

const JsonFormatter = () => {
	const dispatch = useAppDispatch()
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		json: '',
		tabSize: 2
	})

	const generateSample = async () => {
		onJsonChange(jsonSample)
		codeEditorRef.current?.setValue(options.current.json)
	}

	const [formattedJson, setFormattedJson] = useState<string|null>(null)

	const format = () => {
		const formattedJs = formatJson(options.current)
		setFormattedJson(formattedJs)
		dispatch(success())
	}

	const formatJson = (options: IOptionTypes) => {
		const formattedJson = beautifyJs(options.json, {
			indentSize: options.tabSize
		})

		return formattedJson
	}

	const copyOutput = () => {
		copyText(formattedJson!)
	}

	const onJsonChange = (json: string) => {
		options.current.json = json
	}

	const onTabSizeChange = (tabSize: number) => {
		options.current.tabSize = tabSize
		const formattedJson = formatJson(options.current)
		setFormattedJson(formattedJson)
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
				<CodeEditor ref={codeEditorRef} code={options.current.json} language='json' onChange={onJsonChange} />
			}

			OutputToolbar={
				formattedJson === null ? <></> :
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
				<CodeEditor code={formattedJson} language='json' readonly />
			}
		/>
	)
}

export default JsonFormatter