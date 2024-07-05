import { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Drawer, Empty, Form, FormProps, Input, List, Space, Typography } from 'antd'
import { BookOutlined } from '@ant-design/icons'
import cronstrue from 'cronstrue'
import cronParser, {CronFields} from 'cron-parser'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'

const cronExpressionSample = '*/15 * * * *'
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const cheatsheet = [
	{
		label: 'Examples',
		items: [
			{
				expressions: ['0 * * * *'],
				explanation: 'every hour'
			},
			{
				expressions: ['*/15 * * * *'],
				explanation: 'every 15 mins'
			},
			{
				expressions: ['0 */2 * * *'],
				explanation: 'every 2 hours'
			},
			{
				expressions: ['0 18 * * 0-6'],
				explanation: 'every week Mon-Sat at 6pm'
			},
			{
				expressions: ['10 2 * * 6,7'],
				explanation: 'every Sat and Sun on 2:10am'
			},
			{
				expressions: ['0 0 * * 0'],
				explanation: 'every Sunday midnight'
			}
		]
	},
	{
		label: 'Operators',
		items: [
			{
				expressions: ['*'],
				explanation: 'all values'
			},
			{
				expressions: [','],
				explanation: 'separate individual values'
			},
			{
				expressions: ['-'],
				explanation: 'a range of values'
			},
			{
				expressions: ['/'],
				explanation: 'divide a value into steps'
			}
		]
	}
]

export interface IOptionTypes {
  expression: string
}

interface IOutput {
	description: string,
	fields: CronFields,
	nextExecution: Date
}

const CronExpressionParser = () => {
	const [inputForm] = Form.useForm()
	const [options, setOptions] = useState<IOptionTypes>({
		expression: ''
	})

	const onValuesChange: FormProps<IOptionTypes>['onValuesChange'] = (values: IOptionTypes) => {
		setOptions({
			...options,
			...values
		})
	}

	const generateSample = async () => {
		const newOptions = {
			...options,
			expression: cronExpressionSample
		}

		setOptions(newOptions)
		inputForm.setFieldsValue(newOptions)
	}

	const [output, setOutput] = useState<IOutput|null>(null)
	useEffect(() => {
		let output: IOutput|null = null

		try {
			const description = cronstrue.toString(options.expression)
			const cron = cronParser.parseExpression(options.expression)
			output = {
				description,
				fields: cron.fields,
				nextExecution: cron.next().toDate()
			}
		} catch (err) {
			// Do nothing
		}

		setOutput(output)
	}, [options])

	const [cheatsheetOpen, setCheatSheetOpen] = useState(false)

	const toggleCheatsheet = useCallback(() => {
		setCheatSheetOpen(!cheatsheetOpen)
	}, [cheatsheetOpen])

	return (
		<>
			<InputOutputLayout
				InputToolbar={
					<Space>
						<Button size='large' onClick={generateSample}>
							Sample
						</Button>
						<Button icon={<BookOutlined />} size='large' onClick={toggleCheatsheet}>
							Cheatsheet
						</Button>
					</Space>
				}

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
							label="Cron expression"
							name="expression"
							rules={[
								{ required: true },
								{
									validator: (_, value) => {
										if (!value) return Promise.resolve()
										try {
											cronstrue.toString(value)
											return Promise.resolve()
										} catch (err) {
											return Promise.reject((err as string).replace('Error: ', ''))
										}
									}
								}
							]}
						>
							<Input placeholder='* * * * *' />
						</Form.Item>
					</Form>
				}

				OutputView={
					!output ?
					<div className='border border-solid border-gray-300 w-full h-full flex items-center justify-center'>
						<Empty />
					</div> :
					<>
						<Alert message={output.description} type='info' className='mb-8' />

						<Typography.Title level={5}>Expression parts</Typography.Title>
						<List
							bordered
							className='mt-2 mb-8'
							dataSource={[
								{
									label: 'Minutes',
									value: output.fields.minute.length === 60 ? 'All' : output.fields.minute.join(', ')
								},
								{
									label: 'Hours',
									value: output.fields.hour.length === 24 ? 'All' : output.fields.hour.join(', ')
								},
								{
									label: 'Day of month',
									value: output.fields.dayOfMonth.length === 31 ? 'All' : output.fields.dayOfMonth.join(', ')
								},
								{
									label: 'Months',
									value: output.fields.month.length === 12 ? 'All' : output.fields.month.map(month => months[month-1]).join(', ')
								},
								{
									label: 'Day of week',
									// @ts-expect-error Safe reference
									value: formatDayOfWeek(output.fields.dayOfWeek, output.description)
								},
								{
									label: 'Next execution',
									value: output.nextExecution
								},
							]}
							renderItem={({label, value}) => (
								<List.Item>
									<div>
										<div className='font-semibold'>{label}:</div>
										{
										value ? 
										<Typography.Text copyable>{value.toString()}</Typography.Text> :
										<></>
										}
									</div>
								</List.Item>
							)}
						/>
					</>
				}
			/>
			<Drawer title="Cron expression cheatsheet" open={cheatsheetOpen} onClose={toggleCheatsheet}>
				{
				cheatsheet.map((group, index) => (
					<div key={index} className='mb-4'>
						<Typography.Title level={5}>{group.label}</Typography.Title>
						{
						group.items.map((item, index) => (
							<div className='flex justify-between items-center my-2' key={index}>
								<Space size='small'>
									{
									item.expressions.map((expression, index) => (
										<Typography.Text code key={index}>{expression}</Typography.Text>
									))
									}
								</Space>
								<p className='text-gray-700 dark:text-gray-300'>{item.explanation}</p>
							</div>
						))
						}
					</div>
				))
				}
      </Drawer>
		</>
	)
}

const formatDayOfWeek = (dayOfWeek: number[], description: string) => {
	if (dayOfWeek.length === 8) return 'All'

	let mutableDayOfWeek = dayOfWeek.filter(day => day !== 7)

	if (description.includes('through') && !description.includes('Sunday through')) {
		mutableDayOfWeek = mutableDayOfWeek.filter(day => day !== 0)
	}

	return mutableDayOfWeek.map(day => days[day]).join(', ')
}

export default CronExpressionParser