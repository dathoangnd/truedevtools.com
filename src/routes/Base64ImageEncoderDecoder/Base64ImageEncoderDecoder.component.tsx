import { useRef, useState } from 'react'
import { Button, Space, Radio, RadioChangeEvent, Upload, UploadProps, Image, Empty } from 'antd'
import { ArrowRightOutlined, CopyOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import { useAppDispatch } from '../../store/hooks'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import { error } from '../../store/message/message.slice'
import imageToBase64 from '../../utils/imageToBase64.utils'
import isBase64Valid from '../../utils/isBase64Valid.utils'

type IMode = 'encode' | 'decode'

export interface IOptionTypes {
	file: File|null,
  base64: string
}

const Base64ImageEncoderDecoder = () => {
	const dispatch = useAppDispatch()
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		file: null,
		base64: ''
	})

	const [mode, setMode] = useState<IMode>('encode')
	const [previewingImage, setPreviewingImage] = useState('')
	const [output, setOutput] = useState<string|null>(null)

	const copyOutput = () => {
		copyText(output!)
	}

	const downloadOutput = () => {
		if (!output) return

		let ext = 'png'
		const base64Prefix = /^data:image\/\w+;/.exec(output)?.[0]
		if (base64Prefix) {
			ext = base64Prefix.slice(11, -1)
		}

		const link = document.createElement('a')
    link.href = output
    link.download = `decoded_image.${ext}`
    link.click()
	}

	const onModeChange = (event: RadioChangeEvent) => {
		options.current = {
			file: null,
			base64: ''
		}
		setPreviewingImage('')
		setOutput(null)
		setMode(event.target.value)
	}

	const onBase64Change = (base64: string) => {
		options.current.base64 = base64
	}

	const process = async () => {
		if (mode === 'decode') {
			let output = options.current.base64
			if (!output.includes(';base64,')) {
				output = 'data:image/png;base64,' + output
			}

			if (!isBase64Valid(output)) {
				dispatch(error('Invalid base64 text'))
				setOutput(null)
				return
			}

			setOutput(output)
		} else {
			if (!options.current.file) {
				dispatch(error('Need to select an image'))
				return
			}

			const output = await imageToBase64(options.current.file)
			setOutput(output)
		}
	}

	const onImageSelect: UploadProps['onChange'] = async (info) => {
		options.current.file = info.file.originFileObj!
		const previewImage = await imageToBase64(options.current.file)
		setPreviewingImage(previewImage)
  }

	return (
		<InputOutputLayout
			InputToolbar={
				<Space>
					<Radio.Group value={mode} onChange={onModeChange}>
						<Radio value='encode'>Encode</Radio>
						<Radio value='decode'>Decode</Radio>
					</Radio.Group>

					<Button type="primary" icon={<ArrowRightOutlined />} size='large' onClick={process}>
						{mode === 'encode' ? 'Encode' : 'Decode'}
					</Button>
				</Space>
			}

			InputView={
				mode === 'decode' ? (
					<CodeEditor ref={codeEditorRef} code='' language='text' onChange={onBase64Change} />
				)  : (
					<>
						<Upload
							name="image"
							accept="image/*"
							listType="picture-card"
							showUploadList={false}
							onChange={onImageSelect}
							customRequest={() => {}}
						>
							<button>
								<UploadOutlined />
								<div className='mt-2'>Select image</div>
							</button>
						</Upload>

						{
						isBase64Valid(previewingImage) &&
						<div className='mt-8 border border-solid border-gray-300 leading-0'>
							<Image
								src={previewingImage}
							/>
						</div>
						}
					</>
				)
			}

			OutputToolbar={
				output === null ? <></> :
				<Space>
					{
					mode === 'decode' ? (
						<Button icon={<DownloadOutlined />} onClick={downloadOutput}>
							Download
						</Button>
					) : (
						<Button icon={<CopyOutlined />} onClick={copyOutput}>
							Copy
						</Button>
					)
					}
				</Space>
			}

			OutputView={
				mode === 'decode' ? (
					output && isBase64Valid(output) ? (
						<div className='border border-solid border-gray-300 leading-0'>
							<Image
								src={output}
							/>
						</div>
					) : (
						<div className='h-full flex items-center justify-center border border-solid border-gray-300'>
							<Empty />
						</div>
					)
				) : (
					<CodeEditor code={output} language='text' readonly />
				)
			}
		/>
	)
}

export default Base64ImageEncoderDecoder