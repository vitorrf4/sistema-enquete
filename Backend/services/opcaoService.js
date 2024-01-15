const Opcao = require('../models/opcao');

class OpcaoService {
    async addVoto(id) {
        const opcao = await Opcao.findByPk(id);

        if (!opcao) {
            return false;
        }

        opcao.votos++;
        await opcao.save();

        return true;
    }
}

module.exports = new OpcaoService();
