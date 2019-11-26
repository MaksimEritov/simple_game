$(document).ready(() => {

    const socket = io.connect(window.location.href)

    $('#chatMessForm').submit((e) => {
        e.preventDefault();
        const newMess = $('#chatMess').val()
        socket.emit('new message', newMess);
        $('#chatMess').val('')
        }
    )
    socket.on('getMsg', (msg) => {
        console.log(msg)
        createMsg(msg.message, msg.sender)
    })
})

const createMsg = (msg, author) => {
    let div = document.createElement('div')
    let authorContTag = document.createElement('p')
    let authorTag = document.createElement('i')
    let msgTag = document.createElement('h5')
    div.classList.add('msg')
    authorTag.innerText = author;
    msgTag.innerText = msg;
    authorContTag.appendChild(authorTag)
    div.appendChild(authorContTag)
    div.appendChild(msgTag)
    $('.chat-container > div').append(div)
}
