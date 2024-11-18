import { ImageAsset } from '@core/assets';
import { Game } from '@core/Game';
import { TileSheet } from '@core/TileSheet';
import { GameScene, MenuScene, LoadingScene } from '@scenes';
import { MapEditorScene } from '@scenes/MapEditorScene';
import { Hex } from 'Hex';

const init = async () => {
  Hex.width = 64;
  Hex.height = 68;
  Hex.origin = [window.innerWidth / 2, window.innerHeight / 2];

  const game = new Game();

  const loadingScene = new LoadingScene('loading');
  const gameScene = new GameScene('game');
  const mapEditorScene = new MapEditorScene('mapEditor');
  const mainMenuScene = new MenuScene('mainMenu');
  const editorPauseMenu = new MenuScene('editorPauseMenu');
  game.scenes.add(loadingScene);
  game.scenes.add(gameScene);
  game.scenes.add(mainMenuScene);
  game.scenes.add(mapEditorScene);
  game.scenes.add(editorPauseMenu);

  // loadingScene.assetManagerToLoad = gameScene.assets;
  // game.scenes.activate('loading');

  // const assets: [string, string][] = [
  //   ['map', 'map.json'],
  //   ['knightSprite', 'knight_sprite_sheet_587x707.png'],
  //   ['hexTiles', 'g32.png'],
  //   ['music1', 'game-music-loop.mp3'],
  //   ['music2', '8bit-music.mp3'],
  // ];

  // assets.forEach(([name, src]) => gameScene.assets.add(name, src));

  // game.scenes.deactivate('loading');

  mainMenuScene.addMenu('main', [
    {
      text: 'Start Game',
      action: () => {
        game.scenes.activate('game');
        game.scenes.deactivate('mainMenu');
      },
    },
    { text: 'Load Game', action: () => console.log('Load Game') },
    {
      text: 'Map Editor',
      action: async () => {
        game.scenes.deactivateAll();
        const editorAssets = mapEditorScene.assets;
        loadingScene.assetManagerToLoad = editorAssets;
        game.scenes.activate('loading');
        await editorAssets.loadAll();
        const mapTileSheet = new TileSheet(
          'hexTiles',
          editorAssets.get('hexTiles')! as ImageAsset,
          32,
          32
        );
        mapEditorScene.mapTileSheet = mapTileSheet;
        setTimeout(() => {
          game.scenes.deactivateAll();
          game.scenes.activate('mapEditor');
        }, 1000);
      },
    },
    { text: 'Options', action: () => mainMenuScene.activateMenu('options') },
    { text: 'Exit', action: () => console.log('Exit') },
  ]);

  mainMenuScene.addMenu('options', [
    { text: 'Music Volume', action: () => console.log('Music Volume') },
    { text: 'Sound Volume', action: () => console.log('Sound Volume') },
    { text: 'Back', action: () => mainMenuScene.activateMenu('main') },
  ]);

  game.scenes.activate('mainMenu');

  editorPauseMenu.addMenu('pause', [
    {
      text: 'Resume',
      action: () => {
        game.scenes.activate('mapEditor');
        game.scenes.deactivate('editorPauseMenu');
      },
    },
    {
      text: 'Save',
      action: () => {
        console.log('Save');
        game.scenes.activate('mapEditor');
        game.scenes.deactivate('editorPauseMenu');
      },
    },
    {
      text: 'Load',
      action: () => {
        console.log('Load');
        game.scenes.activate('mapEditor');
        game.scenes.deactivate('editorPauseMenu');
      },
    },
    {
      text: 'Exit',
      action: () => {
        editorPauseMenu.activateMenu('areYouSure');
      },
    },
  ]);

  editorPauseMenu.addMenu(
    'areYouSure',
    [
      {
        text: 'Yes',
        action: () => {
          game.scenes.deactivateAll();
          game.scenes.activate('mainMenu');
        },
      },
      {
        text: 'No',
        action: () => {
          editorPauseMenu.activateMenu('pause');
        },
      },
    ],
    'Are you sure?'
  );
};

init();
