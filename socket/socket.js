/**
 * Socket server handler
 * 
 * @Chat Chat schema for mongo DB 
 * 
 * @param server|object
 */
const Chat = require('../models/ChatSchema')


module.exports = function(server) {

    const io = require('socket.io')(server);

    io.on('connection', function (socket) {

        socket.room = 0;
        socket.username = 'Anon'
        
        socket.on('new message', function(msg, username) { 
            socket.username = username           
            let  chatMessage  =  new Chat({ message: msg, sender: socket.username, room: socket.room});
            io.to(socket.room).emit('getMsg', chatMessage);
            chatMessage.save();        
        });

        socket.on('roomchange', function (room) {
            socket.room ? socket.leave(socket.room) : null;
            socket.room = room; 
            socket.join(socket.room)
            Chat.find({room: socket.room})
                .then((msg) => {        
                    for (let i = 0; i < msg.length && i < 20; i++) {
                        socket.emit('getMsg', msg[i])
                    }
                })
                .catch((e) => {
                    console.log(e)
                })
        })
    });
}