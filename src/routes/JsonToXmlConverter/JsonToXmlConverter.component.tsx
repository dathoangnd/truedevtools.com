import { useRef, useState } from 'react'
import { Button, Select, Space } from 'antd'
import { ArrowRightOutlined, CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import { useAppDispatch } from '../../store/hooks'
import { success, error } from '../../store/message/message.slice'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import jsonSample from '../../data/json-sample.json?raw'
import jsonToXml from '../../utils/jsonToXml.utils'

export interface IOptionTypes {
  json: string,
	tabSize: number
}

const JsonToXmlConverter = () => {
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

	const [convertedXml, setConvertedXml] = useState<string|null>(null)

	const convert = () => {
		try {
			convertJsonToXml()
			dispatch(success())
		} catch (err) {
			dispatch(error('Invalid JSON'))
		}
	}

	const copyOutput = () => {
		copyText(convertedXml!)
	}

	const onJsonChange = (json: string) => {
		options.current.json = json
	}

	const onTabSizeChange = (tabSize: number) => {
		options.current.tabSize = tabSize
		try {
			convertJsonToXml()
		} catch (err) {
			// Do nothing
		}
	}

	const convertJsonToXml = () => {
		const convertedXml = jsonToXml({
			json: options.current.json,
			indentSize: options.current.tabSize
		})
		setConvertedXml(convertedXml)
	}

	return (
		<InputOutputLayout
			InputToolbar={
				<Space>
					<Button size='large' onClick={generateSample}>
						Sample
					</Button>
					<Button type="primary" icon={<ArrowRightOutlined />} size='large' onClick={convert}>
						Convert
					</Button>
				</Space>
			}

			InputView={
				<CodeEditor ref={codeEditorRef} code={options.current.json} language='json' onChange={onJsonChange} />
			}

			OutputToolbar={
				convertedXml === null ? <></> :
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
				<CodeEditor code={convertedXml} language='xml' readonly />
			}
		/>
	)
}

export default JsonToXmlConverter