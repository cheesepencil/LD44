import 'phaser';
const cat: string = require('./images/cat.png');
const title_01: string = require('./images/title-01.png');
const title_02: string = require('./images/title-02.png');
const title_03: string = require('./images/title-03.png');
const title_04: string = require('./images/title-04.png');

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' })
    }

    init(params: any): void {

    }

    preload(): void {
        this.load.image('cat', cat);
    }

    create(): void {
        var logo = this.physics.add.image(100, 25, 'cat');

        logo.setVelocity(10, 20);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);
    }
}