import { useEffect, useMemo, useState } from 'react'
import { Button, DatePicker, Empty, Form, FormProps, Input, List, Space, Typography } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useAppDispatch } from '../../store/hooks'
import { error } from '../../store/message/message.slice'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import moment from 'moment'
import styles from './UnixTimestampParser.module.scss'
import { Nullable } from '../../types/common'
import debounce from '../../utils/debounce.utils'

export interface IOptionTypes {
  timestamp: string
}

interface IOutput {
	timestamp: number,
	utcTime: string,
	localTime: string,
	dayOfYear: number,
	weekOfYear: number
}

const UnixTimestampParser = () => {
	const dispatch = useAppDispatch()
	const [form] = Form.useForm()

	const [options, setOptions] = useState<IOptionTypes>({
		timestamp: ''
	})

	useEffect(() => {
		form.setFieldsValue(options)
	}, [options, form])

	const generateSample = () => {
		const now = Date.now()
		onTimestampChange(String(now))
		form.setFieldsValue({
			timestamp: now
		})
	}

	const [output, setOutput] = useState<IOutput|null>(null)

	const parse = () => {
		try {
			const timeStamp = parseInt(options.timestamp)
			const momentObject = moment(String(timeStamp) === options.timestamp ? timeStamp : options.timestamp)

			if (isNaN(momentObject.valueOf())) {
				throw new Error()
			}

			const startOfYear = momentObject.clone().startOf('year')

			const output: IOutput = {
				timestamp: momentObject.valueOf(),
				utcTime: momentObject.toISOString(),
				localTime: momentObject.local().format('YYYY-MM-DD HH:mm:ss Z'),
				dayOfYear: momentObject.diff(startOfYear, 'days') + 1,
				weekOfYear: momentObject.week()
			}

			setOutput(output)
		} catch (err) {
			dispatch(error('Invalid timestamp'))
		}
	}

	const onTimestampChange = (timestamp: string) => {
		setOptions({
			...options,
			timestamp
		})
	}

	const onValuesChange: FormProps<IOptionTypes>['onValuesChange'] = (values: IOptionTypes) => {
		setOptions({
			...options,
			...values
		})
	}

	const datePickerValue = useMemo(() => {
		const timestamp: Nullable<number> = parseInt(options.timestamp)

		return dayjs(isNaN(timestamp) ? undefined : timestamp)
	}, [options])

	const onDatePickerChange = (_: string, dateString: string|string[]) => {
		const timestamp = new Date(dateString as string).getTime()
		onTimestampChange(String(timestamp))
	}

	const [showDatePicker, setShowDatePicker] = useState(window.innerWidth >= 576)
	useEffect(() => {
		const toggleDatePicker = () => {
			debounce(() => {
				setShowDatePicker(window.innerWidth >= 576)
			}, 500)
		}

		window.addEventListener('resize', toggleDatePicker)

		return () => window.removeEventListener('resize', toggleDatePicker)
	}, [])

	return (
		<InputOutputLayout
			InputToolbar={
				<Space>
					<Button size='large' onClick={generateSample}>
						Now
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
					initialValues={options}
					validateMessages={{
						required: 'This field is required'
					}}
					onValuesChange={onValuesChange}
				>
					<Form.Item<IOptionTypes>
						label="Timestamp:"
						name="timestamp"
						rules={[{ required: true }]}
					>
						<Input
							className={styles.timestampInput}
							addonAfter={
								showDatePicker ?
								<DatePicker
									showTime
									allowClear={false}
									className={`border-none bg-transparent ${styles.datePicker}`}
									// @ts-expect-error Types incorrect
									value={datePickerValue}
									onChange={onDatePickerChange}
								/> : null
							}
						/>
					</Form.Item>
				</Form>
			}

			OutputView={
				output === null ? (
					<div className='h-full flex items-center justify-center border border-solid border-gray-300'>
						<Empty />
					</div>
				) : (
					<List
						bordered
						className='mt-2 mb-8'
						dataSource={[
							{
								label: 'Timestamp',
								value: output.timestamp
							},
							{
								label: 'UTC time',
								value: output.utcTime
							},
							{
								label: 'Local time',
								value: output.localTime
							},
							{
								label: 'Day of year',
								value: output.dayOfYear
							},
							{
								label: 'Week of year',
								value: output.weekOfYear
							}
						]}
						renderItem={({label, value}) => (
							<List.Item>
								<div>
									<div className='font-semibold'>{label}:</div>
									{
									value !== '' ?
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

export default UnixTimestampParser