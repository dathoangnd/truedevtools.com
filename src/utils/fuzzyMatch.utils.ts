export const fuzzyMatch = (text: string, query: string): boolean => {
	const stringSearch = query
		.replace(/\s/g, '')
		.split('')
		.join('\\w*')

	if (stringSearch == '') return true

	const queryRegex = new RegExp(stringSearch, 'img')

  return !!text.replace(/\s/g, '').match(queryRegex)

}