import beautify from 'js-beautify'

interface IHtmlBeautifierOptions {
	indentSize: number
}

const beautifyHtml = (html: string, options: IHtmlBeautifierOptions) => {
	const formattedHtml = beautify.html(html, {
		indent_size: options.indentSize,
		preserve_newlines: true,
		indent_inner_html: true
	})

	return formattedHtml
}

export default beautifyHtml