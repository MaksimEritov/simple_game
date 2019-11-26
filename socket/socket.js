/**
 * Modules
 * 
 * @Chat Chat schema for mongo DB 
 * @connect conection to mongo db
 */
const chat = require('../models/ChatSchema')
const db = require('../db/dbconection')


module.exports = function(server) {

    const io = require('socket.io')(server);

    io.on('connection', function (socket) {
        console.log('user connected"')
        socket.on("disconnect", function() {
            console.log("user disconnected");
        }); 

        chat.find({}).then((msg) => {
            for (let i = 0; i < msg.length && i < 20; i++) {
                ;
                socket.emit('getMsg', msg[i])
            }
        })
        
        socket.on('new message', function(msg) {            
            let  chatMessage  =  new chat({ message: msg, sender: "Anonymous"});
            socket.broadcast.emit('getMsg', chatMessage);
            socket.emit('getMsg', chatMessage);
            chatMessage.save();
            
        });


    });





}