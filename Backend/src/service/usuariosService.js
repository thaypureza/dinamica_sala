import usuariosRepository from '../repository/usuariosRepository.js';

class UsuariosService {
    async listarUsuarios() {

        return await usuariosRepository.buscarTodos();
    }

    async buscarUsuarioPorId(id) {
        if (!id) {
            throw new Error('ID do usuário é obrigatório.');
        }
        const usuario = await usuariosRepository.buscarPorId(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado.');
        }
        return usuario;
    }

    async criarUsuario(dadosUsuario) {
        const { nome, email, senha } = dadosUsuario;


        if (!nome || !email || !senha) {
            throw new Error('Preencha todos os campos obrigatórios (nome, email, senha).');
        }


        const usuarioExiste = await usuariosRepository.buscarPorEmail(email);
        if (usuarioExiste) {
            throw new Error('Email já cadastrado no sistema.');
        }


        return await usuariosRepository.salvar(dadosUsuario);
    }

    async atualizarUsuario(id, dadosUsuario) {
        await this.buscarUsuarioPorId(id);
        return await usuariosRepository.atualizar(id, dadosUsuario);
    }

    async deletarUsuario(id) {
        await this.buscarUsuarioPorId(id);
        return await usuariosRepository.deletar(id);
    }
}

export default new UsuariosService();