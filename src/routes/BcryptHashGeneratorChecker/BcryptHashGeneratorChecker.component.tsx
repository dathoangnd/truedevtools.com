import { useEffect, useState } from 'react'
import { Button, Space, Radio, RadioChangeEvent, Form, Input, InputNumber, Empty, Alert, FormProps, Slider } from 'antd'
import { ArrowRightOutlined, CopyOutlined } from '@ant-design/icons'
import { useAppDispatch } from '../../store/hooks'
import { error, success } from '../../store/message/message.slice'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import passwordSample from '../../data/password-sample.txt?raw'
import hashBcrypt from '../../utils/hashBcrypt.utils'
import compareBcrypt from '../../utils/compareBcrypt.utils'
import useCopyText from '../../hooks/useCopyText.hooks'

type IMode = 'encrypt' | 'decrypt'

export interface IOptionTypes {
  text: string,
	round: number,
	hash: string,
	compareText: string
}

interface IOutput {
	hash?: string,
	match?: boolean
}

const BcryptHashGeneratorChecker = () => {
	const dispatch = useAppDispatch()
	const [inputForm] = Form.useForm()
	const [outputForm] = Form.useForm()
	const copyText = useCopyText()

	const [options, setOptions] = useState<IOptionTypes>({
		text: '',
		round: 10,
		hash: '',
		compareText: ''
	})

	const [mode, setMode] = useState<IMode>('encrypt')
	const [output, setOutput] = useState<IOutput>({
		hash: undefined,
		match: undefined
	})

	useEffect(() => {
		inputForm.setFieldsValue(options)
	}, [options, inputForm])

	useEffect(() => {
		outputForm.setFieldsValue(output)
	}, [output, outputForm])

	useEffect(() => {
		setOutput({
			hash: undefined,
			match: undefined
		})
	}, [mode])

	const generateSample = () => {
		if (mode == 'decrypt') {
			setOptions({
				...options,
				hash: hashBcrypt(passwordSample, 10),
				compareText: passwordSample
			})
		} else {
			setOptions({
				...options,
				text: passwordSample
			})
		}
	}

	const onModeChange = (event: RadioChangeEvent) => {
		setMode(event.target.value)
	}

	const process = async () => {
		try {
			await inputForm.validateFields()
		} catch (err) {
			dispatch(error('Invalid input'))
			return
		}

		if (mode == 'decrypt') {
			setOutput({
				...output,
				match: compareBcrypt(options.hash, options.compareText)
			})
		} else {
			setOutput({
				...output,
				hash: hashBcrypt(options.text, options.round)
			})
		}

		dispatch(success())
	}

	const onValuesChange: FormProps<IOptionTypes>['onValuesChange'] = (values: IOptionTypes) => {
		setOptions({
			...options,
			...values
		})
	}

	const onRoundChange = (level: number | null) => {
		setOptions({
			...options,
			round: level!
		})
	}

	return (
		<InputOutputLayout
			InputToolbar={
				<Space>
					<Radio.Group value={mode} onChange={onModeChange}>
						<Radio value='encrypt'>Encrypt</Radio>
						<Radio value='decrypt'>Decrypt</Radio>
					</Radio.Group>
					<Button size='large' onClick={generateSample}>
						Sample
					</Button>
					<Button type="primary" icon={<ArrowRightOutlined />} size='large' onClick={process}>
						{mode === 'decrypt' ? 'Compare' : 'Hash'}
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
					{
						mode === 'decrypt' ?
						<>
							<Form.Item<IOptionTypes>
								label="Hash"
								name="hash"
								rules={[{ required: true }]}
							>
								<Input />
							</Form.Item>

							<Form.Item<IOptionTypes>
								label="Text to compare"
								name="compareText"
								rules={[{ required: true }]}
							>
								<Input />
							</Form.Item>
						</> :
						<>
							<Form.Item<IOptionTypes>
								label="Text"
								name="text"
								rules={[{ required: true }]}
							>
								<Input />
							</Form.Item>
						
							<Form.Item<IOptionTypes>
								label="Rounds"
								name="round"
								rules={[{ required: true }]}
							>
								<div className='flex gap-4'>
									<div className='grow'>
										<Slider
											min={1}
											max={12}
											value={options.round}
											onChange={onRoundChange}
										/>
									</div>
									<div className='basis-16'>
										<InputNumber
											min={1}
											max={12}
											value={options.round}
											onChange={onRoundChange}
										/>
									</div>
								</div>
							</Form.Item>
						</>
					}
				</Form>
			}

			OutputView={
				mode === 'decrypt' ? (
					output.match === undefined ?
					<div className='border border-solid border-gray-300 h-full flex items-center justify-center'>
						<Empty />
					</div> :
					<Alert message={output.match ? 'Hash and text match' : 'Hash and text don\'t match'} type={output.match ? 'success' : 'error'} className='mb-8' />
				) : (
					output.hash === undefined ?
					<div className='border border-solid border-gray-300 h-full flex items-center justify-center'>
						<Empty />
					</div> :
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
						<Form.Item<IOptionTypes>
							label="Hash"
							name="hash"
							rules={[{ required: true }]}
						>
							<Input
								suffix={
									<CopyOutlined
										className='cursor-pointer ml-2'
										onClick={() => copyText(output!.hash!)}
									/>
								}
							/>
						</Form.Item>
					</Form>
				)
			}
		/>
	)
}

export default BcryptHashGeneratorChecker