import { query } from "../config/db.js";


export const usuarioRepository = {
    async buscarPorEmailESenha(email, senha) {
        const sql = `
      SELECT id_usuario, nome, nome_usuario, email, senha, imagem_usuario, tipo
      FROM usuario
      WHERE email = $1 AND senha = $2;
    `;
        const resultado = await query(sql, [email, String(senha)]);
        return resultado.rows[0];
    },


    async buscarPorId(id) {
        const sql = `
      SELECT id_usuario, nome, nome_usuario, email, imagem_usuario, tipo
      FROM usuario
      WHERE id_usuario = $1;
    `;
        const resultado = await query(sql, [id]);
        return resultado.rows[0];
    },


    async listarTodos() {
        const sql = `
      SELECT id_usuario, nome, nome_usuario, email, imagem_usuario, tipo
      FROM usuario
      ORDER BY id_usuario ASC;
    `;
        const resultado = await query(sql);
        return resultado.rows;
    },


    async criar(usuario) {
        const { nome, nome_usuario, email, senha, imagem_usuario, tipo } = usuario;
        const sql = `
      INSERT INTO usuario (nome, nome_usuario, email, senha, imagem_usuario, tipo)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id_usuario, nome, nome_usuario, email, imagem_usuario, tipo;
    `;
        const params = [nome, nome_usuario, email, senha, imagem_usuario, tipo];
        const resultado = await query(sql, params);
        return resultado.rows[0];
    }
};
