import { WebSocketServer } from 'ws';

class WebSocketManager {
    constructor(server) {
        this.wss = new WebSocketServer({server})
        this.clients = {}
        this.rooms = {}

        this.wss.on('connection', (socket, req) => {
            console.log('Новое подключение к серверу сокетов');
            const params = req.url.substr(1).split('&');

            const paramObj = {};
            params.forEach(param => {
                const [key, value] = param.split('=');
                paramObj[key] = value;
            });

            this.clients[paramObj["id"]] = {
                socket:socket,
                room:paramObj["room"]
            };

            this.joinRoom(paramObj["id"], this.clients[paramObj["id"]].room)

            socket.on('message', (message) => {
                const client = this.findClientBySocket(socket)
                this.sendToRoom(client.room, message)
            });

            socket.on('close', () => {
                for (let key in this.clients) {
                    if (this.clients.hasOwnProperty(key) && this.clients[key].socket === socket) {
                        this.leaveRoom(key, this.clients[key].room)
                        delete this.clients[key];
                    }
                }
                console.log('Соединение закрыто');
            });
        });
    }

    joinRoom(clientId, roomName) {
        if (this.rooms[roomName]) {
            this.rooms[roomName].add(clientId);
        }
        else {
            this.rooms[roomName] = new Set();
            this.rooms[roomName].add(clientId);
        }
    }

    leaveRoom(clientId, roomName) {
        if (this.rooms[roomName]) {
            this.rooms[roomName].delete(clientId);
        }
    }

    findClientBySocket(socket){
        for (let id in this.clients) {
            if (this.clients.hasOwnProperty(id) && this.clients[id].socket === socket) {
                return this.clients[id]
            }
        }
    }

    sendToRoom(roomName, message) {
        if (this.rooms[roomName]) {
            this.rooms[roomName].forEach((clientId) => {
                if (this.clients[clientId]) {
                    this.clients[clientId].socket.send(message);
                }
            });
        }
    }
}

export default WebSocketManager;