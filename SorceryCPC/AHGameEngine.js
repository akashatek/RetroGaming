import { AHTileset } from './AHTileset.js';

class AHGameEngine {
    constructor(canvasId, width, height) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas element with ID '${canvasId}' not found.`);
        }
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.lastTime = 0;
        this.entities = [];
        this.tilesets = new Map();
        this.nextTilesetId = 0; // Updated to start tileset IDs at 0
    }

    async addTileset(name, imagePath, jsonPath) {
        const tileset = new AHTileset();
        await tileset.load(imagePath, jsonPath);
        const tilesetId = this.nextTilesetId++;
        this.tilesets.set(tilesetId, tileset);
        console.log(`Tileset '${name}' loaded with ID: ${tilesetId}`);
        return tilesetId;
    }
    
    addEntity(entity) {
        this.entities.push(entity);
    }
    
    drawTile(tilesetId, tileId, x, y, width, height) {
        console.log(`AHGameEngine.drawTile called with tilesetId: ${tilesetId}, tileId: ${tileId}, x: ${x}, y: ${y}, width: ${width}, height: ${height}`);
        const tileset = this.tilesets.get(tilesetId);
        if (tileset) {
            tileset.drawTile(this.ctx, tileId, x, y, width, height);
        } else {
            console.error(`Tileset with ID '${tilesetId}' not found.`);
        }
    }

    start() {
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(deltaTime) {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        // Update all entities
        this.entities.forEach(entity => entity.update(deltaTime));
    }

    render() {
        // Render all entities
        this.entities.forEach(entity => entity.render(this.ctx));
    }
}

export { AHGameEngine };
