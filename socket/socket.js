/**
 * Socket server handler
 * 
 * @Chat Chat schema for mongo DB 
 * @Bot model
 * 
 * @param server|object
 */
const Chat = require('../models/ChatSchema')
const Bot = require('../models/Bot')


module.exports = function(server) {

    const io = require('socket.io')(server);

    io.on('connection', function (socket) {
    
        socket.room = 0;
        socket.username = 'Anon'
        socket.bot = {}
        socket.time = []

        socket.on('new message', function(msg, username) { 
            socket.username = username           
            let  chatMessage  =  new Chat({ message: msg, sender: socket.username, room: socket.room});
            io.to(socket.room).emit('getMsg', chatMessage);
            chatMessage.save();
            socket.time.push = setTimeout(() => {
                socket.bot.sayNeutral() 
            }, 2000);                 
            socket.time.push = setTimeout(() => {
                socket.bot.sayRec()  
            }, 5000);                                 
        });

        socket.on('roomchange', function (room, username) {
            socket.time ? socket.time.forEach(elem => clearTimeout(elem)) : null;
            socket.username = username;
            socket.room ? socket.leave(socket.room) : null;
            socket.room = room; 
            socket.join(socket.room)
            socket.bot = new Bot(socket, io)
            Chat.find({room: socket.room})
                .then((msg) => {        
                    socket.emit('getMsgArray', msg);
                    socket.bot.sayHi(socket.username);
                    socket.time.push = setTimeout(() => {
                        socket.bot.sayHow()
                    }, 4000);
                })
                .catch((e) => {
                    console.log(e)
                })
        })
    });
}