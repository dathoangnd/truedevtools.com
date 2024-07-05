import { useRef, useState } from 'react'
import { Alert, Button, Form, Space } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import originalTextSample from '../../data/text-sample.original.txt?raw'
import changedTextSample from '../../data/text-sample.changed.txt?raw'
import debounce from '../../utils/debounce.utils'
import SingleColumnLayout from '../../layouts/SingleColumnLayout/SingleColumnLayout.component'
import DiffCodeViewer from '../../components/DiffCodeViewer/DiffCodeViewer.component'

export interface IOptionTypes {
	originalText: string|null,
	changedText: string|null
}

const TextDiffChecker = () => {
	const originalTextEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)
	const changedTextEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)
	const comparingDiffEditorRef = useRef<monaco.editor.IStandaloneDiffEditor>(null)
	const comparingDiffEditorDivRef = useRef<HTMLDivElement>(null)
	const [form] = Form.useForm()

	const options = useRef<IOptionTypes>({
		originalText: '',
		changedText: ''
	})

	const [comparingOptions, setComparingOptions] = useState<IOptionTypes>({
		originalText: null,
		changedText: null
	})

	const generateSample = () => {
		options.current.originalText = originalTextSample
		options.current.changedText = changedTextSample

		originalTextEditorRef.current!.setValue(originalTextSample)
		changedTextEditorRef.current!.setValue(changedTextSample)
	}

	const onOriginalTextChange = (newText: string) => {
		options.current.originalText = newText
	}

	const onChangedTextChange = (newText: string) => {
		options.current.changedText = newText
	}

	const checkDifference = () => {
		setComparingOptions({
			originalText: options.current.originalText,
			changedText: options.current.changedText
		})

		debounce(() => {
			comparingDiffEditorDivRef.current!.scrollIntoView()
		}, 100)
	}

	return (
		<SingleColumnLayout
			View={
				<Form
					form={form}
					layout='vertical'
					size='large'
					requiredMark='optional'
				>
					<div className='w-full flex flex-col md:flex-row gap-8'>
						<Form.Item<IOptionTypes>
							label="Original text"
							required={true}
							className='basis-0 grow'
						>
							<div className='h-[250px]'>
								<CodeEditor ref={originalTextEditorRef} code={options.current.originalText} language='text' onChange={onOriginalTextChange} />
							</div>
						</Form.Item>

						<Form.Item<IOptionTypes>
							label="Changed text"
							required={true}
							className='basis-0 grow'
						>
							<div className='h-[250px]'>
								<CodeEditor ref={changedTextEditorRef} code={options.current.changedText} language='text' onChange={onChangedTextChange} />
							</div>
						</Form.Item>
					</div>

					<div className='text-center mt-4 mb-8'>
						<Space>
							<Button size='large' onClick={generateSample}>
								Sample
							</Button>
							<Button type="primary" icon={<ArrowRightOutlined />} size='large' onClick={checkDifference}>
								Check difference
							</Button>
						</Space>
					</div>

					{
					comparingOptions.originalText !== null && comparingOptions.changedText !== null &&
					<div className='scroll-mt-32 h-[500px]' ref={comparingDiffEditorDivRef}>
						{
						comparingOptions.originalText === comparingOptions.changedText &&
						<Alert message="The texts are identical." type="success" className='text-center mb-8' />
						}

						<DiffCodeViewer
							ref={comparingDiffEditorRef}
							original={comparingOptions.originalText}
							modified={comparingOptions.changedText}
							language='text'
						/>
					</div>
					}
				</Form>
			}
		/>
	)
}

export default TextDiffChecker