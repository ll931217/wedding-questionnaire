import { Server } from "socket.io";

import db from "./data";

const SocketHandler = (_, res) => {
    if (res.socket.server.io) {
        console.log("Socket is already running");
    } else {
        console.log("Socket is initializing");
        const io = new Server(res.socket.server, {
            path: "/api/socket",
            addTrailingSlash: false,
        });
        res.socket.server.io = io;

        io.on("connection", (socket) => {
            socket.on("clientConnect", (clientId) => {
                db.addClient(clientId);
                io.emit("connectedClients", db.getConnected());
            });

            socket.on("clientDisconnect", (clientId) => {
                db.removeClient(clientId);
                io.emit("connectedClients", db.getConnected());
            });
        });
    }

    res.end();
};

export default SocketHandler;
