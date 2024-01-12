const Enquete = require('../models/enquete');

class UserService {
  async getEnquetes() {
    return await Enquete.findAll({include: "opcoes"});
  }

  async getEnqueteById(id) {
    return await Enquete.findByPk(id, { include: "opcoes"});
  }

  async createEnquete(titulo, dataInicio, dataFim) {
    // if (dataFim < dataInicio) {
    //   return null;
    // }

    const status = Enquete.calcularStatus(dataInicio, dataFim);

    return await Enquete.create({titulo, dataInicio, dataFim, status});
  }

  async updateEnquete(produto) {
    const produtoDb = await this.getEnqueteById(produto.id);

    if (!produtoDb) {
      return false;
    }

    await Enquete.update(
        produto,
        { where: { id: produto.id } }
    );

    return true;
  }

  async deleteEnquete(id) {
    return Enquete.destroy({
      where: { id: id }
    });
  }

  async checkEnqueteStatus() {
    console.log("testing");
    setInterval(async () => {
      const enquetes = await Enquete.findAll();

      for (let enquete of enquetes) {
        const dataInicio = enquete.get("dataInicio");
        const dataFim = enquete.get("dataFim");

        const status = Enquete.calcularStatus(dataInicio, dataFim);

        if (status !== enquete.get("status")) {
          console.log(`updating status of ${enquete.get("id")}`);
          enquete.set("status", status);
        }
      }
    }, 1000);
  }
}

module.exports = new UserService();
