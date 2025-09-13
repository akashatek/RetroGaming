class AHTileset {
    constructor(name) {
        this.name = name;
        this.image = null;
        this.tileset = null;
    }

    async load(imagePath, jsonPath) {
        // Load the tileset JSON
        try {
            console.log(`Loading JSON from: ${jsonPath}`);
            const response = await fetch(jsonPath);
            if (!response.ok) {
                throw new Error(`Failed to load JSON: ${jsonPath}`);
            }
            this.tileset = await response.json();
            console.log("JSON loaded successfully:", this.tileset);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }

        // Load the tileset image
        return new Promise((resolve, reject) => {
            console.log(`Loading image from: ${imagePath}`);
            this.image = new Image();
            this.image.onload = () => {
                console.log("Image loaded successfully:", this.image);
                resolve(this);
            };
            this.image.onerror = (e) => {
                console.error(`Failed to load image: ${imagePath}`, e);
                reject(new Error(`Failed to load image: ${imagePath}`));
            };
            this.image.src = imagePath;
        });
    }

    // The drawTile function now uses default tile dimensions if width and height are not provided.
    drawTile(ctx, tileId, x, y, width = null, height = null) {
        console.log(`AHTileset.drawTile called with: tileId: ${tileId}, x: ${x}, y: ${y}, width: ${width}, height: ${height}`);
        if (!this.image || !this.tileset) {
            console.error('Tileset not loaded yet.');
            return;
        }

        const tileWidth = this.tileset.tilewidth;
        const tileHeight = this.tileset.tileheight;
        const imgWidth = this.tileset.imagewidth;

        // Calculate source x and y coordinates on the tileset image
        const tilesPerRow = Math.floor(imgWidth / tileWidth);
        const sourceX = (tileId % tilesPerRow) * tileWidth;
        const sourceY = Math.floor(tileId / tilesPerRow) * tileHeight;

        console.log(`Source coords: sourceX: ${sourceX}, sourceY: ${sourceY}`);

        // Use the default dimensions if null
        const drawWidth = width !== null ? width : tileWidth;
        const drawHeight = height !== null ? height : tileHeight;

        console.log(`Drawing image with dimensions: drawWidth: ${drawWidth}, drawHeight: ${drawHeight}`);

        ctx.drawImage(
            this.image,
            sourceX,
            sourceY,
            tileWidth,
            tileHeight,
            x,
            y,
            drawWidth,
            drawHeight
        );
    }
}

export { AHTileset };
