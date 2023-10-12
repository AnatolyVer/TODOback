import { WebSocketServer } from 'ws';

const EVENT_CONNECTION = 'connection';
const EVENT_MESSAGE = 'message';
const EVENT_CLOSE = 'close';

class WebSocketManager {
    constructor(server) {
        this.wss = new WebSocketServer({ server });
        this.clients = {};
        this.rooms = {};

        this.wss.on(EVENT_CONNECTION, (socket, req) => this.onConnection(socket, req));
    }

    onConnection(socket, req) {
        console.log('Connection is opened');
        const {id, room} = this.parseRequestParameters(req.url.substr(1));

        this.clients[id] = {
            socket,
            room
        };

        this.addClientToRoom(id, room);

        socket.on(EVENT_MESSAGE, message => {
            this.sendMessageToRoom(socket, message);
        });

        socket.on(EVENT_CLOSE, () => {
            this.closeSocket(socket)
        });
    }

    parseRequestParameters(url) {
        const params = url.split('&');
        const paramObj = {};

        params.forEach(param => {
            const [key, value] = param.split('=');
            paramObj[key] = value;
        });

        return paramObj;
    }

    addClientToRoom(clientId, roomName) {
        if (!this.rooms[roomName]) {
            this.rooms[roomName] = new Set();
        }
        this.rooms[roomName].add(clientId);
    }
    findClientBySocket(socket) {
        for (let id in this.clients) {
            if (this.clients.hasOwnProperty(id) && this.clients[id].socket === socket) {
                return this.clients[id];
            }
        }
    }
    sendMessageToRoom(socket, message) {
        const client = this.findClientBySocket(socket);
        if (this.rooms[client.room]) {
            this.rooms[client.room].forEach(clientId => {
                const client = this.clients[clientId];
                if (client) {
                    client.socket.send(message);
                }
            });
        }
    }
    removeClientFromRoom(clientId, roomName) {
        const room = this.rooms[roomName];
        if (room) {
            room.delete(clientId);
            if (room.size === 0) {
                delete this.rooms[roomName];
            }
        }
    }
    closeSocket(socket){
        for (let key in this.clients) {
            if (this.clients.hasOwnProperty(key) && this.clients[key].socket === socket) {
                this.removeClientFromRoom(key, this.clients[key].room);
                delete this.clients[key];
                console.log('Connection is closed');
                return
            }
        }
    }
}

export default WebSocketManager;
