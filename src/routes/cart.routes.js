import { Router } from "express";
import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";

const cartRouter = Router()

cartRouter.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const cart = await cartModel.findById(id).populate('products.id_prod');

        if (cart) {
            res.status(200).send({ respuesta: 'OK', mensaje: cart });
        } else {
            res.status(404).send({ respuesta: 'Error en consultar Carrito', mensaje: 'Not Found' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ respuesta: 'Error en consulta carrito', mensaje: error });
    }
});

cartRouter.post('/', async (req, res) => {

    try {
        const cart = await cartModel.create({})
        res.status(200).send({ respuesta: 'OK', mensaje: cart })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en crear Carrito', mensaje: error })
    }
})

cartRouter.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body

    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            const prod = await productModel.findById(pid)

            if (prod) {
                const indice = cart.products.findIndex(item => item.id_prod == pid)
                if (indice != -1) {
                    cart.products[indice].quantity = quantity
                } else {
                    cart.products.push({ id_prod: pid, quantity: quantity })
                }
                const respuesta = await cartModel.findByIdAndUpdate(cid, cart)
                res.status(200).send({ respuesta: 'OK', mensaje: respuesta })
            } else {
                res.status(404).send({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Produt Not Found' })
            }
        } else {
            res.status(404).send({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Cart Not Found' })
        }

    } catch (error) {
        console.log(error)
        res.status(400).send({ respuesta: 'Error en agregar producto Carrito', mensaje: error })
    }
})

cartRouter.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartModel.findById(cid);

        if (cart) {
            const productIndex = cart.products.findIndex(item => item.id_prod._id == pid);

            if (productIndex != -1) {
                cart.products[productIndex].quantity = quantity;

                await cartModel.findByIdAndUpdate(cid, cart);

                res.status(200).send({ respuesta: 'OK', mensaje: 'Cantidad de producto actualizada en el carrito' });
            } else {
                res.status(404).send({ respuesta: 'Error en actualizar cantidad del producto en el Carrito', mensaje: 'Producto no encontrado en el carrito' });
            }
        } else {
            res.status(404).send({ respuesta: 'Error en actualizar cantidad del producto en el Carrito', mensaje: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ respuesta: 'Error en actualizar cantidad del producto en el Carrito', mensaje: error.message });
    }
});

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const cart = await cartModel.findById(cid);

        if (cart) {
            const productIndex = cart.products.findIndex(item => item.id_prod._id == pid);

            if (productIndex != -1) {
                cart.products.splice(productIndex, 1);

                await cartModel.findByIdAndUpdate(cid, cart);

                res.status(200).send({ respuesta: 'OK', mensaje: 'Producto eliminado del carrito' });
            } else {
                res.status(404).send({ respuesta: 'Error en eliminar producto del Carrito', mensaje: 'Producto no encontrado en el carrito' });
            }
        } else {
            res.status(404).send({ respuesta: 'Error en eliminar producto del Carrito', mensaje: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ respuesta: 'Error en eliminar producto del Carrito', mensaje: error.message });
    }
});

cartRouter.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartModel.findByIdAndDelete(cid);

        if (cart) {
            res.status(200).send({ respuesta: 'OK', mensaje: 'Carrito y productos relacionados eliminados' });
        } else {
            res.status(404).send({ respuesta: 'Error en eliminar carrito', mensaje: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ respuesta: 'Error en eliminar carrito', mensaje: error.message });
    }
});

export default cartRouter