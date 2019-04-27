import { TitleScene } from './titleScene';

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
    scene: [TitleScene]
};