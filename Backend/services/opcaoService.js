const Opcao = require('../models/opcao');
const sseService = require('./sseService');

class OpcaoService {
    async addVoto(id) {
        const opcao = await Opcao.findByPk(id);

        if (!opcao) {
            return false;
        }

        opcao.votos++;
        await opcao.save();
        await sseService.emitVoto(opcao);

        return true;
    }
}

module.exports = new OpcaoService();
