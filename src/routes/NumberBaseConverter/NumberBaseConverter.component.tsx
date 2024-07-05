import { useEffect, useState } from 'react'
import { Form, FormProps, Input, Select } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import useCopyText from '../../hooks/useCopyText.hooks'
import convertDecimalToBase from '../../utils/convertDecimalToBase.utils'
import convertBaseToDecimal from '../../utils/convertBaseToDecimal.utils'

export interface IOptionTypes {
  base: number,
	value: string
}

interface IOutput {
	binary: string,
	octal: string,
	decimal: string,
	hex: string
}

const NumberBaseConverter = () => {
	const [inputForm] = Form.useForm()
	const [outputForm] = Form.useForm()
	const copyText = useCopyText()

	const [options, setOptions] = useState<IOptionTypes>({
		base: 10,
		value: '100'
	})

	const [output, setOutput] = useState<IOutput>({
		binary: '',
		octal: '',
		decimal: '',
		hex: ''
	})

	useEffect(() => {
		let value = options.value.trim()
		if (!value) value = '0'

		try {
			const decimalValue = convertBaseToDecimal(value, options.base)
		
			setOutput({
				binary: convertDecimalToBase(decimalValue, 2),
				octal: convertDecimalToBase(decimalValue, 8),
				decimal: String(decimalValue),
				hex: convertDecimalToBase(decimalValue, 16)
			})
		} catch (err) {
			setOutput({
				binary: '',
				octal: '',
				decimal: '',
				hex: ''
			})
		}
	}, [options])

	useEffect(() => {
		outputForm.setFieldsValue(output)
	}, [outputForm, output])

	const onValuesChange: FormProps<IOptionTypes>['onValuesChange'] = (values: IOptionTypes) => {
		setOptions({
			...options,
			...values
		})
	}

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
					onValuesChange={onValuesChange}
				>
					<Form.Item<IOptionTypes>
						label="Select base:"
						name="base"
						rules={[{ required: true }]}
					>
						<Select
							options={[
								{ value: 2, label: <>Base 2 (Binary)</> },
								{ value: 8, label: <>Base 8 (Octal)</> },
								{ value: 10, label: <>Base 10 (Decimal)</> },
								{ value: 16, label: <>Base 16 (Hex)</> },
							]}
						/>
					</Form.Item>

					<Form.Item<IOptionTypes>
						label="Value:"
						name="value"
						rules={[
							{ required: true },
							{
								validator: (_, value) => {
									try {
										convertBaseToDecimal(value, options.base)
										return Promise.resolve()
									} catch (err) {
										return Promise.reject((err as Error).message)
									}
								}
							}
						]}
					>
						<Input
							placeholder='0'
						/>
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
						label="Base 2 (Binary)"
						name="binary"
						rules={[{ required: true }]}
					>
						<Input
							readOnly
							suffix={
								<CopyOutlined
									className='cursor-pointer'
									onClick={() => copyText(output.binary)}
								/>
							}
						/>
					</Form.Item>

					<Form.Item<IOutput>
						label="Base 8 (Octal)"
						name="octal"
						rules={[{ required: true }]}
					>
						<Input
							readOnly
							suffix={
								<CopyOutlined
									className='cursor-pointer'
									onClick={() => copyText(output.octal)}
								/>
							}
						/>
					</Form.Item>

					<Form.Item<IOutput>
						label="Base 10 (Decimal)"
						name="decimal"
						rules={[{ required: true }]}
					>
						<Input
							readOnly
							suffix={
								<CopyOutlined
									className='cursor-pointer'
									onClick={() => copyText(output.decimal)}
								/>
							}
						/>
					</Form.Item>

					<Form.Item<IOutput>
						label="Base 16 (Hex)"
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
				</Form>
			}
		/>
	)
}

export default NumberBaseConverter