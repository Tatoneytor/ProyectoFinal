import { Schema, model } from "mongoose";

const messagesColeccion = 'messages';

const messagesEsquema = new Schema({
    user: String,
    message: String
});

export const messagesModelo = model(messagesColeccion, messagesEsquema)
