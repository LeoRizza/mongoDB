import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import userRouter from './routes/users.routes.js'
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/cart.routes.js'
import chatRouter from './routes/chat.routes.js'
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';
import { messageModel } from './models/messages.models.js';
import { productModel } from './models/products.models.js'
import cookieParser from 'cookie-parser'

const app = express()
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = app.listen(PORT, () => {
    console.log(`Servidor puerto: ${PORT}`);
});

const io = new Server(server);

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log('BDD conectada')
    })
    .catch(() => console.log('Error en conexion a BDD'))


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(cookieParser(process.env.SIGNED_COOKIE))


io.on('connection', async (socket) => {
    console.log("Servidor Socket.io conectado");
    socket.on('mensajeConexion', (info) => {
        console.log(info);
    });

    try {
        const messages = await messageModel.find().sort({ postTime: 1 }).lean();
        socket.emit('mensajesPrevios', messages);

        const productos = await productModel.find();
        socket.emit('productos', productos);

    } catch (error) {
        console.error('Error al obtener mensajes previos o productos:', error);
    }

    socket.on('enviarMensaje', async (data) => {
        try {
            const newMessage = new messageModel(data);
            await newMessage.save();

            io.emit('mensajeNuevo', newMessage);
        } catch (error) {
            console.error('Error al guardar el mensaje en la base de datos:', error);
        }
    });
});


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/chat', chatRouter);

//cookies
app.get('/setCookie', (req, res) => {
    res.cookie('CookieCookie', 'Esto es una cookie', { maxAge: 10000, signed: true }).send('Cookie generada')
})

app.get('/getCookie', (req, res) => {
    res.send(req.signedCookies)
})

app.get('/products', async (req, res) => {
    res.render('products', {
        css: "style.css",
        titulo: "Productos Ecomerce",
    });
});

app.get('/chat', async (req, res) => {
    res.render('chat', {
        css: "style.css",
        titulo: "Chat",
    });
});
