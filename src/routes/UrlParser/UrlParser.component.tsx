import { Form, Button, FormProps, Input, Space, Typography, List, Empty } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import { useMemo, useRef, useState } from 'react'
import { useAppDispatch } from '../../store/hooks'
import { error, success } from '../../store/message/message.slice'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'

interface IOptionTypes {
  url: string
}

const UrlParser = () => {
	const dispatch = useAppDispatch()

	const [form] = Form.useForm()
	const options = useRef<IOptionTypes>({
		url: ''
	})

	const [outputUrl, setOutputUrl] = useState<URL|null>(null)

	const queryParams = useMemo(() => {
		const queryParams: {
			key: string,
			value: string
		}[] = []

		if (!outputUrl) return queryParams

		const urlSearchParams = new URLSearchParams(outputUrl.search.slice(1))
		for (const [key, value] of urlSearchParams) {
			queryParams.push({
				key,
				value
			})
		}

		return queryParams
	}, [outputUrl])

	const generateSample = () => {
		const sampleUrl = 'https://example.com/lorem-ipsum?title=dolor sit#first-section'
		options.current.url = sampleUrl
		form.setFieldsValue({url: sampleUrl})
	}

	const onValuesChange: FormProps<IOptionTypes>['onValuesChange'] = (values: IOptionTypes) => {
		options.current = {
			...options.current,
			...values
		}
	}

	const parse = async () => {
		try {
			await form.validateFields()
		} catch (err) {
			dispatch(error('Invalid URL'))
			return
		}

		try {
			const outputUrl = new URL(options.current.url.trim())
			setOutputUrl(outputUrl)
			dispatch(success())
		} catch (err) {
			dispatch(error('Invalid URL'))
		}
	}

	return (
		<InputOutputLayout
			InputToolbar={
				<Space>
					<Button size='large' onClick={generateSample}>
						Sample
					</Button>
					<Button type="primary" icon={<ArrowRightOutlined />} size='large' onClick={parse}>
						Parse
					</Button>
				</Space>
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
						label="Enter the URL:"
						name="url"
						rules={[{ required: true }]}
					>
						<Input
							placeholder='https://example.com'
						/>
					</Form.Item>
				</Form>
			}

			OutputView={
				outputUrl === null ? (
					<div className='h-full min-h-[250px] flex items-center justify-center border border-solid border-gray-300'>
						<Empty />
					</div>
				) : (
					<List
						bordered
						className='text-base'
						dataSource={[
							{
								label: 'Protocol',
								value: outputUrl.protocol.replace(':', '')
							},
							{
								label: 'Hostname',
								value: outputUrl.hostname
							},
							{
								label: 'Path',
								value: outputUrl.pathname
							},
							{
								label: 'Query params',
								value: queryParams
							},
							{
								label: 'Hash',
								value: outputUrl.hash
							}
						]}
						renderItem={({label, value}) => (
							<List.Item>
								<div>
									<div className='font-semibold'>{label}:</div>
									{
									Array.isArray(value) ? (
										value.map(({key, value}, index) => (
											<Typography.Text key={index} copyable>{`${key} = ${value}`}</Typography.Text>
										))
									) :
									value ? 
									<Typography.Text copyable>{value}</Typography.Text> :
									<></>
									}
								</div>
							</List.Item>
						)}
					/>
				)
			}
		/>
	)
}

export default UrlParser