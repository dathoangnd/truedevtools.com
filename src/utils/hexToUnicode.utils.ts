const hexToUnicode = (text: string): string => {
	const hexes = text.replace(/\s+/g, '')
										.split('0x')

	return hexes.map(hex => {
						try {
							return String.fromCodePoint(parseInt(hex, 16))
						} catch (err) {
							return ''
						}
					})
					.join('')
}

export default hexToUnicode