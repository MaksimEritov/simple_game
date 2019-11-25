$(document).ready(() => {

    const socket = io.connect(window.location.href)

    $('#chatMessForm').submit((e) => {
        e.preventDefault();
        const newMess = $('#chatMess').val()
        socket.emit('new message', newMess);
        $('#chatMess').val('')
    }
    )
})