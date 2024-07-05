import { useRef } from 'react'
import { Button, Space } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import textSample from '../../data/text-sample.txt?raw'
import hexToUnicode from '../../utils/hexToUnicode.utils'
import unicodeToHex from '../../utils/unicodeToHex.utils'

export interface IOptionTypes {
  hex: string
}

const HexToUnicodeConverter = () => {
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)
	const outputCodeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		hex: ''
	})

	const generateSample = () => {
		onHexChange(unicodeToHex(textSample))
		codeEditorRef.current?.setValue(options.current.hex)
	}

	const unicodeText = useRef<string>('')

	const copyOutput = () => {
		copyText(unicodeText.current)
	}

	const onHexChange = (hex: string) => {
		options.current.hex = hex
		unicodeText.current = hexToUnicode(hex)
		outputCodeEditorRef.current!.setValue(unicodeText.current)
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
				<CodeEditor ref={codeEditorRef} code={options.current.hex} language='text' onChange={onHexChange} />
			}

			OutputToolbar={
				<Space>
					<Button icon={<CopyOutlined />} onClick={copyOutput}>
						Copy
					</Button>
				</Space>
			}

			OutputView={
				<CodeEditor ref={outputCodeEditorRef} code={unicodeText.current} language='text' readonly />
			}
		/>
	)
}

export default HexToUnicodeConverter