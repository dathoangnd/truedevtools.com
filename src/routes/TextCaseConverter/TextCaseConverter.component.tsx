import { useRef } from 'react'
import { Button, Select, Space } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import textSample from '../../data/text-sample.txt?raw'
import convertTextCase, {ITextCaseType} from '../../utils/convertTextCase.utils'

export interface IOptionTypes {
  text: string,
	textCase: ITextCaseType
}

const TextCaseConverter = () => {
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)
	const outputCodeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		text: '',
		textCase: 'uppercase'
	})

	const generateSample = () => {
		onTextChange(textSample)
		codeEditorRef.current?.setValue(options.current.text)
	}

	const convertedText = useRef<string>('')

	const copyOutput = () => {
		copyText(convertedText.current)
	}

	const onTextChange = (text: string) => {
		options.current.text = text
		convert(options.current)
	}

	const onTabSizeChange = (textCase: ITextCaseType) => {
		options.current.textCase = textCase
		convert(options.current)
	}

	const convert = (options: IOptionTypes) => {
		convertedText.current = convertTextCase(options.text, options.textCase)
		outputCodeEditorRef.current!.setValue(convertedText.current)
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
					<Select
						defaultValue={options.current.textCase}
						options={[
							{ value: 'uppercase', label: <>Uppercase</> },
							{ value: 'lowercase', label: <>Lowercase</> },
							{ value: 'capitalized', label: <>Capitalized</> }
						]}
						onChange={onTabSizeChange}
					/>
					<Button icon={<CopyOutlined />} onClick={copyOutput}>
						Copy
					</Button>
				</Space>
			}

			OutputView={
				<CodeEditor ref={outputCodeEditorRef} code={convertedText.current} language='text' readonly />
			}
		/>
	)
}

export default TextCaseConverter