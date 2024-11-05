import { Hex } from './hex';

export class GameState {
  private map = new Map<string, Hex>();
  private playerEntities = [];
  private enemyEntities = [];
}
