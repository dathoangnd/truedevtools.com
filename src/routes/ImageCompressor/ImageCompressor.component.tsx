import { useState } from 'react'
import { Button, Space, Upload, UploadProps, Image, Empty, Form, Slider, InputNumber, Badge } from 'antd'
import { ArrowRightOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons'
import { useAppDispatch } from '../../store/hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import { error, success } from '../../store/message/message.slice'
import imageToBase64 from '../../utils/imageToBase64.utils'
import isBase64Valid from '../../utils/isBase64Valid.utils'
import compressImage from '../../utils/compressImage.utils'

export interface IOptionTypes {
	file: File|null,
  level: number
}

interface IOutput {
	base64: string,
	originalSize: number,
	compressedSize: number
}

const ImageCompressor = () => {
	const dispatch = useAppDispatch()
	const [form] = Form.useForm()

	const [options, setOptions] = useState<IOptionTypes>({
		file: null,
		level: 7
	})

	const [previewingImage, setPreviewingImage] = useState('')
	const [output, setOutput] = useState<IOutput|null>(null)

	const downloadOutput = () => {
		if (!output) return

		let ext = 'png'
		const base64Prefix = /^data:image\/\w+;/.exec(output.base64)?.[0]
		if (base64Prefix) {
			ext = base64Prefix.slice(11, -1)
		}

		const link = document.createElement('a')
    link.href = output.base64
    const fileNameParts = options.file!.name.split('.')
		fileNameParts.pop()
    link.download = `${fileNameParts.join('.')}.${ext}`
    link.click()
	}

	const process = async () => {
		if (!options.file) {
			dispatch(error('Need to select an image'))
			return
		}

		const output = await compressImage(options.file, options.level)
		setOutput({
			base64: output.base64,
			originalSize: options.file.size,
			compressedSize: output.compressedSize
		})

		dispatch(success())
	}

	const onImageSelect: UploadProps['onChange'] = async (info) => {
		const file = info.file.originFileObj!
		const previewImage = await imageToBase64(file)
		setPreviewingImage(previewImage)
		setOptions({
			...options,
			file
		})
  }

	const onLevelChange = (level: number | null) => {
		setOptions({
			...options,
			level: level!
		})
	}

	return (
		<InputOutputLayout
			InputToolbar={
				<Space>
					<Button type="primary" icon={<ArrowRightOutlined />} size='large' onClick={process}>
						Compress
					</Button>
				</Space>
			}

			InputView={
				<Form
					form={form}
					layout="vertical"
					size='large'
					requiredMark='optional'
					initialValues={options}
					validateMessages={{
						required: 'This field is required'
					}}
				>
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

					<Form.Item<IOptionTypes>
						label="Compression level"
						name="level"
						rules={[{ required: true }]}
						className='mt-8'
					>
						<div className='flex gap-4'>
							<div className='grow'>
								<Slider
									min={1}
									max={10}
									value={options.level}
									onChange={onLevelChange}
								/>
							</div>
							<div className='basis-16'>
								<InputNumber
									min={1}
									max={10}
									value={options.level}
									onChange={onLevelChange}
								/>
							</div>
						</div>
					</Form.Item>
				</Form>
			}

			OutputToolbar={
				output === null ? <></> :
				<Space>
					<Button icon={<DownloadOutlined />} onClick={downloadOutput}>
						Download
					</Button>
				</Space>
			}

			OutputView={
				output && isBase64Valid(output.base64) ? (
					<div className='border border-solid border-gray-300 leading-0'>
						<Badge.Ribbon color='green' text={
								<>
									{
									output.compressedSize >= output.originalSize ?
										<></> :
										<>
											Saving: {100 - Math.floor(output.compressedSize * 100 / output.originalSize)}%
											<br />
										</>
									}
									
									New size: {Math.floor(output.compressedSize / 1000)} KB
								</>
							}
						>
							<Image
								src={output.base64}
							/>
						</Badge.Ribbon>
					</div>
				) : (
					<div className='h-full min-h-[250px] flex items-center justify-center border border-solid border-gray-300'>
						<Empty />
					</div>
				)
			}
		/>
	)
}

export default ImageCompressor