import { AHGameEngine } from '../JSGameEngine/AHGameEngine.js';
import { AHTileset } from '../JSGameEngine/AHTileset.js';

window.onload = async () => {
    const engine = new AHGameEngine('gameCanvas', 320, 200);

    const tilesetId = await engine.addTileset(
        'Sorcery',
        '../Assets/SorceryCPC/sorcery_cpc_tileset.png',
        '../Assets/SorceryCPC/sorcery_cpc_tileset.json'
    );
    
    // Draw a single tile from the tileset
    engine.drawTile(tilesetId, 0, 50, 50, 32, 32);

    engine.start();
};
