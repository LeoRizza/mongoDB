import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import initializePassport from './config/passport.js'
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';
import { messageModel } from './models/messages.models.js';
import { productModel } from './models/products.models.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import router from './routes/index.routes.js'

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
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 60

    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

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

app.use('/', router)

app.get('/products', async (req, res) => {
    const userDataCookie = req.cookies.userData;
    if (req.session.login) {
        res.render('products', {
            css: "style.css",
            titulo: "Productos Ecommerce",
            login: req.session.login,
            userData: userDataCookie,
        });
    } else {
        res.redirect('/home');
    }
});


app.get('/chat', async (req, res) => {
    res.render('chat', {
        css: "style.css",
        titulo: "Chat",
    });
});

app.get('/home', async (req, res) => {
    res.render('home', {
        css: "style.css",
        titulo: "Login",
    });
});

app.get('/register', async (req, res) => {
    res.render('register', {
        css: "style.css",
        titulo: "Registrarme",
    });
});

