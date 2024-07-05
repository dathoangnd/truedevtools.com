import uglifycss from 'uglifycss'

const minifyCss = (css: string) => {
	const minifiedCss = uglifycss.processString(css)

	return minifiedCss
}

export default minifyCss