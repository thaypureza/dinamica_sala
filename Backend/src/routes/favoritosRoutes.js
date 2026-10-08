import { Router } from "express";

import { favoritosController } from "../controller/favoritosController.js";

const router = Router();


router.post('/favoritos', favoritosController.toggleFavorito);
router.get('/favoritos/usuario/:id_usuario', favoritosController.listarFavoritosUsuario);

export default router;