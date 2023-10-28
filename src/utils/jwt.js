import 'dotenv/config'
import jwt from 'jsonwebtoken'

export const generateToken = (user) => {

    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '24h' })
    console.log("cookieExtractor", token)

    return token

}
generateToken({"_id":"6511c5fddbccc74d49679e92","first_name":"Pepito","last_name":"Perez","age":"29","email":"dalsgfasida@homasiomf","password":"qwerty","rol":"user"})


export const authToken = (req, res, next) => {
    const authHeader = req.headers.Authorization

    if (!authHeader) {
        return res.status(401).send({ error: 'Usuario no autenticado' })
    }

    const token = authHeader.split(' ')[1]//borro el espacio y me quedo con el token [1] (bearer seria el 0)

    jwt.sign(token, process.env.JWT_SECRET, (error, credential) => {
        if (error) {
            return res.status(403).send({ error: 'Usuario no autorizado, token invalido' })
        }
    })

    req.user = credential.user
    next()

}