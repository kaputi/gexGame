import { Game } from '@core/Game';
import { LoadingScreen } from 'screens/LoadingScreen';

const init = async () => {
  const game = new Game();

  const loadingScreen = new LoadingScreen();

  game.screens.add(loadingScreen);
  game.screens.activate('loading');

  const assets: [string, string][] = [
    ['map', '/map.json'],
    ['knightSprite', 'knight_sprite_sheet_587x707.png'],
    ['hexTiles', 'g32.png'],
  ];
};

init();
