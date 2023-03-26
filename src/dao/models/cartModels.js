import { Schema, model } from "mongoose";

const cartsColeccion = 'carts';

const cartsEsquema = new Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: Number 
            }
        ]
    }
});

export const cartsModels = model(cartsColeccion, cartsEsquema)
