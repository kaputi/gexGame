import { Game } from '@core/Game';
import { GameScene, MenuScene, LoadingScene } from '@scenes';

const init = async () => {
  const game = new Game();

  const loadingScene = new LoadingScene();

  game.scenes.add(loadingScene);
  game.scenes.activate('loading');

  const gameScene = new GameScene();

  loadingScene.assetManagerToLoad = gameScene.assets;

  const assets: [string, string][] = [
    ['map', 'map.json'],
    ['knightSprite', 'knight_sprite_sheet_587x707.png'],
    ['hexTiles', 'g32.png'],
    ['music1', 'game-music-loop.mp3'],
    ['music2', '8bit-music.mp3'],
  ];

  assets.forEach(([name, src]) => gameScene.assets.add(name, src));

  game.scenes.remove('loading');
  game.scenes.add(gameScene);

  const mainMenuScene = new MenuScene();
  mainMenuScene.addMenu('main', [
    {
      text: 'Start Game',
      action: () => {
        game.scenes.activate('game');
        game.scenes.remove('menu');
      },
    },
    { text: 'Load Game', action: () => console.log('Load Game') },
    { text: 'Map Editor', action: () => console.log('Map Editor') },
    { text: 'Options', action: () => mainMenuScene.activateMenu('options') },
    { text: 'Exit', action: () => console.log('Exit') },
  ]);

  mainMenuScene.addMenu('options', [
    { text: 'Music Volume', action: () => console.log('Music Volume') },
    { text: 'Sound Volume', action: () => console.log('Sound Volume') },
    { text: 'Back', action: () => mainMenuScene.activateMenu('main') },
  ]);
  mainMenuScene.activateMenu('main');

  game.scenes.add(mainMenuScene);
  game.scenes.activate('menu');
};

init();
