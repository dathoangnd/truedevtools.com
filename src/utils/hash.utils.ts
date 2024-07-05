import { MD5, SHA1, SHA3, SHA224, SHA256, SHA384, SHA512 } from 'crypto-js'

type IHashAlgorithm = 'md5' | 'sha1' | 'sha3' | 'sha224' | 'sha256' | 'sha384' | 'sha512'

const hash = (text: string, algorithm: IHashAlgorithm): string => {
	switch (algorithm) {
		case 'md5':
			return MD5(text).toString()

		case 'sha1':
			return SHA1(text).toString()

		case 'sha3':
			return SHA3(text).toString()

		case 'sha224':
			return SHA224(text).toString()

		case 'sha256':
			return SHA256(text).toString()

		case 'sha384':
			return SHA384(text).toString()

		case 'sha512':
			return SHA512(text).toString()
	}

	return ''
}

export default hash