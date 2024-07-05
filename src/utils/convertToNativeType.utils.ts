const convertToNativeType = (value: string) => {
	const numberValue = Number(value)
	if (!isNaN(numberValue)) {
		return numberValue
	}

	const booleanValue = value.toLowerCase()
	if (booleanValue === 'true') {
		return true
	} else if (booleanValue === 'false') {
		return false
	}

	return value
}

export default convertToNativeType