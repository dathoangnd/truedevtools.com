import { fromBlob } from 'image-resize-compress'
import imageToBase64 from './imageToBase64.utils'

export type IImageFormat = 'jpeg' | 'png' | 'webp' | 'bmp' | 'gif'

interface IOutput {
	base64: string
}

const convertImageFormat = async (image: File, format: IImageFormat): Promise<IOutput> => {	
	return new Promise((resolve) => {
		fromBlob(image, undefined, undefined, undefined, format)
			.then(convertedImage => {
				imageToBase64(convertedImage as File)
					.then(base64 => {
						resolve({
							base64
						})
					})
			})
	})
}

export default convertImageFormat