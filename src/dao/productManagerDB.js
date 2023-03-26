import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { productModels } from './models/productModels.js';


export default class productManager {

    constructor() {
    }

    async getProduct(req, res) {
        let sort = req.query.sort
        let limit = req.query.limit

        //No entiendo que se hace con el page
        let page = req.query.page
        //No entiendo que se hace con el query
        let query = req.query.query
        let products;
        let filtro = {}

        //Anda
        console.log(sort);
        sort == 'asc' ? filtro = { title: 1 } : filtro = ''
        sort == 'desc' ? filtro = { title: -1 } : filtro = filtro

        console.log(filtro);
        // No puedo agregarle el filtro ya que no funciona con el find()
        try {
            products = await productModels.find().sort(filtro)
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({
                mensaje: `Error al obtener products de la DB`
            })
        }
        //console.log(products);

        limit ? (products.length <= limit ? products.splice(limit, products.length) : false) : false
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            message: 'Todo ok...',


            //Nuevo metodo de envio de productos, como si fuese un libro
            // o una carta

            //status: success / error,
            payload: products,
            /* totalPages:products.length,
            prevPage: yaVeremos,
            nextPage: yaVeremos,
            hasPrevPage: yaVeremos,
            hasNextPage: yaVeremos,
            prevLink:yaVeremos,
            nextLink:yaVeremos */
        })

    }

    async addProduct(req, res) {

        // faltan las validaciones:
        // - que lleguen todos los datos necesarios, obligatorios (hay que mirar en el Schema,
        // lo que definimos como required)
        // - que no se generen duplicados en la coleccion (en el Schema estar atentos a los unique)
        // ... etc....


        /* res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({
            productsCreados
        }) */
        let io = req.serverSocket
        let product = req.body
        console.log(product);
        if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category || Object.keys(product).some(key => key !== 'title' && key !== 'description' && key !== 'code' && key !== 'price' && key !== 'stock' && key !== 'category' && key !== 'thumbnail')) {
            res.setHeader('Content-Type', 'application/json')
            let falta = []
            if (!product.title) {
                falta.push("title")
            }
            if (!product.description) {
                falta.push("description")
            }
            if (!product.code) {
                falta.push("code")
            }
            if (!product.price) {
                falta.push("price")
            }
            if (!product.stock) {
                falta.push("stock")
            }
            if (!product.category) {
                falta.push("category")
            }
            falta.join(", ")
            if (falta.length) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json({
                    message: `400 Bad Request. Debe ingresar: ${falta}. Para poder cargar el producto`,
                    product
                })
            }
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({
                message: `400 Bad Request. Hay parámetros que está ingresando de sobra.`,
                product
            })
        }
        let productsEnVerificacion
        // SE SUPONE QUE ESTO QUE ACABO DE CREAR DEBERÍA FUNCIONAR :D.
        await productModels.findOne({ code: product.code }) ? productsEnVerificacion = false : productsEnVerificacion = true
        productsEnVerificacion ? (await productModels.findOne({ title: product.title }) ? productsEnVerificacion = false : productsEnVerificacion = true) : productsEnVerificacion = false
        console.log(productsEnVerificacion);
        if (productsEnVerificacion) {
            let productsCreados = await productModels.create(product);
            let products = await productModels.find()
            io.emit('editProduct', products);
            console.log(productsCreados)
            res.setHeader('Content-Type', 'application/json')
            return res.status(201).json({
                message: `Todo ok...!`,
                product
            })
        } else {
            res.setHeader('Content-Type', 'application/json')
            res.status(400).json({
                message: `400 Bad Request. El product con código: ${product.code} . Ya existe en la base de datos`
            })
        }
    }

    /* async addProduct(product) {
        let products = await this.getProduct() 
        let code = products.findIndex(pr => pr.code == product.code)
        if (code == -1) { 
            product.status = true
            product.id = uuidv4()
            products.push(product)
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
            return true
        } else {
            console.log(`El producto con código: ${product.code} . Ya existe en ${this.path}`)
            return false
        }
    } */

    async getProductById(id) {
        let products = await productModels.find({ _id: id })
        products ? products : false
        return products
        /* let copiaProduct = {}
        for (const producto of products) {
            if (producto.id == id) {
                copiaProduct = producto
                console.log(producto)
                return copiaProduct
            }
        }
        return false */
    }


    //Debo hacerlo funcionar con la DB
    async updateProduct(id, key, value) {
        let products = await productModels.find({ _id: id })

        let existencia = products.findIndex(pr => pr.id == id)
        if (existencia !== -1) {
            products[existencia][key] = value
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        }
    }

    //Debo hacerlo funcionar con la DB
    async deleteProduct(id) {
        let products = await this.getProduct()
        let quePaso = products.filter(pr => pr.id == id)
        if (quePaso != -1) {
            let updatedProducts = products.filter(producto => producto.id !== id)
            await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts, null, 5))
            return true
        }
        return false
    }
}

