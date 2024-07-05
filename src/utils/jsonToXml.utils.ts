import { json2xml } from 'xml-js'

interface IJsonToXmlOptions {
	json: string,
	indentSize: number
}

const jsonToXml = (options: IJsonToXmlOptions): string => {
	const xml = json2xml(options.json, {
		spaces: options.indentSize,
		compact: true
	})

	return xml
}

export default jsonToXml