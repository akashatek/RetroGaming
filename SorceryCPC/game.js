import { AHGameEngine } from './AHGameEngine.js';
import { AHTileset } from './AHTileset.js';

window.onload = async () => {
    const engine = new AHGameEngine('gameCanvas', 320, 200);

    const tilesetId = await engine.addTileset(
        'Sorcery',
        './Assets/sorcery_cpc_tileset.png',
        './Assets/sorcery_cpc_tileset.json'
    );
    
    // Draw a single tile from the tileset
    engine.drawTile(tilesetId, 1, 0, 0);

    // engine.start();
};
