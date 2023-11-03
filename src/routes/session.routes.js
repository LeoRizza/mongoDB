import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from "../utils/messagesError.js";
import { generateToken } from "../utils/jwt.js";

const sessionRouter = Router()

sessionRouter.post('/login', passport.authenticate('login') , async (req, res) => {
    try {
        if(!req.body) {
            return res.status(401).send({mensaje: "Usuario Invalido"})
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        }

        const token = generateToken(req.user)
        res.cookie('jwtCookie', token, {
            maxAge: 43200000
        })

        res.status(200).send({ payload: req.user })
    } catch(error) {
        res.status(500).send({ mensaje: 'Error al iniciar session ${error}'})
    }
})

sessionRouter.post('/register', passport.authenticate('register') , async (req, res) => {
    try {
        if(!req.user) {
            return res.status(400).send({ mensaje: "Usuario ya existente" })
        }

        res.status(200).send({ mensaje: "Usuario creado" })
    } catch(error) {
        res.status(500).send({ mensaje: 'Error al crear usuario ${error}'})
    }
})

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {

})

sessionRouter.get('/githubCallback', passport.authenticate('github'), async (req, res) => {
    req.session.user = req.user
    res.status(200).send({ mensaje: 'Usuario logueado' })
})

sessionRouter.get('/logout', (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    res.clearCookie('jwtCookie')
    res.redirect('/home', 200, { resultado: 'Usuario deslogueado' })
})

/* sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req)
    res.send(req.user)
}) */

sessionRouter.get('/current', passportError('jwt'), authorization('user'), (req, res) => {
    res.send(req.user)
})

export default sessionRouter