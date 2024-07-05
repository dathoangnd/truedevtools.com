import { useRef, useState } from 'react'
import { Button, Select, Space } from 'antd'
import { ArrowRightOutlined, CopyOutlined } from '@ant-design/icons'
import beautify from 'js-beautify'
import * as monaco from 'monaco-editor'
import { useAppDispatch } from '../../store/hooks'
import { success } from '../../store/message/message.slice'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import cssSample from '../../data/css-sample.minified.css?raw'

export interface IOptionTypes {
  css: string,
	tabSize: number
}

const CssFormatter = () => {
	const dispatch = useAppDispatch()
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		css: '',
		tabSize: 2
	})

	const generateSample = () => {
		onCssChange(cssSample)
		codeEditorRef.current?.setValue(options.current.css)
	}

	const [formattedCss, setFormattedCss] = useState<string|null>(null)

	const format = () => {
		const formattedCss = formatCss(options.current)
		setFormattedCss(formattedCss)
		dispatch(success())
	}

	const formatCss = (options: IOptionTypes) => {
		const formattedCss = beautify.css(options.css, {
			indent_size: options.tabSize
		})

		return formattedCss
	}

	const copyOutput = () => {
		copyText(formattedCss!)
	}

	const onCssChange = (css: string) => {
		options.current.css = css
	}

	const onTabSizeChange = (tabSize: number) => {
		options.current.tabSize = tabSize
		const formattedCss = formatCss(options.current)
		setFormattedCss(formattedCss)
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
				<CodeEditor ref={codeEditorRef} code={options.current.css} language='css' onChange={onCssChange} />
			}

			OutputToolbar={
				formattedCss === null ? <></> :
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
				<CodeEditor code={formattedCss} language='css' readonly />
			}
		/>
	)
}

export default CssFormatter