import { useRef, useState } from 'react'
import { Button, Space } from 'antd'
import { ArrowRightOutlined, CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import { useAppDispatch } from '../../store/hooks'
import { success } from '../../store/message/message.slice'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import xmlSample from '../../data/xml-sample.xml?raw'
import minifyXml from '../../utils/minifyHtml.utils'

export interface IOptionTypes {
  xml: string
}

const XmlMinifier = () => {
	const dispatch = useAppDispatch()
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		xml: ''
	})

	const generateSample = () => {
		onXmlChange(xmlSample)
		codeEditorRef.current?.setValue(xmlSample)
	}

	const [minifiedXml, setMinifiedXml] = useState<string|null>(null)

	const minify = () => {
		const minifiedXml = minifyXml(options.current.xml)
		setMinifiedXml(minifiedXml)
		dispatch(success())
	}

	const copyOutput = () => {
		copyText(minifiedXml!)
	}

	const onXmlChange = (xml: string) => {
		options.current.xml = xml
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
				<CodeEditor ref={codeEditorRef} code={options.current.xml} language='xml' onChange={onXmlChange} />
			}

			OutputToolbar={
				minifiedXml === null ? <></> :
				<Space>
					<Button icon={<CopyOutlined />} onClick={copyOutput}>
						Copy
					</Button>
				</Space>
			}

			OutputView={
				<CodeEditor code={minifiedXml} language='xml' readonly />
			}
		/>
	)
}

export default XmlMinifier