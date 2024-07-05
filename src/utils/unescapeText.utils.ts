import unescape from 'unescape-js'

const unescapeText = (text: string) => {
	const escapedText = unescape(text)

	return escapedText
}

export default unescapeText