import { TitleScene } from './titleScene';
import { LDGameScene } from './ldGameScene';
import { UIScene } from './uiScene';
import { WinScene } from './winScene';
import { LoseScene } from './loseScene';

export const gameConfig: GameConfig = {
    type: Phaser.AUTO,
    render: {
        antialias: false
    },
    scale: {
        mode: Phaser.Scale.FIT
    },
    parent: 'game-parent',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    width: 240,
    height: 160,
    scene: [TitleScene, LDGameScene, UIScene, WinScene, LoseScene]
};