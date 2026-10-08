import db from "../config/db.js";

export const receitasController = {

    async listarTodas(req, res) {
        try {
            const [receitas] = await db.query(
                `SELECT r.id, r.titulo, r.origem, r.imagem, r.id_usuario, u.nome AS chef,
                COUNT(f.id) AS total_favoritos
         FROM receitas r
         JOIN usuarios u ON r.id_usuario = u.id
         LEFT JOIN favoritos f ON f.id_receita = r.id
         GROUP BY r.id, r.titulo, r.origem, r.imagem, r.id_usuario, u.nome`
            );
            return res.status(200).json(receitas);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro ao buscar receitas." });
        }
    },


    async listarPorUsuario(req, res) {
        try {
            const { id_usuario } = req.params;
            const [receitas] = await db.query(
                "SELECT id, titulo, origem, imagem FROM receitas WHERE id_usuario = ?",
                [id_usuario]
            );
            return res.status(200).json(receitas);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro ao buscar receitas do usuário." });
        }
    },


    async cadastrar(req, res) {
        try {
            const { titulo, origem, imagem, id_usuario } = req.body;

            if (!titulo || !origem || !imagem || !id_usuario) {
                return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
            }

            const [result] = await db.query(
                "INSERT INTO receitas (titulo, origem, imagem, id_usuario) VALUES (?, ?, ?, ?)",
                [titulo, origem, imagem, id_usuario]
            );

            return res.status(201).json({ id: result.insertId, titulo, origem, imagem, id_usuario });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro ao cadastrar receita." });
        }
    },


    async excluir(req, res) {
        try {
            const { id } = req.params;


            await db.query("DELETE FROM favoritos WHERE id_receita = ?", [id]);
            await db.query("DELETE FROM receitas WHERE id = ?", [id]);

            return res.status(200).json({ mensagem: "Receita excluída com sucesso." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro ao excluir receita." });
        }
    }
};