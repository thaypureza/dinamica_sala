import express from 'express';
import dotenv from 'dotenv';
import usuarioRoutes from '../routes/usuarioRoutes.js';

dotenv.config();
const app = express()

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(usuarioRoutes);
app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});