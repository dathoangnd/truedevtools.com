import { useRef, useState } from 'react'
import { Button, Select, Space } from 'antd'
import { ArrowRightOutlined, CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import { useAppDispatch } from '../../store/hooks'
import { success, error } from '../../store/message/message.slice'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import yamlSample from '../../data/yaml-sample.yaml?raw'
import yamlToJson from '../../utils/yamlToJson.utils'

export interface IOptionTypes {
  yaml: string,
	tabSize: number
}

const YamlToJsonConverter = () => {
	const dispatch = useAppDispatch()
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		yaml: '',
		tabSize: 2
	})

	const generateSample = async () => {
		onYamlChange(yamlSample)
		codeEditorRef.current?.setValue(options.current.yaml)
	}

	const [convertedJson, setConvertedJson] = useState<string|null>(null)

	const convert = () => {
		try {
			convertYamlToJson()
			dispatch(success())
		} catch (err: unknown) {
			dispatch(error('Invalid YAML'))
		}
	}

	const copyOutput = () => {
		copyText(convertedJson!)
	}

	const onYamlChange = (yaml: string) => {
		options.current.yaml = yaml
	}

	const onTabSizeChange = (tabSize: number) => {
		options.current.tabSize = tabSize
		try {
			convertYamlToJson()
		} catch (err) {
			// Do nothing
		}
	}

	const convertYamlToJson = () => {
		const convertedYaml = yamlToJson({
			yaml: options.current.yaml,
			indentSize: options.current.tabSize
		})
		setConvertedJson(convertedYaml)
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
				<CodeEditor ref={codeEditorRef} code={options.current.yaml} language='yaml' onChange={onYamlChange} />
			}

			OutputToolbar={
				convertedJson === null ? <></> :
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
				<CodeEditor code={convertedJson} language='json' readonly />
			}
		/>
	)
}

export default YamlToJsonConverter