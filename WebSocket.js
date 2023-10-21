import { WebSocketServer } from 'ws';
import ProjectService from "./service/ProjectService.js";

const EVENT_CONNECTION = 'connection';
const EVENT_MESSAGE = 'message';
const EVENT_CLOSE = 'close';

const UPDATE_TODO = 'update_todo'
const DELETE_TODO = 'delete_todo'
const ADD_TODO = 'add_todo'
const UPDATE_PROJECT = 'update_project'
const DELETE_PROJECT = 'delete_project'

class WebSocketManager {
    constructor(server) {
        this.wss = new WebSocketServer({ server });
        this.clients = {};
        this.rooms = {};

        this.wss.on(EVENT_CONNECTION, (socket, req) => this.onConnection(socket, req));
    }

    async onConnection(socket, req) {
        console.log('Connection is opened');
        const userID = this.parseRequestParameters(req.url.substr(1));

        const projects = await ProjectService.getUserProjectsID(userID)
        projects.forEach(project => this.addClientToRoom(userID, project))
        this.clients[userID] = {
            socket,
            rooms:projects
        };

        socket.on(EVENT_MESSAGE, async message => {
            const {type, payload} = JSON.parse(message)
            const projectId = payload.projectId
            switch (type) {
                case ADD_TODO:
                    await ProjectService.addTodo(projectId, payload)
                    break;
                case DELETE_TODO:
                    await ProjectService.deleteTodo(projectId, payload)
                    break;
                case UPDATE_TODO:
                    await ProjectService.updateTodo(projectId, payload)
                    break;
                case DELETE_PROJECT:
                    const userId = this.getClientIDBySocket(socket)
                    await ProjectService.deleteProject(userId, projectId)
                    break;
                case UPDATE_PROJECT:
                    await ProjectService.updateProject(payload)
                    break;
            }

            this.sendMessageToRoom(socket, projectId, message);
        });

        socket.on(EVENT_CLOSE, () => {
            this.closeSocket(socket)
        });
    }
    parseRequestParameters(url) {
        const [,id] = url.split('&')[0].split('=');
        return id;
    }
    addClientToRoom(clientId, roomName) {
        if (!this.rooms.hasOwnProperty(roomName)) {
            this.rooms[roomName] = new Set();
        }
        this.rooms[roomName].add(clientId);
    }
    getClientIDBySocket(socket) {
        for (let id in this.clients) {
            if (this.clients.hasOwnProperty(id) && this.clients[id].socket === socket) {
                return id;
            }
        }
    }
    sendMessageToRoom(socket, projectId, message) {
        if (this.rooms.hasOwnProperty(projectId)) {
            this.rooms[projectId].forEach(clientID => {
                const client = this.clients[clientID];
                if (client && client.socket !== socket) {
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
            if (this.clients[key].socket === socket) {
                const rooms =  this.clients[key].rooms
                rooms.forEach(room => this.removeClientFromRoom(key, room));
                delete this.clients[key];
                console.log('Connection is closed');
                return
            }
        }
    }
}



export default WebSocketManager;
