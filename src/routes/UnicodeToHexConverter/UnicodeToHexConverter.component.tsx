import { useRef } from 'react'
import { Button, Space } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import textSample from '../../data/text-sample.txt?raw'
import unicodeToHex from '../../utils/unicodeToHex.utils'

export interface IOptionTypes {
  text: string
}

const UnicodeToHexConverter = () => {
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)
	const outputCodeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		text: ''
	})

	const generateSample = () => {
		onTextChange(textSample)
		codeEditorRef.current?.setValue(options.current.text)
	}

	const hexText = useRef<string>('')

	const copyOutput = () => {
		copyText(hexText.current)
	}

	const onTextChange = (text: string) => {
		options.current.text = text
		hexText.current = unicodeToHex(text)
		outputCodeEditorRef.current!.setValue(hexText.current)
	}

	return (
		<InputOutputLayout
			InputToolbar={
				<Space>
					<Button size='large' onClick={generateSample}>
						Sample
					</Button>
				</Space>
			}

			InputView={
				<CodeEditor ref={codeEditorRef} code={options.current.text} language='text' onChange={onTextChange} />
			}

			OutputToolbar={
				<Space>
					<Button icon={<CopyOutlined />} onClick={copyOutput}>
						Copy
					</Button>
				</Space>
			}

			OutputView={
				<CodeEditor ref={outputCodeEditorRef} code={hexText.current} language='text' readonly />
			}
		/>
	)
}

export default UnicodeToHexConverter