import { useEffect, useState } from 'react'
import { Button, Space, Upload, UploadProps, Image, Empty, Form, Badge, FormProps, Radio } from 'antd'
import { ArrowRightOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons'
import { useAppDispatch } from '../../store/hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import { error, success } from '../../store/message/message.slice'
import imageToBase64 from '../../utils/imageToBase64.utils'
import isBase64Valid from '../../utils/isBase64Valid.utils'
import convertImageFormat, { IImageFormat } from '../../utils/convertImageFormat.utils'
import { useLocation } from 'react-router'

export interface IOptionTypes {
	file: File|null,
  format: IImageFormat
}

interface IOutput {
	base64: string,
	format: IImageFormat
}

const ImageFormatConverter = () => {
	const dispatch = useAppDispatch()
	const location = useLocation()
	const [form] = Form.useForm()

	const [options, setOptions] = useState<IOptionTypes>({
		file: null,
		format: location.pathname === '/jpg-to-png-converter' ? 'png' : 'jpeg'
	})

	const [previewingImage, setPreviewingImage] = useState('')
	const [output, setOutput] = useState<IOutput|null>(null)

	useEffect(() => {
		const options: IOptionTypes = {
			file: null,
			format: location.pathname === '/jpg-to-png-converter' ? 'png' : 'jpeg'
		}
		setOptions(options)
		form.setFieldsValue(options)
		setPreviewingImage('')
		setOutput(null)
	}, [form, location])

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

	const convert = async () => {
		if (!options.file) {
			dispatch(error('Need to select an image'))
			return
		}

		const output = await convertImageFormat(options.file, options.format)
		setOutput({
			base64: output.base64,
			format: options.format
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

	const onValuesChange: FormProps<IOptionTypes>['onValuesChange'] = (values: IOptionTypes) => {
		setOptions({
			...options,
			...values
		})
	}

	return (
		<InputOutputLayout
			InputToolbar={
				<Space>
					<Button type="primary" icon={<ArrowRightOutlined />} size='large' onClick={convert}>
						Convert
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

					<Form.Item<IOptionTypes>
						label="Convert to format"
						name="format"
						rules={[{ required: true }]}
						className='mt-8'
					>
						<Radio.Group>
							<Radio.Button value='jpeg'>JPG</Radio.Button>
							<Radio.Button value='png'>PNG</Radio.Button>
							<Radio.Button value='webp'>WEBP</Radio.Button>
							<Radio.Button value='bmp'>BMP</Radio.Button>
							<Radio.Button value='gif'>GIF</Radio.Button>
						</Radio.Group>
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
						<Badge.Ribbon color='green' text={`Format: ${output.format.toUpperCase()}`}
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

export default ImageFormatConverter