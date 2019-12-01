/**
 * Bot model
 * 
 * @constructor socket|socket 
 * @constructor io|io 
 * 
 * 
 * Can answer on some mesages
 */

class Bot {
    constructor (socket, io) {
        this.socket = socket,
        this.io = io,
        this.props = {
            name: ['Alice', 'Mary', 'Viki', 'Suzen'],
            hello: ['Hi', 'Hello', 'Bonjour'],
            how: ['How are you?', "What's up?"],
            neutral: ['Amayzing' ,'Nice', 'Very interesting'],
            recommendation: ['Recommend our chat to your friends, plz))'],
        },
        this.msg = {
            neutral: 0,
            rec: false,
        }
        this.name = this.props.name[Math.floor(Math.random() * this.props.name.length)]   
    }

    

    sayHi (user) {
        this.io
            .to(this.socket.room)
            .emit('getMsg', 
            {
                message: this.props.hello[Math.floor(Math.random() * this.props.hello.length)] + ' ' + user.charAt(0).toUpperCase() + user.slice(1), 
                sender: this.name
            })
    }
    sayHow () {
        this.io
            .to(this.socket.room)
            .emit('getMsg', 
            {
                message: this.props.how[Math.floor(Math.random() * this.props.how.length)], 
                sender: this.name
            })
    }
    sayNeutral () {
        if (this.msg.neutral < 2) {
            this.msg.neutral++
            this.io
            .to(this.socket.room)
            .emit('getMsg', 
            {
                message: this.props.neutral[Math.floor(Math.random() * this.props.neutral.length)], 
                sender: this.name
            })
        }
        return
    }
    sayRec () {
        if (!this.msg.rec && this.msg.neutral === 2) {
            this.msg.rec = !this.msg.rec
            this.io
                .to(this.socket.room)
                .emit('getMsg', 
                {
                    message: this.props.recommendation[Math.floor(Math.random() * this.props.recommendation.length)], 
                    sender: this.name
                })
        }
    }
}

module.exports = Bot