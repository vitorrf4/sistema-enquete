const Opcao = require('../models/opcao');
const sseService = require('./sseService');

class OpcaoService {
    async addVoto(id) {
        // check if opcao is EM_ANDAMENTO
        const opcao = await Opcao.findByPk(id);

        if (!opcao) {
            return false;
        }

        opcao.votos++;
        await opcao.save();
        sseService.emitVoto(opcao);

        return true;
    }
}

module.exports = new OpcaoService();
