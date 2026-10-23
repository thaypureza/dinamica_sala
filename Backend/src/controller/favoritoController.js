import db from "../config/db.js";

export const favoritoController = {
  async getByUser(req, res) {
    try {
      const { id_usuario } = req.params;

      const queryText = `
        SELECT 
          f.id_favorito, 
          f.id_usuario, 
          f.id_receita, 
          f.created_at,
          f.updated,
          r.titulo_receita, 
          r.origem_receita, 
          r.url_imagem
        FROM public.favorito f
        INNER JOIN public.receita r ON f.id_receita = r.id_receita
        WHERE f.id_usuario = $1
      `;

      const result = await db.query(queryText, [id_usuario]);

      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Erro ao buscar favoritos do utilizador:", error);
      return res.status(500).json({ 
        mensagem: "Erro ao buscar favoritos do utilizador.",
        detalhe: error.message 
      });
    }
  },

  async toggleFavorito(req, res) {
    try {
      const { id_usuario, id_receita } = req.body;

      if (!id_usuario || !id_receita) {
        return res.status(400).json({ mensagem: "Utilizador e receita são obrigatórios." });
      }

      const checkQuery = `
        SELECT id_favorito FROM public.favorito 
        WHERE id_usuario = $1 AND id_receita = $2
      `;
      const existing = await db.query(checkQuery, [id_usuario, id_receita]);

      if (existing.rows.length > 0) {
        await db.query(
          "DELETE FROM public.favorito WHERE id_favorito = $1", 
          [existing.rows[0].id_favorito]
        );
        return res.status(200).json({ mensagem: "Favorito removido com sucesso.", favoritado: false });
      }

      const insertQuery = `
        INSERT INTO public.favorito (id_usuario, id_receita, created_at, updated) 
        VALUES ($1, $2, NOW(), NOW()) 
        RETURNING id_favorito, id_usuario, id_receita, created_at, updated
      `;
      const result = await db.query(insertQuery, [id_usuario, id_receita]);

      return res.status(201).json({ 
        mensagem: "Favorito adicionado com sucesso.", 
        favoritado: true, 
        dados: result.rows[0] 
      });

    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
      return res.status(500).json({ 
        mensagem: "Erro ao processar favorito.",
        detalhe: error.message 
      });
    }
  },

  async removerFavorito(req, res) {
    try {
      const { id_favorito } = req.params;

      const result = await db.query(
        "DELETE FROM public.favorito WHERE id_favorito = $1 RETURNING id_favorito",
        [id_favorito]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ mensagem: "Favorito não encontrado." });
      }

      return res.status(200).json({ mensagem: "Favorito removido com sucesso." });
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      return res.status(500).json({ 
        mensagem: "Erro ao remover favorito.",
        detalhe: error.message 
      });
    }
  }
};

export default favoritoController;