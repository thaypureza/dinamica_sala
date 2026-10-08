import { Router } from "express";
import { usuariosController } from "../controller/usuariosController.js";

const router = Router();

router.get('/usuario/login', usuariosController.getAll);
router.get('/usuario/:id', usuariosController.getById);
router.post('/usuario', usuariosController.create);
router.put('/usuario/:id', usuariosController.update);
router.delete('/usuario/:id', usuariosController.delete);

export default router;
