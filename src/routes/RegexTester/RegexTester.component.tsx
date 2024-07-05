import { useCallback, useRef, useState } from 'react'
import { Button, Cascader, Drawer, Form, Input, Space, Typography } from 'antd'
import { BookOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import textSample from '../../data/text-sample.txt?raw'
import styles from './RegexTester.module.scss'
import findTextRowCol from '../../utils/findTextRowCol.utils'
import debounce from '../../utils/debounce.utils'
import SingleColumnLayout from '../../layouts/SingleColumnLayout/SingleColumnLayout.component'

const cheatsheet = [
	{
		label: 'Character classes',
		items: [
			{
				expressions: ['.'],
				explanation: 'any character except newline'
			},
			{
				expressions: ['\\w', '\\d', '\\s'],
				explanation: 'word, digit, whitespace'
			},
			{
				expressions: ['[abc]'],
				explanation: 'any of a, b, or c'
			},
			{
				expressions: ['[^abc]'],
				explanation: 'not a, b, or c'
			},
			{
				expressions: ['[a-g]'],
				explanation: 'character between a & g'
			}
		]
	},
	{
		label: 'Anchors',
		items: [
			{
				expressions: ['^abc$'],
				explanation: 'start / end of the string'
			},
			{
				expressions: ['\\b', '\\B'],
				explanation: 'word, not-word boundary'
			}
		]
	},
	{
		label: 'Escaped characters',
		items: [
			{
				expressions: ['\\.', '\\*', '\\\\'],
				explanation: 'escaped special characters'
			},
			{
				expressions: ['\\t', '\\n', '\\r'],
				explanation: 'tab, linefeed, carriage return'
			}
		]
	},
	{
		label: 'Groups & Lookaround',
		items: [
			{
				expressions: ['(abc)'],
				explanation: 'capture group'
			},
			{
				expressions: ['\\1'],
				explanation: 'backreference to group #1'
			},
			{
				expressions: ['(?:abc)'],
				explanation: 'non-capturing group'
			},
			{
				expressions: ['(?=abc)'],
				explanation: 'positive lookahead'
			},
			{
				expressions: ['(?!abc)'],
				explanation: 'negative lookahead'
			}
		]
	},
	{
		label: 'Quantifiers & Alternation',
		items: [
			{
				expressions: ['a*', 'a+', 'a?'],
				explanation: '0 or more, 1 or more, 0 or 1'
			},
			{
				expressions: ['a{5}', 'a{2,}'],
				explanation: 'exactly five, two or more'
			},
			{
				expressions: ['a{1,3}'],
				explanation: 'between one & three'
			},
			{
				expressions: ['a+?', 'a{2,}?'],
				explanation: 'match as few as possible'
			},
			{
				expressions: ['ab|cd'],
				explanation: 'match ab or cd'
			}
		]
	}
]

const flagOptions = [
	{
		label: '<b>g</b>lobal',
		value: 'g'
	},
	{
		label: 'case <b>i</b>nsensitive',
		value: 'i'
	},
	{
		label: '<b>m</b>ultiline',
		value: 'm'
	},
	{
		label: '<b>s</b>ingle line',
		value: 's'
	},
	{
		label: '<b>u</b>nicode',
		value: 'u'
	},
	{
		label: 'stick<b>y</b>',
		value: 'y'
	}
]

const sampleExpression = `([A-Z])\\w+`

export interface IOptionTypes {
	expression: string,
	flags: string[]
}

const RegexTester = () => {
	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)
	const [form] = Form.useForm()

	const options = useRef<IOptionTypes>({
		expression: '',
		flags: ['g']
	})

	const [cheatsheetOpen, setCheatSheetOpen] = useState(false)

	const text = useRef<string>('')
	const decorationIds = useRef<string[]>([])

	const generateSample = () => {
		text.current = textSample
		codeEditorRef.current?.setValue(textSample)

		options.current = {
			...options.current,
			expression: sampleExpression
		}

		form.setFieldsValue({expression: sampleExpression})
	}

	const onExpressionChange = (expression: string) => {
		options.current = {
			...options.current,
			expression
		}

		debounce(hightlightMatches, 100)
	}

	const onTextChange = (newText: string) => {
		text.current = newText
		debounce(hightlightMatches, 100)
	}

	const flagRenderer = ({value}: {value: string}) => {
		return <span className='text-blue-500'>{value}</span>
	}

	const flagOptionRenderer = ({label}: {label: string}) => {
		return <span dangerouslySetInnerHTML={{__html: label}}></span>
	}

	const onFlagChange = (value: string[][]) => {
		let compactFlags = value.map(flag => flag[0])
		const compactFlagOptions = flagOptions.map(flagOption => flagOption.value)
		compactFlags = compactFlags.sort((flag1, flag2) => compactFlagOptions.indexOf(flag1) - compactFlagOptions.indexOf(flag2))
		options.current = {
			...options.current,
			flags: compactFlags
		}

		debounce(hightlightMatches, 100)
	}

	const hightlightMatches = useCallback(() => {
		codeEditorRef.current!.deltaDecorations(decorationIds.current, [])

		try {
			const regex = new RegExp(options.current.expression, options.current.flags.join(''))
	
			const decorations: monaco.editor.IModelDeltaDecoration[] = []
	
			let match: RegExpExecArray|null = null
			let lastIndex = -1
			while ((match = regex.exec(text.current)) !== null && match[0] && match.index > lastIndex) {
				lastIndex = match.index
				const startRowCol = findTextRowCol(text.current, match.index)
				const endRowCol = findTextRowCol(text.current, match.index + match[0].length)
	
				if (!startRowCol || !endRowCol) continue
	
				decorations.push({
					range: new monaco.Range(startRowCol.row, startRowCol.col, endRowCol.row, endRowCol.col),
					options: {
						inlineClassName: 'bg-orange-200 text-black'
					}
				})
			}
		
			// Add decorations to the editor
			decorationIds.current = codeEditorRef.current!.deltaDecorations([], decorations)
		} catch (err) {
			// Invalid regex
			return
		}
	}, [options])

	const toggleCheatsheet = useCallback(() => {
		setCheatSheetOpen(!cheatsheetOpen)
	}, [cheatsheetOpen])

	return (
		<>
			<SingleColumnLayout
				Toolbar={
					<Space>
						<Button size='large' onClick={generateSample}>
							Sample
						</Button>
						<Button icon={<BookOutlined />} size='large' onClick={toggleCheatsheet}>
							Cheatsheet
						</Button>
					</Space>
				}

				View={
					<Form
						form={form}
						layout='vertical'
						size='large'
						requiredMark='optional'
					>
						<Form.Item<IOptionTypes>
							label='Regular expression'
							name='expression'
							required={true}
							initialValue={options.current.expression}
						>
							<Input
								onChange={(event) => onExpressionChange(event.target.value)}
								autoComplete='off'
								addonBefore={<span className='text-gray-500'>/</span>}
								addonAfter={
									<Cascader
										options={flagOptions}
										tagRender={flagRenderer}
										optionRender={flagOptionRenderer}
										defaultValue={options.current.flags.map(flag => [flag])}
										// @ts-expect-error Types incorrect
										onChange={onFlagChange}
										removeIcon={null}
										multiple
										className={`w-28 ${styles.regexCascader}`}
									/>
								}
								className={styles.regexInput}
							/>
						</Form.Item>

						<Form.Item<IOptionTypes>
							label="Text"
							required={true}
						>
							<div className='h-[350px]'>
								<CodeEditor ref={codeEditorRef} code={text.current} language='text' onChange={onTextChange} />
							</div>
						</Form.Item>
					</Form>
				}
			/>
			<Drawer title="Regex cheatsheet" open={cheatsheetOpen} onClose={toggleCheatsheet}>
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

export default RegexTester