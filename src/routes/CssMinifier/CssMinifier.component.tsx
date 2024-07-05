import { useRef, useState } from 'react'
import { Button, Space } from 'antd'
import { ArrowRightOutlined, CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import { useAppDispatch } from '../../store/hooks'
import { success } from '../../store/message/message.slice'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import cssSample from '../../data/css-sample.css?raw'
import minifyCss from '../../utils/minifyCss.utils'

export interface IOptionTypes {
  css: string
}

const CssMinifier = () => {
	const dispatch = useAppDispatch()
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		css: ''
	})

	const generateSample = () => {
		onCssChange(cssSample)
		codeEditorRef.current?.setValue(cssSample)
	}

	const [minifiedCss, setMinifiedCss] = useState<string|null>(null)

	const minify = () => {
		const minifiedCss = minifyCss(options.current.css)
		setMinifiedCss(minifiedCss)
		dispatch(success())
	}

	const copyOutput = () => {
		copyText(minifiedCss!)
	}

	const onCssChange = (css: string) => {
		options.current.css = css
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
				<CodeEditor ref={codeEditorRef} code={options.current.css} language='css' onChange={onCssChange} />
			}

			OutputToolbar={
				minifiedCss === null ? <></> :
				<Space>
					<Button icon={<CopyOutlined />} onClick={copyOutput}>
						Copy
					</Button>
				</Space>
			}

			OutputView={
				<CodeEditor code={minifiedCss} language='css' readonly />
			}
		/>
	)
}

export default CssMinifier