const sse = require('better-sse');

class SseService {
    channel = sse.createChannel();

    async connect(req, res) {
        const session = await sse.createSession(req, res);
        this.channel.register(session);
    }

    async emitVoto(opcao) {
        this.channel.broadcast(opcao, 'voto');
    }
}

module.exports = new SseService();