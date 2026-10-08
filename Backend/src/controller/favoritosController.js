import db from "../config/db.js";

export const favoritosController = {

    async toggleFavorito(req, res) {
        try {
            const { id_usuario, id_receita } = req.body;

            if (!id_usuario || !id_receita) {
                return res.status(400).json({ mensagem: "Usuário e receita são obrigatórios." });
            }


            const [existe] = await db.query(
                "SELECT * FROM favoritos WHERE id_usuario = ? AND id_receita = ?",
                [id_usuario, id_receita]
            );

            if (existe.length > 0) {

                await db.query(
                    "DELETE FROM favoritos WHERE id_usuario = ? AND id_receita = ?",
                    [id_usuario, id_receita]
                );
                return res.status(200).json({ acao: "removido", mensagem: "Favorito removido." });
            } else {

                await db.query(
                    "INSERT INTO favoritos (id_usuario, id_receita) VALUES (?, ?)",
                    [id_usuario, id_receita]
                );
                return res.status(201).json({ acao: "adicionado", mensagem: "Favoritado com sucesso." });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro ao processar favorito." });
        }
    },


    async listarFavoritosUsuario(req, res) {
        try {
            const { id_usuario } = req.params;
            const [favoritos] = await db.query(
                "SELECT id_receita FROM favoritos WHERE id_usuario = ?",
                [id_usuario]
            );
            const ids = favoritos.map(f => f.id_receita);
            return res.status(200).json(ids);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro ao listar favoritos." });
        }
    }
};