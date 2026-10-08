import db from "../config/db.js";

export const usuariosController = {

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios." });
      }

      const [usuarios] = await db.query(
        "SELECT id, nome, email, foto, tipo FROM usuarios WHERE email = ? AND senha = ?",
        [email, senha]
      );

      if (usuarios.length === 0) {
        return res.status(401).json({ mensagem: "Usuário não encontrado ou senha incorreta." });
      }

      return res.status(200).json(usuarios[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
  },


  async buscarPorChef(req, res) {
    try {
      const { nome } = req.params;
      const nomeFormatado = nome.replace('@', '');

      const [receitas] = await db.query(
        `SELECT r.id, r.titulo, r.origem, r.imagem, u.nome AS chef,
                (SELECT COUNT(*) FROM favoritos f WHERE f.id_receita = r.id) AS total_favoritos
         FROM receitas r
         JOIN usuarios u ON r.id_usuario = u.id
         WHERE u.nome LIKE ?`,
        [`%${nomeFormatado}%`]
      );

      if (receitas.length === 0) {
        return res.status(404).json({ mensagem: "Chef não encontrado." });
      }

      return res.status(200).json(receitas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: "Erro ao buscar chef." });
    }
  },


  async obterPerfilChef(req, res) {
    try {
      const { id } = req.params;


      const [[{ total_receitas }]] = await db.query(
        "SELECT COUNT(*) AS total_receitas FROM receitas WHERE id_usuario = ?",
        [id]
      );

      const [[{ total_favoritos }]] = await db.query(
        `SELECT COUNT(f.id) AS total_favoritos
         FROM favoritos f
         JOIN receitas r ON f.id_receita = r.id
         WHERE r.id_usuario = ?`,
        [id]
      );

      return res.status(200).json({
        total_receitas,
        total_favoritos
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: "Erro ao carregar perfil." });
    }
  }
};