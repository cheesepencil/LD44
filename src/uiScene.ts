import 'phaser';
const cat: string = require('./images/cat.png');

export class UIScene extends Phaser.Scene {
    private timerText: Phaser.GameObjects.Text;
    private kittyText: Phaser.GameObjects.Text;
    private kittyCount: number = 0;

    constructor() {
        super({ key: 'UIScene' })
    }

    init(params: any): void {

    }

    preload(): void {

    }

    create(): void {
        this.timerText = this.add.text(16, 16, 'Time left:');
        this.kittyText = this.add.text(16, 32, `Cats collected: ${this.kittyCount}`)
    }

    update(): void {

    }

    public updateKittyCount(count: number): void {
        debugger;
        this.kittyText.setText(`Cats collected: ${count}/20`);
    }

    public updateTimer(sec: number): void {
        let timeLeft = 120 - sec;
        var min = Math.floor(timeLeft / 60);
        var sec = Math.floor(timeLeft) % 60;
        this.timerText.setText(`Time left: ${min}:${sec}`);
    }
}