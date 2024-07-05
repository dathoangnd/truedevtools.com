import { parse, stringify } from 'yaml'

interface IJsonToYamlOptions {
	json: string,
	indentSize: number
}

const jsonToYaml = (options: IJsonToYamlOptions): string => {
	const yamlObject = parse(options.json)

	const yaml = stringify(yamlObject, {
		indent: options.indentSize
	})

	return yaml
}

export default jsonToYaml