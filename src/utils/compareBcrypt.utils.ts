import bcrypt from 'bcryptjs'

const compareBcrypt = (hash: string, compareText: string): boolean => {
	return bcrypt.compareSync(compareText, hash)
}

export default compareBcrypt