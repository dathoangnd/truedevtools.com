import escape from 'js-string-escape'

const escapeText = (text: string) => {
	const escapedText = escape(text)

	return escapedText
}

export default escapeText