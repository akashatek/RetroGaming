const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function gameLoop() {
    // 1. Update game state (e.g., move player, check collisions)
    update();

    // 2. Clear the canvas
    draw();

    // 3. Redraw the game
    requestAnimationFrame(gameLoop);
}

// Initial call to start the loop
requestAnimationFrame(gameLoop);