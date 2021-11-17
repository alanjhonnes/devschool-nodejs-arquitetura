import express from 'express';
import dotenv from 'dotenv';

const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

console.log(process.env);

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}


// App
const app = express();
app.get('/', (req, res) => {
    res.send('Hello world\n');
});
app.listen(PORT, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
