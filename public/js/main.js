/**
 * Website main javascript file
 */

$(document).ready(() => {

  /**
   * Logout button handler
   */
  $('#logout-btn').on('click', () => {
    console.log('logout')
    if (getCookie('username')) {
      deleteCookie('username')
    }
    if (getCookie('token')) {
      deleteCookie('token')
    }
    window.location.pathname = "/signin"
  });

  /**
   * Sign in / up pages js
   */
  if (window.location.pathname === '/signin') {
    
    $(".login-form").submit((e) => {
        e.preventDefault()
        form = $(".login-form")[0]
        const data = JSON.stringify({
          user: {
            username: form[0].value,
            password: form[1].value
        }})
        $.ajax({
            url: "/api/users/signin",
            method: "POST",
            contentType: 'application/json',
            data,
            statusCode: {
              200: function(res) {
                window.location.pathname = '/chat'
              },
              401: function(jqXHR) {
                $('.signIn-container .help-block').show()
                
                console.log('error :', jqXHR);
              }
            }
        });
    })
  }
  if (window.location.pathname === '/registration') {
      $(".reg-form").submit((e) => {
          e.preventDefault()
          form = $(".reg-form")[0]
          const data = JSON.stringify({
            user: {
              username: form[0].value,
              password: form[1].value
          }})
          $.ajax({
              url: "/api/users/",
              method: "POST",
              contentType: 'application/json',
              data,
              statusCode: {
                200: function(res) {
                  console.log(res)

                  window.location.pathname = '/chat'
                },
                406: function(jqXHR) {
                  $('.reg-form .help-block').show()
                  
                  console.log('error :', jqXHR);
                }
              }
          });
      }
      )
  }

  /**
   * Socket identification and events handlers
   * 
   * Room chane
   * New message
   * Get message
   */
  const socket = io.connect(window.location.origin)
  
  $('.aside-room').on("click", (e) => {
      const room = e.currentTarget.dataset.room
      $('div.msg').remove()
      socket.emit('roomchange',room)
      $('.room-wrapper').show()
  })
  $('#chatMessForm').submit((e) => {
      e.preventDefault();
      const newMess = $('#chatMess').val()
      socket.emit('new message', newMess, getCookie('username'));
      $('#chatMess').val('')
  })
  socket.on('getMsg', (msg) => {
    console.log('getMsg')
      createMsg(msg.message, msg.sender)
  })

})

/**
 * Render message to DOM
 * 
 * @param msg|sting
 * @param author|sting
 */
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

/**
 * Cookie manage JavaScripts 
 */

/**
 * Get cookie function 
 * 
 * @param name: string
 * @return cookie value: string / undefined
 */

const getCookie = (name) => {
  let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

/**
* Delete cookie function 
* 
* @param name: string
* @void
*/

const deleteCookie = (name) => {
  setCookie(name, "", {
      "max-age": -1
  });
};

/**
* Set cookie function 
* 
* @param name: string
* @param value: string
* @param options: object. Example: {secure: true, 'max-age': 3600} 
* @void
* 
* Example:
* setCookie('user', 'John', {secure: true, 'max-age': 3600});
* 
*/
const setCookie = (name, value, options = {})  =>  {

  options = {
      path: "/",
      expires: new Date ( 2025, 10, 20 ),
      // при необходимости добавьте другие значения по умолчанию
      ...options
  };

  if (options.expires.toUTCString) {
      options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
          updatedCookie += "=" + optionValue;
      }
  }

  document.cookie = updatedCookie;
};
