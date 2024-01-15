const produtoService = require('../services/enqueteService');

class EnqueteController {
  async getEnquetes(req, res) {
    try {
      const enquetes = await produtoService.getEnquetes();

      res.status(200).json(enquetes);
    } catch (error) {
      console.error('Erro ao buscar a enquete:', error);

      res.status(500).json({ error: 'Ocorreu um erro na aplicação.' });
    }
  }

  async getEnqueteById(req, res) {
    try {
      const { id } = req.params;
      const enquete = await produtoService.getEnqueteById(id);

      if (!enquete) {
        return res.status(404).json({error: "Enquete não encontrada"});
      }

      res.status(200).json(enquete);
    } catch (error) {
      console.error('Erro ao buscar a enquete:', error);
      res.status(500).json({ error: 'Ocorreu um erro na aplicação.' });
    }
  }

  async createEnquete(req, res) {
    try {
      const { titulo, dataInicio, dataFim, opcoes } = req.body;

      const novaEnquete = await produtoService.createEnquete(titulo, dataInicio, dataFim, opcoes);

      if (!novaEnquete) {
        return res.status(400).json({ error: "Enquete inválida"});
      }

      res.status(201).json(novaEnquete);
    } catch (error) {
      console.error('Erro ao criar a enquete:', error);
      res.status(500).json({ error: 'Ocorreu um erro na aplicação.' });
    }
  }

  async updateEnquete(req, res) {
    try {
      const enquete = req.body;
  
      const enqueteFoiAtualizada = await produtoService.updateEnquete(enquete);

      if (!enqueteFoiAtualizada) {
        return res.status(404).json({error: "Enquete não encontrada"});
      }

      return res.status(204).send();
    } catch(error) {
      console.error('Erro ao atualizar a enquete:', error);
      res.status(500).json({ error: 'Ocorreu um erro na aplicação.' });
    }
  }

  async deleteEnquete(req, res) {
    try {
      const { id } = req.params;
    
      const enquetesDeletadas = await produtoService.deleteEnquete(id);
      if (enquetesDeletadas <= 0) {
        return res.status(404).json({error: "Enquete não encontrada"});
      }

      res.status(204).send();
    } catch(error) {
      console.error('Erro ao deletar a enquete:', error);
      res.status(500).json({ error: 'Ocorreu um erro na aplicação.' });
    }
  }
}

module.exports = new EnqueteController();
