import { useRef, useState } from 'react'
import { Button, Select, Space } from 'antd'
import { ArrowRightOutlined, CopyOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import { useAppDispatch } from '../../store/hooks'
import { success } from '../../store/message/message.slice'
import useCopyText from '../../hooks/useCopyText.hooks'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import sqlSample from '../../data/sql-sample.minified.sql?raw'
import beautifySql from '../../utils/beautifySql.utils'

export interface IOptionTypes {
  sql: string,
	tabSize: number
}

const SqlFormatter = () => {
	const dispatch = useAppDispatch()
	const copyText = useCopyText()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		sql: '',
		tabSize: 2
	})

	const generateSample = () => {
		onSqlChange(sqlSample)
		codeEditorRef.current?.setValue(options.current.sql)
	}

	const [formattedSql, setFormattedSql] = useState<string|null>(null)

	const format = () => {
		const formattedSql = formatSql(options.current)
		setFormattedSql(formattedSql)
		dispatch(success())
	}

	const formatSql = (options: IOptionTypes) => {
		const formattedSql = beautifySql(options.sql, {
			indentSize: options.tabSize
		})

		return formattedSql
	}

	const copyOutput = () => {
		copyText(formattedSql!)
	}

	const onSqlChange = (sql: string) => {
		options.current.sql = sql
	}

	const onTabSizeChange = (tabSize: number) => {
		options.current.tabSize = tabSize
		const formattedSql = formatSql(options.current)
		setFormattedSql(formattedSql)
	}

	return (
		<InputOutputLayout
			InputToolbar={
				<Space>
					<Button size='large' onClick={generateSample}>
						Sample
					</Button>
					<Button type="primary" icon={<ArrowRightOutlined />} size='large' onClick={format}>
						Format
					</Button>
				</Space>
			}

			InputView={
				<CodeEditor ref={codeEditorRef} code={options.current.sql} language='sql' onChange={onSqlChange} />
			}

			OutputToolbar={
				formattedSql === null ? <></> :
				<Space>
					<Select
						defaultValue={2}
						options={[
							{ value: 2, label: <>2 spaces</> },
							{ value: 4, label: <>4 spaces</> }
						]}
						onChange={onTabSizeChange}
					/>
					<Button icon={<CopyOutlined />} onClick={copyOutput}>
						Copy
					</Button>
				</Space>
			}

			OutputView={
				<CodeEditor code={formattedSql} language='sql' readonly />
			}
		/>
	)
}

export default SqlFormatter