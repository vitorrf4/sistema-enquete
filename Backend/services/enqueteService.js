const Enquete = require('../models/enquete');

class EnqueteService {
  async getEnquetes() {
    return await Enquete.findAll({include: "opcoes"});
  }

  async getEnqueteById(id) {
    return await Enquete.findByPk(id, { include: "opcoes"});
  }

  async createEnquete(titulo, dataInicio, dataFim, opcoes) {
    const dateInicio = new Date(dataInicio).getTime();
    const dateFim = new Date(dataFim).getTime();

    if (dateFim <= dateInicio) {
      return null;
    }

    if (opcoes.length < 3 || opcoes.length > 5) {
      return null;
    }

    const status = Enquete.calcularStatus(dataInicio, dataFim);

    return await Enquete.create({titulo, dataInicio, dataFim, status, opcoes},
        {include: ["opcoes"]});
  }

  async updateEnquete(enquete) {
    const enqueteDb = await this.getEnqueteById(enquete.id);

    if (!enqueteDb) {
      return false;
    }

    await Enquete.update(
        enqueteDb,
        { where: { id: enquete.id } }
    );

    return true;
  }

  async deleteEnquete(id) {
    return Enquete.destroy({
      where: { id: id }
    });
  }

  async checkEnqueteStatus() {
    let minutoAnterior = new Date(Date.now()).getMinutes();
    setInterval(async () => {
      const minutoAtual = new Date(Date.now()).getMinutes();

      if (minutoAtual > minutoAnterior) {
        minutoAnterior = minutoAtual;
        const enquetes = await Enquete.findAll();

        for (let enquete of enquetes) {
          const dataInicio = enquete.get("dataInicio");
          const dataFim = enquete.get("dataFim");

          const status = Enquete.calcularStatus(dataInicio, dataFim);

          if (status !== enquete.get("status")) {
            enquete.set("status", status);
            await enquete.save();
          }
        }
      }

    }, 1000);
  }
}

module.exports = new EnqueteService();
