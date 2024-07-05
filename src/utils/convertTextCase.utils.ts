export type ITextCaseType = 'uppercase' | 'lowercase' | 'capitalized'

const convertTextCase = (text: string, textCase: ITextCaseType) => {
	switch (textCase) {
		case 'uppercase': {
			return text.toUpperCase()
		}

		case 'lowercase': {
			return text.toLowerCase()
		}

		case 'capitalized': {
			const words = text.split(' ').filter(word => word)

			for (let i = 0; i < words.length; i++) {
				words[i] = words[i][0].toUpperCase() + words[i].slice(1).toLowerCase()
			}

			return words.join(' ')
		}
	}

	return text
}

export default convertTextCase