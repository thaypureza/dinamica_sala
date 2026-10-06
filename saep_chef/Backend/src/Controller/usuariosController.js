export const usuarioController = {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email) {
        return res.status(400).json({
          erro: 'E-mail inválido ou vazio.'
        });
      }

      if (!senha) {
        return res.status(400).json({
          erro: 'Senha inválida ou vazia.'
        });
      }

      const [usuarios] = await query(
        "SELECT * FROM tb_USUARIO WHERE email = $1 AND senha = $2;",
        [email, senha]
      );

      if (!usuarios || usuarios.length === 0) {
        return res.status(401).json({
          erro: 'E-mail ou senha incorretos.'
        });
      }

      const usuario = usuarios;

      return res.status(200).json({
        id: usuario.id_usuario,
        nome: usuario.nome,
        nome_usuario: usuario.nome_usuario,
        email: usuario.email,
        imagem_usuario: usuario.imagem_usuario || null,
        tipo: usuario.tipo || 'user'
      });

    } catch (error) {
      return res.status(500).json({
        erro: 'Erro interno no servidor ao tentar realizar o login.',
        detalhes: error.message
      });
    }
  }
};
