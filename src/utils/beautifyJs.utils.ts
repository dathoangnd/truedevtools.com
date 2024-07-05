import beautify from 'js-beautify'

interface IJsBeautifierOptions {
	indentSize: number
}

const beautifyJs = (js: string, options: IJsBeautifierOptions) => {
	const formattedJs = beautify.js(js, {
		indent_size: options.indentSize,
		preserve_newlines: true,
		keep_array_indentation: true
	})

	return formattedJs
}

export default beautifyJs