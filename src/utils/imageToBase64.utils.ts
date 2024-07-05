const imageToBase64 = (image: File): Promise<string> => {
	return new Promise((resolve) => {
		const reader = new FileReader()
		reader.onloadend = () => {
			resolve(reader.result as string)
		}

		reader.readAsDataURL(image)
	})
}

export default imageToBase64