import sqlFormatter from '@sqltools/formatter'

interface ISqlBeautifierOptions {
	indentSize: number
}

const beautifySql = (sql: string, options: ISqlBeautifierOptions) => {
	const formattedSql = sqlFormatter.format(sql, {
		indent: options.indentSize === 4 ? '    ' : '  '
	})

	return formattedSql
}

export default beautifySql