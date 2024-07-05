import { useCallback, useRef, useState } from 'react'
import { Button, Space, Radio, RadioChangeEvent } from 'antd'
import { ArrowRightOutlined, CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import { useAppDispatch } from '../../store/hooks'
import { success } from '../../store/message/message.slice'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import jsonSample from '../../data/json-sample.json?raw'
import escapeText from '../../utils/escapeText.utils'
import unescapeText from '../../utils/unescapeText.utils'

type IMode = 'escape' | 'unescape'

export interface IOptionTypes {
  text: string
}

const BackslashEscapeUnescape = () => {
	const dispatch = useAppDispatch()
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		text: ''
	})

	const [mode, setMode] = useState<IMode>('escape')

	const generateSample = () => {
		const sample = mode === 'escape' ? jsonSample : escapeText(jsonSample)
		onTextChange(sample)
		codeEditorRef.current?.setValue(sample)
	}

	const [processedText, setProcessedText] = useState<string|null>(null)

	const escapeUnescape = useCallback((options: IOptionTypes, mode: IMode) => {
		let processedText = ''
		if (mode === 'unescape') {
			processedText = unescapeText(options.text)
		} else {
			processedText = escapeText(options.text)
		}
	
		return processedText
	}, [])

	const copyOutput = () => {
		copyText(processedText!)
	}

	const onModeChange = (event: RadioChangeEvent) => {
		setMode(event.target.value)
	}

	const onTextChange = (text: string) => {
		options.current.text = text
	}

	const process = () => {
		const processedText = escapeUnescape(options.current, mode)
		setProcessedText(processedText)
		dispatch(success())
	}

	return (
		<InputOutputLayout
			InputToolbar={
				<Space>
					<Radio.Group value={mode} onChange={onModeChange}>
						<Radio value='escape'>Escape</Radio>
						<Radio value='unescape'>Unescape</Radio>
					</Radio.Group>
					<Button size='large' onClick={generateSample}>
						Sample
					</Button>
					<Button type="primary" icon={<ArrowRightOutlined />} size='large' onClick={process}>
						{mode === 'escape' ? 'Escape' : 'Unescape'}
					</Button>
				</Space>
			}

			InputView={
				<CodeEditor ref={codeEditorRef} code={options.current.text} language='text' onChange={onTextChange} />
			}

			OutputToolbar={
				processedText === null ? <></> :
				<Space>
					<Button icon={<CopyOutlined />} onClick={copyOutput}>
						Copy
					</Button>
				</Space>
			}

			OutputView={
				<CodeEditor code={processedText} language='text' readonly />
			}
		/>
	)
}

export default BackslashEscapeUnescape