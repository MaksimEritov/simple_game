const Constants = require('../config/constants')

module.exports = function (socket, io) { 
    
    socket.on('startGame', (room) => {
        const currentCardDeck = [...Constants.cards];
        let results = [
            { cards: [], points: null, winner: null },
            { cards: [], points: null, winner: null },
            { cards: [], points: null, winner: null }
        ];

        results = results.reduce((res, player) => {
        player.cards.push(
            getRandomValWithDelete(currentCardDeck, true),
            getRandomValWithDelete(currentCardDeck, true),
            getRandomValWithDelete(currentCardDeck, true)
        );

        player.points = player.cards.reduce((points, card) => {
            points += card.points;
            return points;
        }, null);

        return res;
        }, results);

        winnerPoints = findWinner(results);

        io.in(room).clients((err, clients) => {
            if (err) io.to(room).emit('error', err)
            for (let i = 0, len = clients.length; i < len; i++) {
              results[i].id = clients[i]
            }
            results.forEach(player => {
                io.to(player.id).emit("gameResults", {
                  cards: player.cards,
                  points: player.points,
                  winner: player.winner,
                  winnerPoints: winnerPoints
                });
            });
        });

    })
}

const getRandomValWithDelete = (arr, removeItem) => {
  if (arr.length < 1) throw "Cannot get random value from zero-length array";
  const randomIndex = Math.floor(Math.random() * arr.length);
  const randomValue = arr[randomIndex];
  if (removeItem) arr.splice(randomIndex, 1);
  return randomValue;
};

const findWinner = array => {
    findWinner.maxPoints = Math.max.apply(
        Math,
        array.map(player => {
        return player.points;
        })
    );
    array.forEach(player => {
        player.points === findWinner.maxPoints
        ? (player.winner = true)
        : (player.winner = false);
    });

    findWinner.winnersCount = array.reduce((num, player) => {
        if (player.winner) num++;
        return num;
    }, null);

    if (findWinner.winnersCount > 1) {
        array.forEach(player => {
        player.winner === true ? (player.winner = "draw") : null;
        });
    }
    return findWinner.maxPoints;
};

