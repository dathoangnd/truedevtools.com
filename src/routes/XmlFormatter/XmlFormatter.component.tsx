import { useRef, useState } from 'react'
import { Button, Select, Space } from 'antd'
import { ArrowRightOutlined, CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import { useAppDispatch } from '../../store/hooks'
import { success } from '../../store/message/message.slice'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import xmlSample from '../../data/xml-sample.minified.xml?raw'
import beautifyXml from '../../utils/beautifyHtml.utils'

export interface IOptionTypes {
  xml: string,
	tabSize: number
}

const XMLFormatter = () => {
	const dispatch = useAppDispatch()
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		xml: '',
		tabSize: 2
	})

	const generateSample = () => {
		onXmlChange(xmlSample)
		codeEditorRef.current?.setValue(options.current.xml)
	}

	const [formattedXml, setFormattedXml] = useState<string|null>(null)

	const format = () => {
		const formattedXml = formatXml(options.current)
		setFormattedXml(formattedXml)
		dispatch(success())
	}

	const formatXml = (options: IOptionTypes) => {
		const formattedXml = beautifyXml(options.xml, {
			indentSize: options.tabSize
		})

		return formattedXml
	}

	const copyOutput = () => {
		copyText(formattedXml!)
	}

	const onXmlChange = (xml: string) => {
		options.current.xml = xml
	}

	const onTabSizeChange = (tabSize: number) => {
		options.current.tabSize = tabSize
		const formattedXml = formatXml(options.current)
		setFormattedXml(formattedXml)
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
				<CodeEditor ref={codeEditorRef} code={options.current.xml} language='xml' onChange={onXmlChange} />
			}

			OutputToolbar={
				formattedXml === null ? <></> :
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
				<CodeEditor code={formattedXml} language='xml' readonly />
			}
		/>
	)
}

export default XMLFormatter