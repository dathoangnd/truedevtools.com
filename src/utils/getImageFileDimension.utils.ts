import imageToBase64 from './imageToBase64.utils'

const getImageFileDimension = (file: File): Promise<{
	width: number,
	height: number
}> => {
	return new Promise((resolve) => {
		imageToBase64(file)
			.then(base64 => {
				const image = new Image()
			
				image.onload = () => {
					resolve({
						width: image.width,
						height: image.height
					})
				}
			
				image.src = base64
			})

	})
}

export default getImageFileDimension