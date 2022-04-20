import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { adicionaUsuarioController, usuariosController } from './controllers/usuarios.controller';
import pino from 'express-pino-logger';



dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

console.log(process.env);



// App
const app = express();

app.use(bodyParser.json());
app.use(pino({
    enabled: true,
    autoLogging: true,
}))
app.get('/', (req, res) => {
    res.send('Hello world\n');
});
app.get('/usuarios', usuariosController);
app.post('/usuarios', adicionaUsuarioController);

const signalHandler = (signal: NodeJS.Signals) => {
    console.log('sinal de término')
    console.log(signal)
}

process.on('SIGINT', signalHandler)
process.on('SIGTERM', signalHandler)



app.listen(PORT, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
