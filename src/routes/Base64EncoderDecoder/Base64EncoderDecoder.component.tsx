import { useCallback, useRef, useState } from 'react'
import { Button, Space, Radio, RadioChangeEvent } from 'antd'
import { ArrowRightOutlined, CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import { useAppDispatch } from '../../store/hooks'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import textSample from '../../data/text-sample.txt?raw'
import encodeBase64 from '../../utils/encodeBase64.utils'
import decodeBase64 from '../../utils/decodeBase64.utils'
import decodeBase64Utf16 from '../../utils/decodeBase64Utf16.utils'
import encodeBase64Utf16 from '../../utils/encodeBase64Utf16.utils'
import { error, success } from '../../store/message/message.slice'

type IMode = 'encode' | 'decode'

export interface IOptionTypes {
  input: string
}

const Base64EncoderDecoder = () => {
	const dispatch = useAppDispatch()
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		input: ''
	})

	const [mode, setMode] = useState<IMode>('encode')
	const [output, setOutput] = useState('')

	const generateSample = () => {
		const sample = mode === 'decode' ? encodeBase64(textSample) : textSample
		onInputChange(sample)
		codeEditorRef.current?.setValue(sample)
	}

	const encodeDecode = useCallback((options: IOptionTypes, mode: IMode) => {
		let output = ''
		if (mode === 'decode') {
			let outputUtf8 = ''
			let outputUtf16 = ''
			let errors = 0

			try {
				outputUtf8 = decodeBase64(options.input)
			} catch (err) {
				errors++
			}

			try {
				outputUtf16 = decodeBase64Utf16(options.input)
			} catch (err) {
				errors++
			}

			if (errors === 2) {
				throw new Error()
			}

			if (outputUtf8 && !outputUtf16) {
				output = outputUtf8
			} else if (!outputUtf8 && outputUtf16) {
				output = outputUtf16
			} else if (outputUtf8 && outputUtf16) {
				let outputUtf8InvalidCount = 0
				let outputUtf16InvalidCount = 0

				for (let i = 0; i < outputUtf8.length; i++) {
					if (outputUtf8.charCodeAt(i) === 0) {
						outputUtf8InvalidCount++
					}
				}

				for (let i = 0; i < outputUtf16.length; i++) {
					if (outputUtf16.charCodeAt(i) === 0) {
						outputUtf16InvalidCount++
					}
				}

				if (outputUtf8InvalidCount > outputUtf16InvalidCount) {
					output = outputUtf16
				} else {
					output = outputUtf8
				}
			}
		} else {
			try {
				output = encodeBase64(options.input)
			} catch (err) {
				output = encodeBase64Utf16(options.input)
			}
		}
	
		return output
	}, [])

	const copyOutput = () => {
		copyText(output)
	}

	const onModeChange = (event: RadioChangeEvent) => {
		setMode(event.target.value)
	}

	const onInputChange = (text: string) => {
		options.current.input = text
	}

	const process = () => {
		try {
			const output = encodeDecode(options.current, mode)
			setOutput(output)
			dispatch(success())
		} catch (err) {
			dispatch(error('Invalid input'))
		}
	}

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
					<Button type="primary" icon={<ArrowRightOutlined />} size='large' onClick={process}>
						{mode === 'encode' ? 'Encode' : 'Decode'}
					</Button>
				</Space>
			}

			InputView={
				<CodeEditor ref={codeEditorRef} code='' language='text' onChange={onInputChange} />
			}

			OutputToolbar={
				output === null ? <></> :
				<Space>
					<Button icon={<CopyOutlined />} onClick={copyOutput}>
						Copy
					</Button>
				</Space>
			}

			OutputView={
				<CodeEditor code={output} language='text' readonly />
			}
		/>
	)
}

export default Base64EncoderDecoder