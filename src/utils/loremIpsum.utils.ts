import { loremIpsum as generateLoremIpsum } from "lorem-ipsum"

const LOREM_IPSUM_SENTENCE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
const LOREM_IPSUM_SENTENCE_PLAIN = 'lorem ipsum dolor sit amet consectetur adipiscing elit'
const LOREM_IPSUM_SENTENCE_WORDS = LOREM_IPSUM_SENTENCE_PLAIN.split(' ')

export interface ILoremIpsumOptions {
  length: number,
  unit: 'paragraphs' | 'sentences' | 'words',
	startWithLoremIpsum: boolean
}

const loremIpsum = (options: ILoremIpsumOptions): string => {
	let generatedText = ''

	if (options.startWithLoremIpsum) {
		switch (options.unit) {
			case 'paragraphs': {
				const newText = generateLoremIpsum({
					count: options.length,
					units: options.unit
				})
				generatedText = `${LOREM_IPSUM_SENTENCE}. ${newText}`
				break
			}

			case 'sentences': {
				const newText = generateLoremIpsum({
					count: options.length - 1,
					units: options.unit
				})
				generatedText = `${LOREM_IPSUM_SENTENCE}. ${newText}`
				break
			}

			case 'words': {
				if (options.length <= LOREM_IPSUM_SENTENCE_WORDS.length) {
					generatedText = LOREM_IPSUM_SENTENCE_WORDS.slice(0, options.length).join(' ')
				} else {
					const newText = generateLoremIpsum({
						count: options.length - LOREM_IPSUM_SENTENCE_WORDS.length,
						units: options.unit
					})
					generatedText = `${LOREM_IPSUM_SENTENCE_PLAIN} ${newText}`
					break
				}
			}
		}
	} else {
		generatedText = generateLoremIpsum({
			count: options.length,
			units: options.unit
		})
	}

	return generatedText
}

export default loremIpsum