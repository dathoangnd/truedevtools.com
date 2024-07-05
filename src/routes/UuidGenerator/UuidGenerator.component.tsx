import { Form, InputNumber, Select, Button, Input, Flex, FormProps } from 'antd'
import { ArrowRightOutlined, CloseOutlined, CopyOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { validate } from 'uuid'
import generateUuid, { IUuidVersion } from '../../utils/generateUuid.utils'
import animals from '../../data/animals.json'
import { useAppDispatch } from '../../store/hooks'
import { error, success } from '../../store/message/message.slice'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'

export interface IOptionTypes {
  quantity: number,
  version: IUuidVersion,
	namespace?: string,
	name?: string
}

const UuidGenerator = () => {
	const dispatch = useAppDispatch()
	const copyText = useCopyText()

	const [form] = Form.useForm()
	const [options, setOptions] = useState<IOptionTypes>({
		quantity: 1,
		version: '4',
		namespace: '',
		name: ''
	})

	const generateNamespaceSample = () => {
		const namespaceSample = generateUuid({version: '1', quantity: 1})[0]
		form.setFieldsValue({namespace: namespaceSample})
		setOptions({
			...options,
			namespace: namespaceSample
		})
	}

	const generateNameSample = () => {
		const nameSampleIndex = Math.floor(Math.random() * animals.length)
		const nameSample = animals[nameSampleIndex]
		form.setFieldsValue({name: nameSample})
		setOptions({
			...options,
			name: nameSample
		})
	}

	const onValuesChange: FormProps<IOptionTypes>['onValuesChange'] = (values: IOptionTypes) => setOptions({
		...options,
		...values
	})

	const [uuidList, setUuidList] = useState<string[]>([])

	const generate = async () => {
		try {
			await form.validateFields()
		} catch (err) {
			dispatch(error('Invalid options'))
			return
		}

		const uuidList = generateUuid(options)
		setUuidList(uuidList)
		dispatch(success())
	}

	const copyOutput = () => {
		copyText(uuidList.join('\n'))
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
					initialValues={options}
					validateMessages={{
						required: 'This field is required'
					}}
					onValuesChange={onValuesChange}
				>
					<Form.Item<IOptionTypes>
						label="Version"
						name="version"
						rules={[{ required: true }]}
					>
						<Select
							options={[
								{value: '1', label: 'Version 1'},
								{value: '3', label: 'Version 3'},
								{value: '4', label: 'Version 4'},
								{value: '5', label: 'Version 5'}
							]}
						/>
					</Form.Item>
					{
					['1', '4'].includes(options.version) &&
					<Form.Item<IOptionTypes>
						label="How many to generate?"
						name="quantity"
						rules={[{ required: true }]}
					>
						<InputNumber
							min={1}
							max={1000}
							precision={0}
							addonBefore={<CloseOutlined className='text-gray-400' />}
							placeholder="Enter a number"
							className='w-full'
						/>
					</Form.Item>
					}
					{
					['3', '5'].includes(options.version) &&
					<>
						<Form.Item<IOptionTypes>
							label="Namespace"
							tooltip={'Must be a valid UUID in the format 00000000-0000-0000-0000-000000000000'}
							required={true}
						>
							<Flex gap='small'>
								<Form.Item<IOptionTypes>
									name="namespace"
									rules={[
										{ required: true },
										{
											validator: (_, value) => {
												if (!value) return Promise.resolve()

												if (validate(value)) {
													return Promise.resolve()
												} else {
													return Promise.reject('Not a valid UUID')
												}
											}
										}
									]}
									className='grow mb-2'
								>
									<Input />
								</Form.Item>
								<Button onClick={generateNamespaceSample}>
									sample
								</Button>
							</Flex>
						</Form.Item>

						<Form.Item<IOptionTypes>
							label="Name"
							tooltip={'Can be anything'}
							required={true}
						>
							<Flex gap='small'>
								<Form.Item<IOptionTypes>
									name="name"
									rules={[{ required: true }]}
									className='grow mb-2'
								>
									<Input />
								</Form.Item>
								<Button onClick={generateNameSample}>
									sample
								</Button>
							</Flex>
						</Form.Item>
					</>
					}
				</Form>
			}

			OutputToolbar={
				uuidList.length == 0 ? <></> :
				<Button icon={<CopyOutlined />} onClick={copyOutput}>
					Copy
				</Button>
			}

			OutputView={
				<CodeEditor code={uuidList.length === 0 ? null : uuidList.join('\n')} language='text' readonly={true} />
			}
		/>
	)
}

export default UuidGenerator