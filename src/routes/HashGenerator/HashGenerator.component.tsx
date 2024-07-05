import { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Space } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import textSample from '../../data/text-sample.txt?raw'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import useCopyText from '../../hooks/useCopyText.hooks'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import hash from '../../utils/hash.utils'

export interface IOptionTypes {
	text: string
}

interface IOutput {
	md5: string,
	sha1: string,
	sha3: string,
	sha224: string,
	sha256: string,
	sha384: string,
	sha512: string
}

const HashGenerator = () => {
	const textEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)
	const [outputForm] = Form.useForm()
	const copyText = useCopyText()

	const options = useRef<IOptionTypes>({
		text: ''
	})

	const [output, setOutput] = useState<IOutput|null>(null)
	useEffect(() => {
		onTextChange('')
	}, [])

	useEffect(() => {
		outputForm.setFieldsValue(output)
	}, [outputForm, output])

	const generateSample = () => {
		onTextChange(textSample)
		textEditorRef.current!.setValue(options.current.text)
	}

	const onTextChange = (text: string) => {
		options.current.text = text
		
		setOutput({
			md5: hash(text, 'md5'),
			sha1: hash(text, 'sha1'),
			sha3: hash(text, 'sha3'),
			sha224: hash(text, 'sha224'),
			sha256: hash(text, 'sha256'),
			sha384: hash(text, 'sha384'),
			sha512: hash(text, 'sha512')
		})
	}

	return (
		<InputOutputLayout
			InputToolbar={
				<Space>
					<Button size='large' onClick={generateSample}>
						Sample
					</Button>
				</Space>
			}

			InputView={
				<CodeEditor ref={textEditorRef} code='' language='text' onChange={onTextChange} />
			}

			OutputView={
				<Form
					form={outputForm}
					layout="vertical"
					size='large'
					requiredMark='optional'
					initialValues={output!}
					validateMessages={{
						required: 'This field is required'
					}}
				>
					<Form.Item<IOutput>
						label="MD5"
						name="md5"
						rules={[{ required: true }]}
					>
						<Input
							readOnly
							suffix={
								<CopyOutlined
									className='cursor-pointer'
									onClick={() => copyText(output!.md5)}
								/>
							}
						/>
					</Form.Item>

					<Form.Item<IOutput>
						label="SHA1"
						name="sha1"
						rules={[{ required: true }]}
					>
						<Input
							readOnly
							suffix={
								<CopyOutlined
									className='cursor-pointer'
									onClick={() => copyText(output!.sha1)}
								/>
							}
						/>
					</Form.Item>

					<Form.Item<IOutput>
						label="SHA3"
						name="sha3"
						rules={[{ required: true }]}
					>
						<Input
							readOnly
							suffix={
								<CopyOutlined
									className='cursor-pointer'
									onClick={() => copyText(output!.sha3)}
								/>
							}
						/>
					</Form.Item>

					<Form.Item<IOutput>
						label="SHA224"
						name="sha224"
						rules={[{ required: true }]}
					>
						<Input
							readOnly
							suffix={
								<CopyOutlined
									className='cursor-pointer'
									onClick={() => copyText(output!.sha224)}
								/>
							}
						/>
					</Form.Item>

					<Form.Item<IOutput>
						label="SHA256"
						name="sha256"
						rules={[{ required: true }]}
					>
						<Input
							readOnly
							suffix={
								<CopyOutlined
									className='cursor-pointer'
									onClick={() => copyText(output!.sha256)}
								/>
							}
						/>
					</Form.Item>

					<Form.Item<IOutput>
						label="SHA384"
						name="sha384"
						rules={[{ required: true }]}
					>
						<Input
							readOnly
							suffix={
								<CopyOutlined
									className='cursor-pointer'
									onClick={() => copyText(output!.sha384)}
								/>
							}
						/>
					</Form.Item>

					<Form.Item<IOutput>
						label="SHA512"
						name="sha512"
						rules={[{ required: true }]}
					>
						<Input
							readOnly
							suffix={
								<CopyOutlined
									className='cursor-pointer'
									onClick={() => copyText(output!.sha512)}
								/>
							}
						/>
					</Form.Item>
				</Form>
			}
		/>
	)
}

export default HashGenerator