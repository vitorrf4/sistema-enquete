const sse = require('better-sse');

class SseService {
    channel = sse.createChannel();

    async connect(req, res) {
        const session = await sse.createSession(req, res);
        this.channel.register(session);
    }

    emitVoto(opcao) {
        this.channel.broadcast(opcao, 'voto');
    }

    emitStatus(enquete) {
        this.channel.broadcast(enquete, 'status');
    }

}

module.exports = new SseService();