import { useEffect, useMemo, useState } from 'react'
import { ColorPicker, Form, Input } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import Color from 'color'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import useCopyText from '../../hooks/useCopyText.hooks'

export interface IOptionTypes {
  color: string
}

interface IOutput {
	hex: string,
	rgb: string,
	hsl: string,
	hsv: string,
	hwb: string,
	cmyk: string
}

const defaultOutput: IOutput = {
	hex: '',
	rgb: '',
	hsl: '',
	hsv: '',
	hwb: '',
	cmyk: ''
}

const ColorConverter = () => {
	const [inputForm] = Form.useForm()
	const [outputForm] = Form.useForm()
	const copyText = useCopyText()

	const [options, setOptions] = useState<IOptionTypes>({
		color: '#1677FF'
	})

	const colorObject = useMemo((): Color|null => {
		let colorValue: string | number[] = options.color.trim()
		let model: 'hsv'|'cmyk'|undefined = undefined

		if (colorValue.includes('hsv')) {
			colorValue = colorValue.slice(4, -1).split(',').map(number => parseFloat(number.trim()))
			model = 'hsv'
		} else if (colorValue.includes('cmyk')) {
			colorValue = colorValue.slice(5, -1).split(',').map(number => parseFloat(number.trim()))
			model = 'cmyk'
		}

		try {
			return Color(colorValue, model)
		} catch (err) {
			return null
		}
	}, [options])

	const previewingColor = useMemo((): string => {
		if (!colorObject) return '#000'

		return colorObject.hexa()
	}, [colorObject])

	const output = useMemo((): IOutput => {
		if (!colorObject) return defaultOutput

		const hsv = colorObject.hsv()
		const cmyk = colorObject.cmyk()
	
		return {
			hex: colorObject.alpha() === 1 ? colorObject.hex() : colorObject.hexa(),
			rgb: colorObject.rgb().toString(),
			hsl: colorObject.hsl().toString(),
			// @ts-expect-error Types incorrect
			hsv: `hsv(${Math.round(hsv.color[0])}, ${Math.round(hsv.color[1] * 10) / 10}%, ${Math.round(hsv.color[2] * 10) / 10}%${hsv.valpha < 1 ? `, ${hsv.valpha}` : ''})`,
			hwb: colorObject.hwb().toString(),
			// @ts-expect-error Types incorrect
			cmyk: `cmyk(${Math.round(cmyk.color[0])}%, ${Math.round(cmyk.color[1] * 10) / 10}%, ${Math.round(cmyk.color[2] * 10) / 10}%, ${Math.round(cmyk.color[3] * 10) / 10}%${cmyk.valpha < 1 ? `, ${cmyk.valpha}` : ''})`
		}
	}, [colorObject])

	useEffect(() => {
		outputForm.setFieldsValue(output)
	}, [outputForm, output])

	const onColorChange = (color: string) => {
		setOptions({
			...options,
			color
		})
	}

	useEffect(() => {
		inputForm.setFieldsValue(options)
	}, [inputForm, options])

	return (
		<InputOutputLayout
			InputView={
				<Form
					form={inputForm}
					layout="vertical"
					size='large'
					requiredMark='optional'
					initialValues={options}
					validateMessages={{
						required: 'This field is required'
					}}
				>
					<Form.Item<IOptionTypes>
						label="Select color:"
						name="color"
						rules={[{ required: true }]}
					>
						<div className='flex gap-4'>
							<ColorPicker value={previewingColor} onChange={(_, hex) => onColorChange(hex)} />
							<div className='grow'>
								<Input value={options.color} onChange={({target: {value}}) => onColorChange(value)} />
							</div>
						</div>
					</Form.Item>
				</Form>
			}

			OutputView={
				<Form
					form={outputForm}
					layout="vertical"
					size='large'
					requiredMark='optional'
					initialValues={output}
					validateMessages={{
						required: 'This field is required'
					}}
				>
					<Form.Item<IOutput>
						label="HEX"
						name="hex"
						rules={[{ required: true }]}
					>
						<Input
							readOnly
							suffix={
								<CopyOutlined
									className='cursor-pointer'
									onClick={() => copyText(output.hex)}
								/>
							}
						/>
					</Form.Item>

					<Form.Item<IOutput>
						label="RGB"
						name="rgb"
						rules={[{ required: true }]}
					>
						<Input
							readOnly
							suffix={
								<CopyOutlined
									className='cursor-pointer'
									onClick={() => copyText(output.rgb)}
								/>
							}
						/>
					</Form.Item>

					<Form.Item<IOutput>
						label="HSL"
						name="hsl"
						rules={[{ required: true }]}
					>
						<Input
							readOnly
							suffix={
								<CopyOutlined
									className='cursor-pointer'
									onClick={() => copyText(output.hsl)}
								/>
							}
						/>
					</Form.Item>

					<Form.Item<IOutput>
						label="HSV"
						name="hsv"
						rules={[{ required: true }]}
					>
						<Input
							readOnly
							suffix={
								<CopyOutlined
									className='cursor-pointer'
									onClick={() => copyText(output.hsv)}
								/>
							}
						/>
					</Form.Item>

					<Form.Item<IOutput>
						label="HWB"
						name="hwb"
						rules={[{ required: true }]}
					>
						<Input
							readOnly
							suffix={
								<CopyOutlined
									className='cursor-pointer'
									onClick={() => copyText(output.hwb)}
								/>
							}
						/>
					</Form.Item>

					<Form.Item<IOutput>
						label="CMYK"
						name="cmyk"
						rules={[{ required: true }]}
					>
						<Input
							readOnly
							suffix={
								<CopyOutlined
									className='cursor-pointer'
									onClick={() => copyText(output.cmyk)}
								/>
							}
						/>
					</Form.Item>
				</Form>
			}
		/>
	)
}

export default ColorConverter