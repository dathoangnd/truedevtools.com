import { parse } from 'yaml'
import beautifyJs from './beautifyJs.utils'

interface IYamlToJsonOptions {
	yaml: string,
	indentSize: number
}

const yamlToJson = (options: IYamlToJsonOptions): string => {
	const yamlObject = parse(options.yaml)

	return beautifyJs(JSON.stringify(yamlObject), {
		indentSize: options.indentSize
	})
}

export default yamlToJson