import { query } from "../config/db.js";


export const receitaRepository = {
    async listarTodas() {
        const sql = `
      SELECT r.*, u.nome AS nome_autor
      FROM receita r
      LEFT JOIN usuario u ON r.id_usuario = u.id_usuario
      ORDER BY r.id_receita DESC;
    `;
        const resultado = await query(sql);
        return resultado.rows;
    },


    async buscarPorId(id) {
        const sql = `
      SELECT r.*, u.nome AS nome_autor
      FROM receita r
      LEFT JOIN usuario u ON r.id_usuario = u.id_usuario
      WHERE r.id_receita = $1;
    `;
        const resultado = await query(sql, [id]);
        return resultado.rows[0];
    },


    async listarPorUsuario(idUsuario) {
        const sql = `
      SELECT * FROM receita
      WHERE id_usuario = $1
      ORDER BY id_receita DESC;
    `;
        const resultado = await query(sql, [idUsuario]);
        return resultado.rows;
    },


    async criar(receita) {
        const { titulo, ingredientes, modo_preparo, tempo_preparo, rendimento, imagem_receita, id_usuario } = receita;
        const sql = `
      INSERT INTO receita (titulo, ingredientes, modo_preparo, tempo_preparo, rendimento, imagem_receita, id_usuario)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
        const params = [titulo, ingredientes, modo_preparo, tempo_preparo, rendimento, imagem_receita, id_usuario];
        const resultado = await query(sql, params);
        return resultado.rows[0];
    },


    async atualizar(id, receita) {
        const { titulo, ingredientes, modo_preparo, tempo_preparo, rendimento, imagem_receita } = receita;
        const sql = `
      UPDATE receita
      SET titulo = $1,
          ingredientes = $2,
          modo_preparo = $3,
          tempo_preparo = $4,
          rendimento = $5,
          imagem_receita = $6
      WHERE id_receita = $7
      RETURNING *;
    `;
        const params = [titulo, ingredientes, modo_preparo, tempo_preparo, rendimento, imagem_receita, id];
        const resultado = await query(sql, params);
        return resultado.rows[0];
    },


    async deletar(id) {
        const sql = `DELETE FROM receita WHERE id_receita = $1 RETURNING id_receita;`;
        const resultado = await query(sql, [id]);
        return resultado.rows[0];
    }
};
