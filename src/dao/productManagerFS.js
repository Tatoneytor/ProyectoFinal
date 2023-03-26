import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export default class productManager {

    constructor(archivo) {
        this.path = archivo
    }

    async getProduct() {
        if (fs.existsSync(this.path) && fs.statSync(this.path).size > 0) {
            let lectura = await fs.promises.readFile(this.path, "utf-8")
            return JSON.parse(lectura)
        } else {
            return []
        }
    }

    async addProduct(product) {
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
    }

    async getProductById(id) {
        let products = await this.getProduct()
        let copiaProduct = {}
        for (const producto of products) {
            if (producto.id == id) {
                copiaProduct = producto
                console.log(producto)
                return copiaProduct
            }
        }
        return false
    }

    async updateProduct(id, key, value) {
        let products = await this.getProduct()
        let existencia = products.findIndex(pr => pr.id == id)
        if (existencia !== -1) {
            products[existencia][key] = value
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        }
    }

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

