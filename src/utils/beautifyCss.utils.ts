import beautify from 'js-beautify'

interface ICssBeautifierOptions {
	indentSize: number
}

const beautifyCss = (css: string, options: ICssBeautifierOptions) => {
	const formattedJs = beautify.css(css, {
		indent_size: options.indentSize,
		preserve_newlines: true
	})

	return formattedJs
}

export default beautifyCss