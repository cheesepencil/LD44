export class LoseScene extends Phaser.Scene {
    private ready: boolean = false;

    constructor() {
        super({ key: 'LoseScene' })
    }

    init(params: any): void {

    }

    preload(): void {

    }

    create(): void {
        this.cameras.main.fadeIn(2000, 255, 0, 0);
        let winText = this.add.text(16, 16, 'Too slow!');
        let winText2 = this.add.text(16, 32, `Press space...`);
        this.input.keyboard.on('keydown_SPACE', () => {
            if (this.ready) {
                this.ready = false;
                this.cameras.main.fadeOut(1000, 0, 0, 0);
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