export default function renderScreen(screen, game, requestAnimationFrame) {
  const context = screen.getContext('2d');
  const { state } = game;

  context.clearRect(0, 0, 10, 10);

  for (const playerId in state.players) {
    const player = state.players[playerId];

    context.fillStyle = 'black';
    context.fillRect(player.x, player.y, 1, 1);
  }

  for (const fruitId in state.fruits) {
    const fruit = state.fruits[fruitId];

    context.fillStyle = 'green';
    context.fillRect(fruit.x, fruit.y, 1, 1);
  }

  requestAnimationFrame(() => {
    renderScreen(screen, game, requestAnimationFrame)
  });
}