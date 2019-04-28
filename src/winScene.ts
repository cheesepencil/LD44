import 'phaser';
const cat: string = require('./images/cat.png');

export class WinScene extends Phaser.Scene {
    private ready: boolean = false;

    constructor() {
        super({ key: 'WinScene' })
    }

    init(params: any): void {

    }

    preload(): void {

    }

    create(): void {
        this.cameras.main.fadeIn(500, 255, 255, 255);
        let winText = this.add.text(16, 16, 'You win!!!');
        let winText2 = this.add.text(16, 32, 'Press space...');
        this.input.keyboard.on('keydown_SPACE', () => {
            if (this.ready = true) {
                this.ready = false;
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.time.delayedCall(1000, () => this.scene.start('LDGameScene'), [], this);
            }
        });
        this.cameras.main.once('camerafadeincomplete', () => {
            this.ready = true;
        });
    }

    update(): void {

    }
}