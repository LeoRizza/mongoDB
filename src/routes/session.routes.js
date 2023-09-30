import { Router } from "express";
import passport from "passport";

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

        /* res.status(200).send({ payload: req.user }) */
        res.cookie('userData', {
            firstName: user.first_name,
            lastName: user.last_name,
            rol: user.rol,
        });

        res.redirect('/products');
        /* Probando */
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
    /* res.status(200).send({ resultado: 'Usuario deslogueado' }) */
    res.redirect('/home', 200, { resultado: 'Usuario deslogueado' })
})

export default sessionRouter