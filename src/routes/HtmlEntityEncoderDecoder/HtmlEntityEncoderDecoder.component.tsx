import { useCallback, useRef, useState } from 'react'
import { Button, Space, Select, Radio, RadioChangeEvent } from 'antd'
import { ArrowRightOutlined, CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import {encode, decode} from 'html-entities'
import beautify from 'js-beautify'
import { useAppDispatch } from '../../store/hooks'
import { success } from '../../store/message/message.slice'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import htmlSample from '../../data/html-sample.html?raw'

type IMode = 'encode' | 'decode'

export interface IOptionTypes {
  html: string,
	tabSize: number
}

const HtmlEntityEncoderDecoder = () => {
	const dispatch = useAppDispatch()
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		html: '',
		tabSize: 2
	})

	const [mode, setMode] = useState<IMode>('encode')

	const generateSample = () => {
		const sample = mode === 'decode' ? encode(htmlSample) : htmlSample
		onHtmlChange(sample)
		codeEditorRef.current?.setValue(sample)
	}

	const [processedHtml, setProcessedHtml] = useState<string|null>(null)

	const encodeDecode = useCallback((options: IOptionTypes, mode: IMode) => {
		let processedHtml = ''
		if (mode === 'decode') {
			processedHtml = decode(options.html)
			processedHtml = beautify.html(processedHtml, {
				indent_size: options.tabSize
			})
		} else {
			processedHtml = beautify.html(options.html, {
				indent_size: options.tabSize
			})
			processedHtml = encode(processedHtml)
		}
	
		return processedHtml
	}, [])

	const copyOutput = () => {
		copyText(processedHtml!)
	}

	const onModeChange = (event: RadioChangeEvent) => {
		setMode(event.target.value)
	}

	const onHtmlChange = (html: string) => {
		options.current.html = html
	}

	const onTabSizeChange = (tabSize: number) => {
		options.current.tabSize = tabSize
		const processedHtml = encodeDecode(options.current, mode)
		setProcessedHtml(processedHtml)
	}

	const process = () => {
		const processedHtml = encodeDecode(options.current, mode)
		setProcessedHtml(processedHtml)
		dispatch(success())
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
				<CodeEditor ref={codeEditorRef} code={options.current.html} language='html' onChange={onHtmlChange} />
			}

			OutputToolbar={
				processedHtml === null ? <></> :
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
				<CodeEditor code={processedHtml} language='html' readonly />
			}
		/>
	)
}

export default HtmlEntityEncoderDecoder