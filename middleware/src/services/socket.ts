import config from "../config";
import { singleton } from "../decorators/singleton";

@singleton
export class SocketService {
    private io;
    constructor() { }

    public connect(app) {
        console.log('connecting socket');
        const server = require('http').createServer(app);
        this.io = require('socket.io')(server, { origins: [config.socketUrl] });
        server.listen(3000);

        this.io.on('connection', function (socket) {
            console.log('socket connection status: ', socket.connected);
            socket.emit('message', { message: 'a new client connected' });
        });
    }

    public sendMsg(msg) {
        console.log('sendMsg from socket');
        this.io.emit('new message', msg);
    }

    public disconnect() {
        console.log('disconnect socket');
        this.io.disconnect();
    }
}

