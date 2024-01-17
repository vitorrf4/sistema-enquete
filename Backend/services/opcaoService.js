const Opcao = require('../models/opcao');
const Enquete = require('../models/enquete');
const sseService = require('./sseService');

class OpcaoService {
    async addVoto(id) {
        const opcao = await Opcao.findByPk(id);

        if (!opcao) {
            return false;
        }

        const enquete = await Enquete.findByPk(opcao.EnqueteId);
        if (enquete.status !== "EM_ANDAMENTO") {
            return false;
        }

        opcao.votos++;
        await opcao.save();
        sseService.emitVoto(opcao);

        return true;
    }
}

module.exports = new OpcaoService();
