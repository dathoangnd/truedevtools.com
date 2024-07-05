import { useRef, useState } from 'react'
import { Button, Select, Space } from 'antd'
import { ArrowRightOutlined, CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import { useAppDispatch } from '../../store/hooks'
import { success, error } from '../../store/message/message.slice'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import xmlSample from '../../data/xml-sample.xml?raw'
import xmlToJson from '../../utils/xmlToJson.utils'

export interface IOptionTypes {
  xml: string,
	tabSize: number
}

const XmlToJsonConverter = () => {
	const dispatch = useAppDispatch()
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		xml: '',
		tabSize: 2
	})

	const generateSample = async () => {
		onXmlChange(xmlSample)
		codeEditorRef.current?.setValue(options.current.xml)
	}

	const [convertedJson, setConvertedJson] = useState<string|null>(null)

	const convert = () => {
		try {
			convertXmlToJson()
			dispatch(success())
		} catch (err: unknown) {
			if ((err as Error).message.includes('outside of root node')) {
				dispatch(error('XML code needs to have a root node.'))
			} else {
				dispatch(error('Invalid XML'))
			}
		}
	}

	const copyOutput = () => {
		copyText(convertedJson!)
	}

	const onXmlChange = (xml: string) => {
		options.current.xml = xml
	}

	const onTabSizeChange = (tabSize: number) => {
		options.current.tabSize = tabSize
		try {
			convertXmlToJson()
		} catch (err) {
			// Do nothing
		}
	}

	const convertXmlToJson = () => {
		const convertedXml = xmlToJson({
			xml: options.current.xml,
			indentSize: options.current.tabSize
		})
		setConvertedJson(convertedXml)
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
				<CodeEditor ref={codeEditorRef} code={options.current.xml} language='xml' onChange={onXmlChange} />
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

export default XmlToJsonConverter