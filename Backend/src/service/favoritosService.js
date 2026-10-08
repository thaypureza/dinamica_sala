import favoritosRepository from '../repository/favoritosRepository.js';

class FavoritosService {

    async listarFavoritosDoUtilizador(usuarioId) {
        if (!usuarioId) {
            throw new Error('O ID do utilizador é obrigatório.');
        }

        return await favoritosRepository.buscarPorUsuario(usuarioId);
    }


    async adicionarFavorito(usuarioId, receitaId) {
        if (!usuarioId || !receitaId) {
            throw new Error('É necessário fornecer o ID do utilizador e o ID da receita.');
        }


        const jaEFavorito = await favoritosRepository.buscarFavorito(usuarioId, receitaId);
        if (jaEFavorito) {
            throw new Error('Esta receita já está na sua lista de favoritos.');
        }


        return await favoritosRepository.salvar({ usuarioId, receitaId });
    }


    async removerFavorito(usuarioId, receitaId) {
        if (!usuarioId || !receitaId) {
            throw new Error('É necessário fornecer o ID do utilizador e o ID da receita.');
        }


        const favoritoExistente = await favoritosRepository.buscarFavorito(usuarioId, receitaId);
        if (!favoritoExistente) {
            throw new Error('Este item não está na sua lista de favoritos.');
        }

        return await favoritosRepository.deletar(usuarioId, receitaId);
    }
}

export default new FavoritosService();