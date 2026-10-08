import {Router} from "express";
import {usuariosController} from "../controller/usuariosController.js";

const router = Router();

router.get('/usuario/login', usuariosController.login);

export default router;