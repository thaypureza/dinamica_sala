import {Router} from "express";
import{usuariosController} from "../Controller/usuariosController" 

const router = Router();

router.get("/usuarios",usuarioController.login);

export default router 