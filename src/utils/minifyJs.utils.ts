import {minify} from 'terser'

const minifyJs = async (js: string) => {
	let minifiedJs = ''

	try {
		const output = await minify(js)
		minifiedJs = output.code!
	} catch (err) {
		// Do nothing
	}

	return minifiedJs || js
}

export default minifyJs