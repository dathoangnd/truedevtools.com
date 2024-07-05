import { useEffect, useState } from 'react'
import { Button, Space, Upload, UploadProps, Image, Empty, Form, InputNumber, Badge, Checkbox, FormProps } from 'antd'
import { ArrowRightOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons'
import { useAppDispatch } from '../../store/hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import { error, success } from '../../store/message/message.slice'
import imageToBase64 from '../../utils/imageToBase64.utils'
import isBase64Valid from '../../utils/isBase64Valid.utils'
import getImageFileDimension from '../../utils/getImageFileDimension.utils'
import resizeImage from '../../utils/resizeImage.utils'

export interface IOptionTypes {
	file: File|null,
	originalWidth: number|null,
	originalHeight: number|null,
	width: number|null,
	height: number|null,
  lockAspectRatio: boolean
}

interface IOutput {
	base64: string,
	width: number,
	height: number
}

const ImageResizer = () => {
	const dispatch = useAppDispatch()
	const [form] = Form.useForm()

	const [options, setOptions] = useState<IOptionTypes>({
		file: null,
		originalWidth: null,
		originalHeight: null,
		width: null,
		height: null,
		lockAspectRatio: true
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

	const resize = async () => {
		if (!options.file) {
			dispatch(error('Need to select an image'))
			return
		}

		let width = options.width
		let height = options.height
		if (width && !height) {
			height = Math.round(options.originalHeight! / options.originalWidth! * width)
		} else if (!width && height) {
			width = Math.round(options.originalWidth! / options.originalHeight! * height)
		} else if (!width && !height) {
			width = options.originalWidth!
			height = options.originalHeight!
		}

		const base64 = await resizeImage(options.file, width!, height!)
		setOutput({
			base64,
			width: width!,
			height: height!
		})

		dispatch(success())
	}

	const onImageSelect: UploadProps['onChange'] = async (info) => {
		const file = info.file.originFileObj!
		const previewImage = await imageToBase64(file)
		const dimension = await getImageFileDimension(file)
		setPreviewingImage(previewImage)
		setOptions({
			...options,
			file,
			originalWidth: dimension.width,
			originalHeight: dimension.height,
			width: dimension.width,
			height: dimension.height
		})
  }

	const onValuesChange: FormProps<IOptionTypes>['onValuesChange'] = (values: IOptionTypes) => {
		if (options.lockAspectRatio && (values.width === null || values.height === null)) {
			values = {
				...options,
				width: null,
				height: null
			}
		} else {
			values = {
				...options,
				...values
			}
	
			if (values.lockAspectRatio && options.file) {
				if (values.width && !values.height) {
					values.height = Math.round(options.originalHeight! / options.originalWidth! * values.width)
				} else if (!values.width && values.height) {
					values.width = Math.round(options.originalWidth! / options.originalHeight! * values.height)
				} else if (values.width && values.height) {
					if (values.width !== options.width) {
						values.height =  Math.round(options.originalHeight! / options.originalWidth! * values.width)
					} else if (values.height !== options.height) {
						values.width = Math.round(options.originalWidth! / options.originalHeight! * values.height)
					} else if (!options.lockAspectRatio) {
						values.height =  Math.round(options.originalHeight! / options.originalWidth! * values.width)
					}
				} else {
					values.width = null
					values.height = null
				}
			}
		}
		

		setOptions({
			...options,
			...values
		})
	}

	useEffect(() => {
		form.setFieldsValue(options)
	}, [form, options])

	return (
		<InputOutputLayout
			InputToolbar={
				<Space>
					<Button type="primary" icon={<ArrowRightOutlined />} size='large' onClick={resize}>
						Resize
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
					onValuesChange={onValuesChange}
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

					<div className='flex gap-4'>
						<Form.Item<IOptionTypes>
							label="Width"
							name="width"
							className='mt-8'
						>
							<InputNumber
								min={1}
								precision={0}
								placeholder="auto"
								className='w-full'
								addonAfter='px'
							/>
						</Form.Item>

						<Form.Item<IOptionTypes>
							label="Height"
							name="height"
							className='mt-8'
						>
							<InputNumber
								min={1}
								precision={0}
								placeholder="auto"
								className='w-full'
								addonAfter='px'
							/>
						</Form.Item>
					</div>

					<Form.Item<IOptionTypes>
						name="lockAspectRatio"
						valuePropName='checked'
					>
						<Checkbox>Lock aspect ratio</Checkbox>
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
									Width: {output.width}px
									<br />
									Height: {output.height}px
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

export default ImageResizer