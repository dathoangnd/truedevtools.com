import { useCallback, useRef, useState } from 'react'
import { Button, Drawer, Space, Typography } from 'antd'
import { BookOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import HtmlViewerComponent from '../../components/HtmlViewer/HtmlViewer.component'
import markdownSample from '../../data/markdown-sample.md?raw'
import markdownToHtml from '../../utils/markdownToHtml.utils'
import debounce from '../../utils/debounce.utils'

const cheatsheet = [
	{
		expressions: ['# H1', '## H2' , '### H3'],
		explanation: 'Headings'
	},
	{
		expressions: ['**Bold text**'],
		explanation: 'Bold'
	},
	{
		expressions: ['*Italic text*'],
		explanation: 'Italic'
	},
	{
		expressions: ['~~Strikethrough text~~'],
		explanation: 'Strikethrough'
	},
	{
		expressions: ['- List item'],
		explanation: 'Unordered list'
	},
	{
		expressions: ['[title](https://example.com)'],
		explanation: 'Link'
	},
	{
		expressions: ['![alt text](image.jpg)'],
		explanation: 'Image'
	},
	{
		expressions: ['`code`'],
		explanation: 'Code'
	},
	{
		expressions: ['> Blockquote'],
		explanation: 'Blockquote'
	},
	{
		expressions: ['---'],
		explanation: 'Horizontal line'
	}
]

export interface IOptionTypes {
  markdown: string
}

const MarkdownPreview = () => {
	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		markdown: ''
	})

	const generateSample = async () => {
		options.current.markdown = markdownSample
		codeEditorRef.current?.setValue(markdownSample)
		await updateMarkdownPreview()
	}

	const [viewingHtml, setViewingHtml] = useState<string|null>(null)

	const updateMarkdownPreview = useCallback(async () => {
		const html = await markdownToHtml(options.current.markdown)
		setViewingHtml(html)
	}, [])

	const onMarkdownChange = useCallback((markdown: string) => {
		options.current.markdown = markdown
		debounce(updateMarkdownPreview, 300)
	}, [updateMarkdownPreview])

	const [cheatsheetOpen, setCheatSheetOpen] = useState(false)

	const toggleCheatsheet = useCallback(() => {
		setCheatSheetOpen(!cheatsheetOpen)
	}, [cheatsheetOpen])

	return (
		<>
			<InputOutputLayout
				InputToolbar={
					<Space>
						<Button size='large' onClick={generateSample}>
							Sample
						</Button>
						<Button icon={<BookOutlined />} size='large' onClick={toggleCheatsheet}>
							Cheatsheet
						</Button>
					</Space>
				}

				InputView={
					<CodeEditor ref={codeEditorRef} code='' language='markdown' onChange={onMarkdownChange} />
				}

				OutputView={
					<HtmlViewerComponent html={viewingHtml} />
				}
			/>
			<Drawer title="Markdown cheatsheet" open={cheatsheetOpen} onClose={toggleCheatsheet}>
				{
				cheatsheet.map((item, index) => (
					<div className='flex justify-between items-center my-4' key={index}>
						<Space size='small'>
							{
							item.expressions.map((expression, index) => (
								<Typography.Text code key={index}>{expression}</Typography.Text>
							))
							}
						</Space>
						<p className='text-gray-700 dark:text-gray-300'>{item.explanation}</p>
					</div>					
				))
				}
      </Drawer>
		</>
	)
}

export default MarkdownPreview