import 'phaser';
const cat: string = require('./images/cat.png');
const player: string = require('./images/player.png');
const background: string = require('./images/background.png');

export class LDGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LDGameScene' })
    }

    init(params: any): void {

    }

    preload(): void {
        this.load.image('cat', cat);
        this.load.image('player', player);
        this.load.image('background', background);
    }

    create(): void {
        console.log('we arrived!');
        this.add.image(100, 100, 'cat');
        this.add.image(120, 160, 'background').setOrigin(0.5, 1);
        this.cameras.main.fadeIn(1500, 0, 0, 0);
    }
}