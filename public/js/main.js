/**
 * Website main javascript file
 */

$(document).ready(() => {
  /**
   * Logout button handler
   */
  $("#logout-btn").on("click", () => {
    if (getCookie("username")) {
      deleteCookie("username");
    }
    if (getCookie("token")) {
      deleteCookie("token");
    }
    window.location.pathname = "/signin";
  });

  /**
   * Sign in / up pages js
   */
  if (window.location.pathname === "/signin") {
    $(".login-form").submit(e => {
      e.preventDefault();
      form = $(".login-form")[0];
      const data = JSON.stringify({
        user: {
          username: form[0].value,
          password: form[1].value
        }
      });
      $.ajax({
        url: "/api/users/signin",
        method: "POST",
        contentType: "application/json",
        data,
        statusCode: {
          200: function(res) {
            window.location.pathname = "/game";
          },
          401: function(jqXHR) {
            $(".signIn-container .help-block").show();
            console.log("error :", jqXHR);
          }
        }
      });
    });
  }
  if (window.location.pathname === "/registration") {
    $(".reg-form").submit(e => {
      e.preventDefault();
      form = $(".reg-form")[0];
      const data = JSON.stringify({
        user: {
          username: form[0].value,
          password: form[1].value
        }
      });
      $.ajax({
        url: "/api/users/",
        method: "POST",
        contentType: "application/json",
        data,
        statusCode: {
          200: function(res) {
            console.log(res);

            window.location.pathname = "/game";
          },
          406: function(jqXHR) {
            $(".reg-form .help-block").show();

            console.log("error :", jqXHR);
          }
        }
      });
    });
  }

  if (window.location.pathname === "/game") {
    $("nav .nav-item").hide();

    /**
     * Socket identification and events handlers
     *
     */
    const socket = io.connect(window.location.origin);
    let currentRoom = null;

    $(".aside-room").on("click", e => {
      $(".game-resault").hide();
      if (currentRoom) {
        socket.emit("roomOut", currentRoom);
      }
      currentRoom = e.currentTarget.dataset.room;
      socket.emit("roomIn", currentRoom);
    });

    $("#letsPlayBtn").on("click", () => {
      $(".player-cards").html("");
      $("#totalPoints").html("");
      $(".game-resault").hide();
      $(".player-stats").hide();
      socket.emit("startGame", currentRoom);
    });

    socket.on("roomAccept", (room, members) => {
      $(".aside-room").removeClass("active");
      $(`.aside-room[data-room='${room}']`).addClass("active");
      if (members === 1) {
        $("#addBot1").hide();
        $("#addBot2").show();
      } else if (members === 2) {
        $("#addBot1").hide();
        $("#addBot2").hide();
      } else {
        $("#addBot1").show();
        $("#addBot2").show();
      }
      $(".room-wrapper").show();
    });

    socket.on("roomFull", () => {
      alert("Sorry, room is full. Choose another room");
    });

    socket.on("roomReadyHeandler", bull => {
      if (bull) {
        $(".wait-msg").hide();
        $(".lets-play-btn").show();
      } else {
        $(".lets-play-btn").hide();
        $(".wait-msg").show();
      }
    });

    socket.on("roomMemChange", members => {
      if (members === 1) {
        $("#addBot1").hide();
        $("#addBot2").show();
      } else if (members === 2) {
        $("#addBot1").hide();
        $("#addBot2").hide();
      } else {
        $("#addBot1").show();
        $("#addBot2").show();
      }
    });

    socket.on("error", err => {
      console.log(err);
      alert("Sorry something went wrong. Please contact to administartion");
    });

    socket.on("gameResults", data => {
      let cards = "";
      data.cards.forEach(card => {
        let classname = "black";
        if (card.suit === "&#9829;" || card.suit === "&#9830;") {
          classname = "red";
        }
        cards += `<h5>${card.name} <span class=${classname}>${card.suit}</span>,<br /> ${card.points} point(s)<h5>`;
      });
      if (data.winner === true) {
        $(".game-resault").attr("src", "../images/win.png");
      } else if (data.winner === "draw") {
        $(".game-resault").attr("src", "../images/draw.png");
      } else {
        $(".game-resault").attr("src", "../images/lose.png");
      }

      $(".player-cards").html(cards);
      $("#totalPoints").html(`Total points: ${data.points}`);
      $(".player-stats").show();
      $(".game-resault").show();
    });
  } else {
    $("#logout-btn").hide();
  }
});

/**
 * Cookie manage JavaScripts
 */

/**
 * Get cookie function
 *
 * @param name: string
 * @return cookie value: string / undefined
 */

const getCookie = name => {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

/**
 * Delete cookie function
 *
 * @param name: string
 * @void
 */

const deleteCookie = name => {
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
const setCookie = (name, value, options = {}) => {
  options = {
    path: "/",
    expires: new Date(2025, 10, 20),
    // при необходимости добавьте другие значения по умолчанию
    ...options
  };

  if (options.expires.toUTCString) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie =
    encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
};
