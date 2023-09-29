import 'dotenv/config'

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.getSaltSync(parseInt(process.env.SALT)))

export const validatePasword = (passwordSend, passwordBDD) => bcrypt.compareSync(passwordSend, passwordBDD)