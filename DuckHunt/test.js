<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Duck Hunt</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        body {
            font-family: 'Press Start 2P', cursive;
        }
        canvas {
            image-rendering: pixelated;
        }
    </style>
</head>
<body class="bg-gray-800 text-white flex flex-col items-center justify-center min-h-screen p-4">

    <div class="text-center mb-4">
        <h1 class="text-3xl sm:text-4xl font-bold text-yellow-300 drop-shadow-lg">Duck Hunt</h1>
        <p class="text-sm mt-2 text-gray-400">Click the flying ducks to shoot them!</p>
    </div>

    <div class="game-container relative w-full max-w-2xl bg-gray-900 border-4 border-yellow-500 rounded-2xl shadow-2xl overflow-hidden">
        <canvas id="gameCanvas" class="w-full h-auto aspect-[256/240] block bg-gray-900"></canvas>
        
        <!-- Scoreboard -->
        <div class="absolute bottom-4 left-4 right-4 bg-gray-800 bg-opacity-70 p-2 rounded-lg border-2 border-gray-700">
            <div class="flex justify-between items-center text-sm sm:text-base">
                <span id="score" class="font-bold text-green-400">Score: 0</span>
                <span id="ducks-shot" class="font-bold text-red-400">Ducks Shot: 0 / 10</span>
            </div>
        </div>

        <!-- Message Box -->
        <div id="messageBox" class="absolute inset-0 bg-gray-950 bg-opacity-90 flex items-center justify-center p-4 text-center transition-opacity duration-300">
            <div>
                <h2 id="messageTitle" class="text-2xl sm:text-3xl font-bold text-yellow-300 drop-shadow">Game Over</h2>
                <p id="messageText" class="text-base sm:text-lg mt-2 text-gray-300">You shot <span id="finalScore">0</span> ducks!</p>
                <button id="restartButton" class="mt-6 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-full shadow-lg transition-transform transform hover:scale-105">
                    Play Again
                </button>
            </div>
        </div>
    </div>

    <script>
        window.onload = function() {
            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');
            const scoreDisplay = document.getElementById('score');
            const ducksShotDisplay = document.getElementById('ducks-shot');
            const messageBox = document.getElementById('messageBox');
            const messageTitle = document.getElementById('messageTitle');
            const messageText = document.getElementById('messageText');
            const finalScoreDisplay = document.getElementById('finalScore');
            const restartButton = document.getElementById('restartButton');

            // Set canvas size for a classic NES feel (256x240)
            const WIDTH = 256;
            const HEIGHT = 240;
            canvas.width = WIDTH;
            canvas.height = HEIGHT;

            // Spritesheet source: http://www.spriters-resource.com/nes/duckhunt/
            const spriteSheet = new Image();
            spriteSheet.src = 'https://i.imgur.com/x06U2sK.png';

            let score = 0;
            let ducksShot = 0;
            const maxDucks = 10;
            let gameOver = false;

            // Duck object and properties
            let duck = {
                x: 0,
                y: 0,
                width: 32, // Adjusted for cleaner visuals
                height: 32, // Adjusted for cleaner visuals
                vx: 0,
                vy: 0,
                frame: 0,
                animationSpeed: 5,
                frameTimer: 0,
                state: 'flying', // 'flying', 'shot', 'falling'
                fallSpeed: 2,
                fallDirection: 1 // 1 for down, -1 for up (if shot from above)
            };

            // Sprite sheet coordinates
            const duckSprites = [
                { x: 2, y: 114, w: 28, h: 28 }, // Flying 1
                { x: 34, y: 114, w: 28, h: 28 }, // Flying 2
                { x: 66, y: 114, w: 28, h: 28 }, // Flying 3
                { x: 98, y: 114, w: 28, h: 28 }, // Flying 4
                { x: 130, y: 114, w: 28, h: 28 }, // Flying 5
                { x: 162, y: 114, w: 28, h: 28 }, // Flying 6 (back view)
                { x: 194, y: 114, w: 28, h: 28 }, // Shot
                { x: 226, y: 114, w: 28, h: 28 } // Falling
            ];

            const backgroundSprite = {
                x: 0,
                y: 0,
                w: 256,
                h: 240
            };

            const dogSprites = [
                { x: 2, y: 2, w: 48, h: 32 }
            ];

            // Game state initialization
            function init() {
                score = 0;
                ducksShot = 0;
                gameOver = false;
                messageBox.style.opacity = '0';
                messageBox.style.pointerEvents = 'none';
                spawnDuck();
                updateUI();
                animate();
            }

            function spawnDuck() {
                if (ducksShot >= maxDucks) {
                    endGame();
                    return;
                }
                const startX = Math.random() < 0.5 ? -duck.width : WIDTH;
                duck.x = startX;
                duck.y = HEIGHT - Math.floor(Math.random() * (HEIGHT - 100)) - 50;
                duck.width = 32;
                duck.height = 32;
                duck.vx = (startX === -duck.width) ? (1 + Math.random() * 2) : -(1 + Math.random() * 2);
                duck.vy = - (1 + Math.random() * 1);
                duck.state = 'flying';
                duck.frame = 0;
                duck.fallSpeed = 2;
            }
            
            function updateUI() {
                scoreDisplay.textContent = `Score: ${score}`;
                ducksShotDisplay.textContent = `Ducks Shot: ${ducksShot} / ${maxDucks}`;
            }

            // End the game
            function endGame() {
                gameOver = true;
                messageTitle.textContent = "Game Over!";
                messageText.textContent = `You shot ${score} ducks!`;
                finalScoreDisplay.textContent = score;
                messageBox.style.opacity = '1';
                messageBox.style.pointerEvents = 'auto';
            }

            // Game logic
            function update() {
                if (gameOver) return;

                if (duck.state === 'flying') {
                    // Update duck position
                    duck.x += duck.vx;
                    duck.y += duck.vy;

                    // Reverse direction if duck hits screen edges
                    if (duck.x > WIDTH - duck.width || duck.x < 0) {
                        duck.vx *= -1;
                    }
                    if (duck.y < 0 || duck.y > HEIGHT - duck.height) {
                        duck.vy *= -1;
                    }

                    // Animate duck wings
                    duck.frameTimer++;
                    if (duck.frameTimer >= duck.animationSpeed) {
                        duck.frame = (duck.frame + 1) % 6; // Cycle through flying frames
                        duck.frameTimer = 0;
                    }
                } else if (duck.state === 'shot') {
                    // Start falling animation
                    duck.frame = 6; // Shot sprite
                    duck.state = 'falling';
                    score += 100;
                    ducksShot++;
                    updateUI();
                } else if (duck.state === 'falling') {
                    // Duck falls to the ground
                    duck.y += duck.fallSpeed;
                    if (duck.y > HEIGHT) {
                        // Duck is off screen, spawn a new one
                        spawnDuck();
                    }
                }
            }

            // Draw game elements
            function draw() {
                ctx.clearRect(0, 0, WIDTH, HEIGHT);
                
                // Draw background (or a simple green field)
                ctx.fillStyle = "#6b801a";
                ctx.fillRect(0, 0, WIDTH, HEIGHT);

                // Draw the ground
                ctx.fillStyle = "#3a4c0d";
                ctx.fillRect(0, HEIGHT - 40, WIDTH, 40);

                if (duck.state === 'flying') {
                    const sprite = duckSprites[duck.frame];
                    ctx.drawImage(spriteSheet, sprite.x, sprite.y, sprite.w, sprite.h, duck.x, duck.y, duck.width, duck.height);
                } else if (duck.state === 'falling') {
                    const sprite = duckSprites[7]; // Falling sprite
                    ctx.drawImage(spriteSheet, sprite.x, sprite.y, sprite.w, sprite.h, duck.x, duck.y, duck.width, duck.height);
                }
            }

            // Main animation loop
            function animate() {
                update();
                draw();
                if (!gameOver) {
                    requestAnimationFrame(animate);
                }
            }

            // Handle mouse clicks for shooting
            canvas.addEventListener('click', (e) => {
                if (gameOver) return;
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                const mouseX = (e.clientX - rect.left) * scaleX;
                const mouseY = (e.clientY - rect.top) * scaleY;

                // Simple collision detection
                if (duck.state === 'flying' &&
                    mouseX > duck.x &&
                    mouseX < duck.x + duck.width &&
                    mouseY > duck.y &&
                    mouseY < duck.y + duck.height) {
                    
                    duck.state = 'shot';
                }
            });

            restartButton.addEventListener('click', () => {
                init();
            });

            // Start the game for the first time
            init();
        };
    </script>
</body>
</html>
