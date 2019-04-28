import 'phaser';
const cat: string = require('./images/cat.png');

export class UIScene extends Phaser.Scene {
    private ready: boolean = false;

    constructor() {
        super({ key: 'UIScene' })
    }

    init(params: any): void {

    }

    preload(): void {
        this.load.image('cat', cat);
    }

    create(): void {
        // const kitty = this.add.image(0, 32, 'cat');
        // this.tweens.add({
        //     targets: [kitty],
        //     duration: 150,
        //     repeat: -1,
        //     y: 16,
        //     yoyo: true
        // });
    }
}