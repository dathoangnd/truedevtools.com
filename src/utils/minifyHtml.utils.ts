const minifyHtml = (html: string) => {
	// @ts-expect-error The html-minifier library may not load successfully
	const minifiedHtml = window.htmlMinifier.minify(html, {
		collapseWhitespace: true,
		removeComments: true,
		removeRedundantAttributes: true,
		removeScriptTypeAttributes: true,
		removeTagWhitespace: true,
		minifyCSS: true,
		minifyJS: true
	})

	return minifiedHtml
}

export default minifyHtml