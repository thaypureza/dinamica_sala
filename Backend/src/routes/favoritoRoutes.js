import { Router } from "express";
import { favoritoController } from "../controller/favoritoController.js";

const router = Router();

router.post('/favorito', favoritoController.toggleFavorito);
router.get('/favorito/usuario/:id_usuario', favoritoController.getByUser);
router.delete('/favorito/:id_favorito', favoritoController.removerFavorito);
export default router;