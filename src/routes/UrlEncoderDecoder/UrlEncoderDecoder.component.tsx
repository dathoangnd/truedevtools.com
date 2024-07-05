import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Radio, RadioChangeEvent, Space } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'

type IMode = 'encode' | 'decode'

export interface IOptionTypes {
  text: string
}

const UrlEncoderDecoder = () => {
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)
	const outputCodeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		text: ''
	})

	const [mode, setMode] = useState<IMode>('encode')

	const onModeChange = (event: RadioChangeEvent) => {
		setMode(event.target.value)
	}

	const generateSample = () => {
		const sampleUrl = 'https://example.com?title=Lorem ipsum dolor sit'
		if (mode === 'decode') {
			onTextChange(encodeURI(sampleUrl))
		} else {
			onTextChange(sampleUrl)
		}
		codeEditorRef.current?.setValue(options.current.text)
	}

	const output = useRef<string>('')

	const copyOutput = () => {
		copyText(output.current)
	}

	const onTextChange = useCallback((text: string) => {
		options.current.text = text
		if (mode === 'decode') {
			output.current = decodeURI(text)
		} else {
			output.current = encodeURI(text)
		}
		outputCodeEditorRef.current!.setValue(output.current)
	}, [mode])

	useEffect(() => {
		onTextChange(options.current.text)
	}, [mode, onTextChange])

	return (
		<InputOutputLayout
			InputToolbar={
				<Space>
					<Radio.Group value={mode} onChange={onModeChange}>
						<Radio value='encode'>Encode</Radio>
						<Radio value='decode'>Decode</Radio>
					</Radio.Group>
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
				<CodeEditor ref={outputCodeEditorRef} code={output.current} language='text' readonly />
			}
		/>
	)
}

export default UrlEncoderDecoder