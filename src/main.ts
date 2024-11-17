import { Game } from '@core/Game';
import { GameScreen } from 'screens/GameScreen';
import { LoadingScreen } from 'screens/LoadingScreen';

const init = async () => {
  const game = new Game();

  const loadingScreen = new LoadingScreen();

  game.screens.add(loadingScreen);
  game.screens.activate('loading');

  const gameScreen = new GameScreen();

  loadingScreen.assetManagerToLoad = gameScreen.assets;

  const assets: [string, string][] = [
    ['map', 'map.json'],
    ['knightSprite', 'knight_sprite_sheet_587x707.png'],
    ['hexTiles', 'g32.png'],
    ['music1', 'game-music-loop.mp3'],
    ['music2', '8bit-music.mp3'],
  ];

  assets.forEach(([name, src]) => gameScreen.assets.add(name, src));

  game.screens.remove('loading');
  game.screens.add(gameScreen);
};

init();
