import { fromBlob } from 'image-resize-compress'
import imageToBase64 from './imageToBase64.utils'

interface IOutput {
	base64: string,
	compressedSize: number
}

const compressImage = async (image: File, level: number): Promise<IOutput> => {	
	return new Promise((resolve) => {
		fromBlob(image, 1 / level * 90, undefined, undefined, image.type === 'image/webp' ? 'webp' : 'jpg' )
			.then(compressedImage => {
				imageToBase64(compressedImage as File)
					.then(base64 => {
						resolve({
							base64,
							compressedSize: compressedImage.size
						})
					})
			})
	})
}

export default compressImage