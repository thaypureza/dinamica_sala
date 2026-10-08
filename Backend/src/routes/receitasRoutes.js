import { Router } from "express";

import { receitasController } from "../controller/receitasController.js";

const router = Router();


router.get('/receitas', receitasController.listarTodas);
router.get('/receitas/usuario/:id_usuario', receitasController.listarPorUsuario);
router.post('/receitas', receitasController.cadastrar);
router.delete('/receitas/:id', receitasController.excluir);

export default router;