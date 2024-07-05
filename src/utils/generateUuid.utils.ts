import { v1 as uuidv1, v3 as uuidv3, v4 as uuidv4, v5 as uuidv5 } from 'uuid'
import { IOptionTypes } from '../routes/UuidGenerator/UuidGenerator.component'

export type IUuidVersion = '1' | '3' | '4' | '5'

const generateUuid = (options: IOptionTypes): string[] => {
	switch (options.version) {
		case '1':
			return [...Array(options.quantity)].map(() => uuidv1())

		case '3':
			return [uuidv3(options.name!, options.namespace!)]

		case '4':
			return [...Array(options.quantity)].map(() => uuidv4())

		case '5':
			return [uuidv5(options.name!, options.namespace!)]
	}
}

export default generateUuid