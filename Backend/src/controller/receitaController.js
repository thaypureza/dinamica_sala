import db from "../config/db.js";

export const receitaController = {
  async getAll(req, res) {
    try {
      const result = await db.query(
        `SELECT r.id_receita, r.titulo_receita, r.origem_receita, r.url_imagem, r.id_usuario, u.nome AS chef,
                COUNT(f.id_favorito)::int AS total_favorito
         FROM public.receita r
         JOIN public.usuario u ON r.id_usuario = u.id_usuario
         LEFT JOIN public.favorito f ON f.id_receita = r.id_receita
         GROUP BY r.id_receita, r.titulo_receita, r.origem_receita, r.url_imagem, r.id_usuario, u.nome`
      );
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: "Erro ao buscar receitas." });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await db.query(
        `SELECT r.id_receita, r.titulo_receita, r.origem_receita, r.url_imagem, r.id_usuario, u.nome AS chef
         FROM public.receita r
         JOIN public.usuario u ON r.id_usuario = u.id_usuario
         WHERE r.id_receita = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ mensagem: "Receita não encontrada." });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: "Erro ao buscar receita." });
    }
  },

  async create(req, res) {
    try {
      const { titulo_receita, origem_receita, url_imagem, id_usuario } = req.body;

      if (!titulo_receita || !origem_receita || !url_imagem || !id_usuario) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
      }

      const now = new Date();
      const result = await db.query(
        `INSERT INTO public.receita (titulo_receita, origem_receita, url_imagem, id_usuario, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id_receita, titulo_receita, origem_receita, url_imagem, id_usuario`,
        [titulo_receita, origem_receita, url_imagem, id_usuario, now, now]
      );

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: "Erro ao cadastrar receita." });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { titulo_receita, origem_receita, url_imagem } = req.body;
      const now = new Date();

      const result = await db.query(
        `UPDATE public.receita 
         SET titulo_receita = $1, origem_receita = $2, url_imagem = $3, updated_at = $4 
         WHERE id_receita = $5 
         RETURNING id_receita, titulo_receita, origem_receita, url_imagem, id_usuario`,
        [titulo_receita, origem_receita, url_imagem, now, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ mensagem: "Receita não encontrada." });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: "Erro ao atualizar receita." });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await db.query("DELETE FROM public.favorito WHERE id_receita = $1", [id]);


      const result = await db.query(
        "DELETE FROM public.receita WHERE id_receita = $1 RETURNING id_receita",
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ mensagem: "Receita não encontrada." });
      }

      return res.status(200).json({ mensagem: "Receita excluída com sucesso." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: "Erro ao excluir receita." });
    }
  }
};

export default receitaController;