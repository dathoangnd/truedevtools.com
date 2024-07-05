import { useRef, useState } from 'react'
import { Button, Empty, Form, Space } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import { jwtDecode } from 'jwt-decode'
import { useAppDispatch } from '../../store/hooks'
import { error, success } from '../../store/message/message.slice'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import jwtSample from '../../data/jwt-sample.txt?raw'
import beautifyJs from '../../utils/beautifyJs.utils'

export interface IOptionTypes {
  jwt: string
}

interface IOutput {
	header: string,
	payload: string
}

const JwtDecoder = () => {
	const dispatch = useAppDispatch()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		jwt: ''
	})

	const generateSample = () => {
		onJwtChange(jwtSample)
		codeEditorRef.current?.setValue(jwtSample)
	}

	const [output, setOutput] = useState<IOutput|null>(null)

	const decode = () => {
		try {
			const header = jwtDecode(options.current.jwt, { header: true })
			const payload = jwtDecode(options.current.jwt)
			
			setOutput({
				header: beautifyJs(JSON.stringify(header), {
					indentSize: 2
				}),
				payload: beautifyJs(JSON.stringify(payload), {
					indentSize: 2
				})
			})
	
			dispatch(success())
		} catch (err) {
			dispatch(error('Invalid JWT token'))
		}
	}

	const onJwtChange = (jwt: string) => {
		options.current.jwt = jwt
	}

	return (
		<InputOutputLayout
			InputToolbar={
				<Space>
					<Button size='large' onClick={generateSample}>
						Sample
					</Button>
					<Button type="primary" icon={<ArrowRightOutlined />} size='large' onClick={decode}>
						Parse
					</Button>
				</Space>
			}

			InputView={
				<CodeEditor language='text' ref={codeEditorRef} code={options.current.jwt} onChange={onJwtChange} />
			}

			OutputView={
				output === null ? (
					<div className='h-full min-h-[250px] flex items-center justify-center border border-solid border-gray-300'>
						<Empty />
					</div>
				) : (
					<Form
						layout='vertical'
						size='large'
						requiredMark='optional'
					>
						<Form.Item<IOutput>
							label="Header"
							required={true}
						>
							<CodeEditor code={output.header} language='json' readonly />
						</Form.Item>

						<Form.Item<IOutput>
							label="Payload"
							required={true}
						>
							<CodeEditor code={output.payload} language='json' readonly />
						</Form.Item>
					</Form>
				)
			}
		/>
	)
}

export default JwtDecoder