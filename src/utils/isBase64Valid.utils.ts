const isBase64Valid = (base64: string) => {
	let isValid = true
	if (!base64) isValid = false

	try {
		let plainBase64 = base64
		if (plainBase64.includes(';base64,')) {
			plainBase64 = plainBase64.split(';base64,')[1]
		}

		atob(plainBase64)
	} catch (err) {
		isValid = false
	}

	return isValid
}

export default isBase64Valid