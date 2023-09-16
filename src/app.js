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

const app = express()
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = app.listen(PORT, () => {
    console.log(`Servidor puerto: ${PORT}`);
});

const io = new Server(server);

mongoose.connect('mongodb+srv://LeoRizza:password*@cluster0.yhmy0qn.mongodb.net/?retryWrites=true&w=majority')
    .then(async () => {
        console.log('BDD conectada')
    })
    .catch(() => console.log('Error en conexion a BDD'))

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', async (socket) => {
    console.log("Servidor Socket.io conectado");
    socket.on('mensajeConexion', (info) => {
        console.log(info);
    });
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

app.get('/static', async (req, res) => {
    res.render('home', {
        css: "style.css",
        titulo: "Ecommerce backend",
    });
});

app.get('/chat', async (req, res) => {
    res.render('chat', {
        css: "style.css",
        titulo: "Chat",
    });
});
