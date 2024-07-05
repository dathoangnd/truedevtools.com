const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'

export interface IRandomStringOptions {
  length: number,
	allowUppercase: boolean,
	allowLowercase: boolean
	allowDigits: boolean,
}

const randomString = (options: IRandomStringOptions): string => {
	let generatedText = ''

	let charSet = ''

	if (options.allowUppercase) {
		charSet += UPPERCASE_LETTERS
	}

	if (options.allowLowercase) {
		charSet += LOWERCASE_LETTERS
	}

	if (options.allowDigits) {
		charSet += DIGITS
	}

	for (let i = 0; i < options.length; i++) {
		generatedText += charSet[Math.floor(Math.random() * charSet.length)]
	}

	return generatedText
}

export default randomString