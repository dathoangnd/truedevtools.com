import bcrypt from 'bcryptjs'

const hashBcrypt = (text: string, round: number): string => {
	return bcrypt.hashSync(text, round)
}

export default hashBcrypt