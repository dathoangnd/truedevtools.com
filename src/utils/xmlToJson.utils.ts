import { xml2json } from 'xml-js'
import convertToNativeType from './convertToNativeType.utils'

interface IXmlToJsonOptions {
	xml: string,
	indentSize: number
}

const xmlToJson = (options: IXmlToJsonOptions): string => {
	const json = xml2json(options.xml, {
		spaces: options.indentSize,
		compact: true,
		trim: true,
		// ignoreDeclaration: true,
		// ignoreInstruction: true,
		// ignoreComment: true,
		// ignoreCdata: true,
		// ignoreDoctype: true,
		textFn: (value, parentElement) => {
			try {
				// @ts-expect-error No types found
				const keyNo = Object.keys(parentElement._parent).length
				// @ts-expect-error No types found
				const keyName = Object.keys(parentElement._parent)[keyNo-1]

				// @ts-expect-error No types found
				if (parentElement._attributes) {
					const attributes: {
						[attribute: string]: string|number|boolean
					} = {
						
					}

					// @ts-expect-error No types found
					Object.entries<string>(parentElement._attributes).forEach(([attribute, value]) => {
						if (attributes[attribute] === undefined) {
							attributes[attribute] = convertToNativeType(value)
						}
					})

					// @ts-expect-error No types found
					parentElement._parent[keyName] = {
						_value: convertToNativeType(value),
						_attributes: attributes
					}
				} else {
					// @ts-expect-error No types found
					parentElement._parent[keyName] = convertToNativeType(value)
				}
			}
			catch(e) {
				// Do nothing
			}
		}
	})

	return json
}

export default xmlToJson