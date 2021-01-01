export default function createGame(screen) {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10,
    },
  };

  const observers = [];

  function start() {
    const frequency = 2000;

    setInterval(addFruit, frequency);
  }

  function subscribe(observerFunction) {
    observers.push(observerFunction);
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command);
    }
  }

  function setState(newState) {
    Object.assign(state, newState);
  }

  function addPlayer(command) {
    const { playerId } = command;
    const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
    const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

    state.players[playerId] = {
      x: playerX,
      y: playerY,
    };

    notifyAll({
      type: 'addPlayer',
      playerId,
      playerX,
      playerY,
    });
  }

  function removePlayer(command) {
    const { playerId } = command;

    delete state.players[playerId];

    notifyAll({
      type: 'removePlayer',
      playerId,
    });
  }

  function addFruit(command) {
    const fruitId = command ? command.fruitId : Math.floor(Math.random() * 1000000)
    const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
    const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    };

    notifyAll({
      type: 'addFruit',
      fruitId,
      fruitX,
      fruitY,
    });
  }

  function removeFruit(command) {
    const { fruitId } = command;

    delete state.fruits[fruitId];

    notifyAll({
      type: 'removeFruit',
      fruitId,
    });
  }

  function movePlayer(command) {
    notifyAll(command);
    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y - 1 >= 0) player.y --
      },
      ArrowDown(player) {
        if (player.y + 1 < state.screen.height) player.y ++
      },
      ArrowLeft(player) {
        if (player.x - 1 >= 0) player.x --
      },
      ArrowRight(player) {
        if (player.x + 1 < state.screen.width) player.x ++
      },
    };

    const { keyPressed, playerId } = command;
    const player = state.players[playerId]
    const moveFunction = acceptedMoves[keyPressed];

    if (player && moveFunction) {
      moveFunction(player);
      checkForFruitCollision(playerId)
    }
  }

  function checkForFruitCollision(playerId) {
    const player= state.players[playerId];

    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId];

      if (fruit.x === player.x && fruit.y === player.y) {
        removeFruit({ fruitId });
      }
    }
  }

  return {
    state,
    setState,
    movePlayer,
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    subscribe,
    start,
  };
}