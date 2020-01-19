/**
 * Socket server handler
 * 
 * @param server|object
 */

module.exports = function(server) {

    const io = require('socket.io')(server);

    io.on('connection', function (socket) {
    
        socket.room = null;
        socket.username = 'Anon'
        socket.roomClients = io.sockets.adapter.rooms;

        socket.on("roomIn", room => {
            if (socket.room !== room) {
                socket.room = room;
                if (!socket.roomClients[room]) {
                    socket.join(room);
                    io.sockets.to(socket.room).emit("roomReadyHeandler", false);
                    socket.emit("roomAccept", room);
                } else {
                    const roomMembersCount = Object.keys(
                        socket.roomClients[room].sockets
                    ).length;

                    if (roomMembersCount > 2) {
                        socket.emit("roomFull");
                        return;
                    } else {
                        socket.join(room);
                        io.sockets.to(room).emit("roomMemChange", roomMembersCount);
                        socket.emit("roomAccept", room, roomMembersCount);
                    }
                    if (roomMembersCount === 2) {
                        io.sockets.to(room).emit("roomReadyHeandler", true);
                    } else {
                        io.sockets.to(room).emit("roomReadyHeandler", false);
                    }
                }
            }
        });

        socket.on('roomOut', (room) => {
            socket.leaveAll();
            if (socket.roomClients[room]) {
                const oldRoomMembersCount = Object.keys(
                    socket.roomClients[room].sockets
                ).length;
    
                io.sockets.to(room).emit("roomMemChange", oldRoomMembersCount - 1);
                io.sockets.to(room).emit("roomReadyHeandler", false);
            }
        })

        require("./game")(socket, io);
    });
}

