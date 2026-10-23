import express from 'express';
import dotenv from 'dotenv';
import usuarioRoutes from '../routes/usuarioRoutes.js';
import receitaRoutes from '../routes/receitaRoutes.js';
import favoritoRoutes from '../routes/favoritoRoutes.js';

dotenv.config();
const app = express()

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(usuarioRoutes);
app.use(receitaRoutes);
app.use(favoritoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});