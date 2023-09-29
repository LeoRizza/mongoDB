import { Router } from "express";
import { userModel } from "../models/users.models.js";

const sessionRouter = Router()

sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        if (req.session.login) {
            res.status(200).send({ resultado: 'Ya estás loggeado' })
        }
        const user = await userModel.findOne({ email: email })

        if (user) {
            if (user.password == password) {
                req.session.login = true

                res.cookie('userData', {
                    firstName: user.first_name,
                    lastName: user.last_name,
                    rol: user.rol,
                });

                res.redirect('/products');
            } else {
                res.status(401).send({ resultado: 'Contraseña no válida', message: password })
            }
        } else {
            res.status(404).send({ resultado: 'Usuario no encontrado', message: user })
        }

    } catch (error) {
        res.status(400).send({ error: `Error en el inicio de sesión: ${error}` })
    }
})


sessionRouter.get('/logout', (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    /* res.status(200).send({ resultado: 'Usuario deslogueado' }) */
    res.redirect('/home', 200, { resultado: 'Usuario deslogueado' })
})

export default sessionRouter