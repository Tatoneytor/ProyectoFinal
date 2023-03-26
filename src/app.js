import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

//import path from 'path'



const PORT = 8080;

const app = express();
const server = app.listen(PORT, () => {
  console.log(`Server escuchando en puerto ${PORT}`);
});

const io = new Server(server);

app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));
app.set('view engine', 'handlebars');
//app.set('views', path2.join(__dirname,'./views'));
app.set('views', './src/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public/assets'));

app.use('/api/products', (req, res, next) => {
  req.serverSocket = io;
  next();
}, productsRouter);

app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);


// import { MongoClient } from "mongodb";
// const username = encodeURIComponent("<tatotatoaguero>");
// const password = encodeURIComponent("<Tatotato142857.>");
// const cluster = "<clusterName>";
// const authSource = "<authSource>";
// const authMechanism = "<authMechanism>";

// let uri =
// `mongodb+srv://${username}:${password}@${cluster}/?authSource=${authSource}&authMechanism=${authMechanism}`;
// const client = new MongoClient(uri);



const env = async () => {
  try {
    //await client.connect();
    //const database = client.db("<dbName>");
    //const ratings = database.collection("<collName>");
    //const cursor = ratings.find();
    //await cursor.forEach(doc => console.dir(doc));


    await mongoose.connect('mongodb+srv://joaquintatoaguero:Tatotato142857.@cluster0.ywbl7gx.mongodb.net/?retryWrites=true&w=majority&name=desafio-01')
    // await mongoose.connect("mongodb+srv://cluster0.cbslnee.mongodb.net/myFirstDatabase")
    //mongosh "mongodb+srv://cluster0.cbslnee.mongodb.net/myFirstDatabase" --apiVersion 1 --username tatotatoaguero
    // await mongoose.connect('mongodb+srv://coderhouse:coderhouse@cluster0.v8ivmdl.mongodb.net/?retryWrites=true&w=majority&dbName=base_clase9')
    console.log(`Conexión a servidor DB establecida...!!!`);

    // await cursoModelo.deleteMany({});
    // let resultado=await cursoModelo.create({
    //     codigo:109,
    //     nombre: 'Calculo II',
    //     horasPorSemana:8,
    //     temas:['limite','derivadas','integrales']
    // })
    // console.log(resultado);

    // await alumnoModelo.deleteMany({});
    // let resultado=await alumnoModelo.create({
    //     nombre:'Martin',
    //     apellido:'Palermo', dni:22000111,
    //     origen:'Argentina',
    //     cursando:[
    //         {
    //             curso:'640c8cefccef652b9d2f49b4'
    //         }
    //     ]
    // });
    // console.log(resultado)

  } catch (error) {
    console.log(error);
  }
}


env();

const mensajes = [];
const serverSockets = new Server(server);

serverSockets.on('connection', (socket) => {
  // console.log(socket.handshake);
  console.log(`Se han conectado, socket id ${socket.id}`)

  socket.emit('hola', {
    emisor: 'Servidor',
    mensaje: `Hola, desde el server...!!!`,
    mensajes
  })

  socket.on('respuestaAlSaludo', (mensaje) => {
    console.log(`${mensaje.emisor} dice ${mensaje.mensaje}`);

    socket.broadcast.emit('nuevoUsuario', mensaje.emisor)
  })

  socket.on('mensaje', (mensaje) => {
    console.log(`${mensaje.emisor} dice ${mensaje.mensaje}`);

    // todo el codigo que quiera...
    mensajes.push(mensaje);
    console.log(mensajes);

    // socket.broadcast.emit('nuevoMensaje',mensaje)
    serverSockets.emit('nuevoMensaje', mensaje)

  })


}) // fin de server.on connection

server.on('error', (error) => console.log(error));
