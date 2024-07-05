const debounce = (func: Function, delay: number) => {
	// @ts-expect-error Function is an object
	if (func._timeoutId) {
		// @ts-expect-error Function is an object
		clearTimeout(func._timeoutId)
	}

	// @ts-expect-error Function is an object
	func._timeoutId = setTimeout(function(){
		func()
	}, delay)
}

export default debounce