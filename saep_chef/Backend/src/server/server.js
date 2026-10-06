import express from 'epress'
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.listen(PORT, ( ) => (

    console.log(`Servidor BACK rodando na porta ${PORT}`)
))
