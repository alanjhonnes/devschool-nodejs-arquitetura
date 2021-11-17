import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { adicionaUsuarioController, usuariosController } from './controllers/usuarios.controller';

dotenv.config(); 

const PORT = process.env.PORT || 3000; 
const HOST = '127.0.0.1';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

console.log(process.env);



// App
const app = express();
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Hello world\n');
});
app.get('/usuarios', usuariosController);
app.post('/usuarios', adicionaUsuarioController);

app.listen(PORT, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
