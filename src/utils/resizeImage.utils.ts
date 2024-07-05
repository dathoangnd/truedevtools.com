import { fromBlob } from 'image-resize-compress'
import imageToBase64 from './imageToBase64.utils'

const resizeImage = async (image: File, width: number, height: number): Promise<string> => {	
	return new Promise((resolve) => {
		fromBlob(image, undefined, width, height)
			.then(resizedImage => {
				imageToBase64(resizedImage as File)
					.then(base64 => {
						resolve(base64)
					})
			})
	})
}

export default resizeImage