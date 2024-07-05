import { Form, InputNumber, Button, FormProps, Checkbox } from 'antd'
import { ArrowRightOutlined, CopyOutlined } from '@ant-design/icons'
import { useRef, useState } from 'react'
import randomString from '../../utils/randomString.utils'
import { useAppDispatch } from '../../store/hooks'
import { error } from '../../store/message/message.slice'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'

interface IOptionTypes {
	quantity: number,
  length: number,
	allowUppercase: boolean,
	allowLowercase: boolean,
	allowDigits: boolean
}

const RandomStringGenerator = () => {
	const dispatch = useAppDispatch()
	const copyText = useCopyText()

	const [form] = Form.useForm()
	const options = useRef<IOptionTypes>({
		quantity: 5,
		length: 10,
		allowDigits: true,
		allowUppercase: true,
		allowLowercase: true
	})

	const onValuesChange: FormProps<IOptionTypes>['onValuesChange'] = (values: IOptionTypes) => {
		options.current = {
			...options.current,
			...values
		}
	}

	const [generatedTexts, setGeneratedTexts] = useState<string[]>([])

	const generate = async () => {
		try {
			await form.validateFields()
		} catch (err) {
			dispatch(error('Invalid options'))
			return
		}

		if (!options.current.allowUppercase && !options.current.allowLowercase && !options.current.allowDigits) {
			dispatch(error('At least 1 character set needs to be selected.'))
			return
		}

		const generatedTexts: string[] = []
		for (let i = 0; i < options.current.quantity; i++) {
			generatedTexts.push(randomString({
				length: options.current.length,
				allowUppercase: options.current.allowUppercase,
				allowLowercase: options.current.allowLowercase,
				allowDigits: options.current.allowDigits
			}))
		}

		setGeneratedTexts(generatedTexts)
	}

	const copyOutput = () => {
		copyText(generatedTexts.join('\n'))
	}

	return (
		<InputOutputLayout
			InputToolbar={
				<Button type="primary" icon={<ArrowRightOutlined />} size='large' onClick={generate}>
					Generate
				</Button>
			}

			InputView={
				<Form
					form={form}
					layout="vertical"
					size='large'
					requiredMark='optional'
					initialValues={options.current}
					validateMessages={{
						required: 'This field is required'
					}}
					onValuesChange={onValuesChange}
				>
					<Form.Item<IOptionTypes>
						label="How many strings to generate?"
						name="quantity"
						rules={[{ required: true }]}
					>
						<InputNumber
							min={1}
							max={1000}
							precision={0}
							placeholder="Enter a number"
							className='w-full'
						/>
					</Form.Item>

					<Form.Item<IOptionTypes>
						label="How long for each string?"
						name="length"
						rules={[{ required: true }]}
					>
						<InputNumber
							min={1}
							precision={0}
							placeholder="Enter a number"
							className='w-full'
							addonAfter='characters'
						/>
					</Form.Item>

					<Form.Item<IOptionTypes>
						name="allowUppercase"
						valuePropName='checked'
					>
						<Checkbox>Allow uppercase letters (A-Z)</Checkbox>
					</Form.Item>

					<Form.Item<IOptionTypes>
						name="allowLowercase"
						valuePropName='checked'
						className='-mt-4'
					>
						<Checkbox>Allow lowercase letters (a-z)</Checkbox>
					</Form.Item>

					<Form.Item<IOptionTypes>
						name="allowDigits"
						valuePropName='checked'
						className='-mt-4'
					>
						<Checkbox>Allow numeric digits (0-9)</Checkbox>
					</Form.Item>
				</Form>
			}

			OutputToolbar={
				generatedTexts.length == 0 ? <></> :
				<Button icon={<CopyOutlined />} onClick={copyOutput}>
					Copy
				</Button>
			}

			OutputView={
				<CodeEditor code={generatedTexts.length === 0 ? null : generatedTexts.join('\n')} language='text' readonly={true} />
			}
		/>
	)
}

export default RandomStringGenerator