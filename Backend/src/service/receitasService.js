import receitasRepository from '../repository/receitasRepository.js';

class ReceitasService {
    async listarReceitas(usuarioId) {
        if (!usuarioId) {
            throw new Error('ID do usuário é obrigatório.');
        }
        return await receitasRepository.buscarPorUsuario(usuarioId);
    }

    async criarReceita(dadosReceita) {
        const { descricao, valor, data, categoria, usuarioId } = dadosReceita;


        if (!descricao || !valor || !data || !usuarioId) {
            throw new Error('Preencha os campos obrigatórios (descrição, valor, data e usuário).');
        }


        if (valor <= 0) {
            throw new Error('O valor da receita deve ser maior que zero.');
        }


        return await receitasRepository.salvar(dadosReceita);
    }

    async buscarPorId(id) {
        const receita = await receitasRepository.buscarPorId(id);
        if (!receita) {
            throw new Error('Receita não encontrada.');
        }
        return receita;
    }

    async atualizarReceita(id, dadosReceita) {
        await this.buscarPorId(id);

        if (dadosReceita.valor && dadosReceita.valor <= 0) {
            throw new Error('O valor da receita deve ser maior que zero.');
        }

        return await receitasRepository.atualizar(id, dadosReceita);
    }

    async deletarReceita(id) {
        await this.buscarPorId(id);
        return await receitasRepository.deletar(id);
    }
}

export default new ReceitasService();