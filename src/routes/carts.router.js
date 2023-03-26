import { Router } from 'express';
const router = Router();
import cartManager from '../dao/cartManagerFS.js';
const cm = new cartManager('./src/files/carts.json');
import productManager from '../dao/productManagerFS.js';
const pm = new productManager("./src/files/products.json");

router.get('/', cm.getCart)

router.get('/:cid', async (req, res) => {
    let id = req.params.cid
    let carrito = await cm.getCartById(id)
    let productos = carrito.products
    if (carrito) {
        res.setHeader('Content-type', 'application/json')
        return res.status(200).json({
            message: `Los productos del carrito ${id} son: `,
            productos
        })
    }

    res.setHeader('Content-Type', 'application/json')
    res.status(404).json({
        message: `404 Not Found. No se ha encontrado un carta con el id: ${id}`
    })
})


router.post('/', cm.addCart)

router.post('/:cid/product/:pid', async (req, res) => {
    let idCart = req.params.cid
    let idProduct = req.params.pid
    existencia = await pm.getProductById(idProduct)
    if (!existencia) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(404).json({
            messsge: `404 Not Found. El producto que se intenta añadir al carro no está registrado`
        })
    }

    let productAdded = await cm.addProductCart(idCart, idProduct)
    if (productAdded) {
        console.log(productAdded)
        res.setHeader('Content-Type', 'application/json')
        return res.status(201).json({
            message: `Todo ok...!`,
            productAdded
        })
    } else {
        res.setHeader('Content-Type', 'application/json')
        res.status(400).json({
            message: `400 Bad Request. El carrito con id${idCart} no existe en la ruta ${cm.path}`
        })
    }
})


/* 
router.put('/:pid', async (req, res) => {
    let id = req.params.pid
    let key = req.body.key
    let value = req.body.value

    if (!id || !key || !value) {

        let falta = []
        if (!id) {
            falta.push("id")
        }
        if (!key) {
            falta.push("key")
        }
        if (!value) {
            falta.push("value")
        }
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({
            message: `400 Bad Request. Debe ingresar: ${falta}. Para poder actualizar el carta.`
        })
    }

    let indice = await cm.getcartById(id)

    if (indice) {
        await cm.updatecart(id, key, value)
        let cart = await cm.getcartById(id)
        res.setHeader('Content-Type', 'application/json')
        return res.status(201).json({
            message: `Todo ok...!`,
            cart
        })
    }
    res.setHeader('Content-Type', 'application/json')
    return res.status(404).json({
        message: `404 Not Found. No se encuentra el carta con id: ${id} en la base de datos.`
    })
})



router.delete('/:pid', async (req, res) => {
    let id = req.params.pid
    let quePaso = await cm.deletecart(id)
    let carts = await cm.getcart()
    if (quePaso) {
        let eliminado = await cm.getcartById(id)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({
            message: `Todo ok... carta con id ${id} eliminado: ${eliminado.title}`,
            carts
        })
    }
    res.setHeader('Content-Type', 'application/json')
    res.status(404).json({
        message: `404 Not Found. No se encontro el carta con id ${idcart}`,
        carts
    }) 

})*/

export default router