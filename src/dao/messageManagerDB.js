import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export default class cartManager {

    constructor(archivo) {
        this.path = archivo
    }

    async getCart() {
        if (fs.existsSync(this.path)) {
            let lectura = await fs.promises.readFile(this.path, "utf-8")
            return JSON.parse(lectura)
        } else {
            return []
        }
    }

    async addCart() {
        let cart = { id: uuidv4(), products: [] }
        let carts = await this.getCart()
        carts.push(cart)
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5))
        return cart
    }

    async addProductCart(cid, pid) {
        let carts = await this.getCart()
        let cart = carts.findIndex(cart => cart.id == cid)
        if (cart != -1) {
            let existencia = carts[cart].products.findIndex(pr => pr.id == pid)
            if (existencia != -1) {
                carts[cart].products[existencia].quantity = carts[cart].products[existencia].quantity + 1
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5))
                return carts[cart].products[existencia]
            }
            let product = { id: pid, quantity: 1 }
            carts[cart].products.push(product)
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5))
            let idSurch = carts[cart].products.findIndex(pr => pr.id == pid)
            return carts[cart].products[idSurch]
        }
        return false

    }

    async getCartById(id) {
        let carts = await this.getCart()
        let copiacart = {}
        for (const cart of carts) {
            if (cart.id == id) {
                copiacart = cart
                console.log(cart)
                return cart
            }
        }
        return false
    }

    async updateCart(id, campo, cambio) {
        let carts = await this.getCart()
        let copiacart = {}
        let i = 0
        for (const cart of carts) {
            if (cart.id === id) {
                copiacart = cart
            }
            i++
        }

        let existencia = carts.findIndex(pr => pr.id === id)
        let estaAccion = carts
        estaAccion.splice(id - 1, 1)
        if (existencia !== -1) {
            function saberQueEsCampo() {
                switch (campo) {
                    case "title":
                        return copiacart.title = cambio
                    case "descrioption":
                        return copiacart.description = cambio
                    case "price":
                        return copiacart.price = cambio
                    case "thumbnail":
                        return copiacart.thumbnail = cambio
                    case "code":
                        return copiacart.code = cambio
                    case "stock":
                        return copiacart.stock = cambio
                }
            }
            saberQueEsCampo()
            estaAccion.push(copiacart)
            await fs.promises.writeFile(this.path, JSON.stringify(estaAccion, null, 5))
        }

    }

    async deleteCart(id) {
        let carts = await this.getCart()
        await fs.promises.unlink(this.path)
        for (const cart of carts) {
            let i = 0
            if (cart.id === id) {
                carts.splice(i, 1)
            }
            i++
        }

    }
}
