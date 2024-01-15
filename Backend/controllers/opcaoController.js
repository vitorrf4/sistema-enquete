const opcaoService = require('../services/opcaoService');

class OpcaoController {
    async addVoto(req, res) {
        try {
            const { id } = req.params;

            const opcaoAtualizada = await opcaoService.addVoto(id);

            if (!opcaoAtualizada) {
                return res.status(400).json({ error: "Opcão inválida"});
            }

            res.status(204).send();
        } catch (error) {
            console.error('Erro ao adicionar o voto:', error);
            res.status(500).json({ error: 'Ocorreu um erro na aplicação.' });
        }
    }
}

module.exports = new OpcaoController();
