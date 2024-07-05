import jsonminify from 'jsonminify'

const minifyJson = (json: string) => {
	const minifiedJson =  jsonminify(json)
	return minifiedJson
}

export default minifyJson