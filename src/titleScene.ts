import 'phaser';
const cat: string = require('./images/cat.png');
const title_01: string = require('./images/title-01.png');
const title_02: string = require('./images/title-02.png');
const title_03: string = require('./images/title-03.png');
const title_04: string = require('./images/title-04.png');
const pressspace: string = require('./images/pressspace.png');
const tadaa: string = require('./audio/tadaa.wav');
const titlemew: string = require('./audio/titlemew.wav');
const whiplash01: string = require('./audio/whiplash01.wav');
const whiplash02: string = require('./audio/whiplash02.wav');
const whiplash03: string = require('./audio/whiplash03.wav');

export class TitleScene extends Phaser.Scene {
    private ready: boolean = false;

    constructor() {
        super({ key: 'TitleScene' })
    }

    init(params: any): void {

    }

    preload(): void {
        this.load.image('cat', cat);
        this.load.image('title_01', title_01);
        this.load.image('title_02', title_02);
        this.load.image('title_03', title_03);
        this.load.image('title_04', title_04);
        this.load.image('pressspace', pressspace);
        this.load.audio('tadaa', tadaa);
        this.load.audio('titlemew', titlemew);
        this.load.audio('whiplash01', whiplash01);
        this.load.audio('whiplash02', whiplash02);
        this.load.audio('whiplash03', whiplash03);
    }

    create(): void {
        const titleImage = this.add.image(0, -120, 'title_01').setOrigin(0, 0);
        const tween = this.tweens.add({
            targets: titleImage,
            y: 0,
            ease: 'Power1',
            duration: 1000,
            repeat: 0,
            onComplete: () => this.titleTweenComplete(titleImage)
        });
        this.input.keyboard.on('keydown_SPACE', () => {
            if (this.ready) {
                this.ready = false;
                this.cameras.main.fadeOut(500);
            }
        });
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('LDGameScene');
        });
        this.sound.play('tadaa');
    }

    private titleTweenComplete(image: Phaser.GameObjects.Image) {
        this.time.delayedCall(500, this.crossoutTitle, [image], this);
    }

    private crossoutTitle(image: Phaser.GameObjects.Image) {
        this.sound.play('whiplash01');
        image.setTexture('title_02');
        this.time.delayedCall(500, this.nextFrame, [image], this);
    }

    private nextFrame(image: Phaser.GameObjects.Image) {
        this.sound.play('whiplash02');
        image.setTexture('title_03');
        this.time.delayedCall(500, this.lastFrame, [image], this);
    }

    private lastFrame(image: Phaser.GameObjects.Image) {
        this.sound.play('whiplash03');
        image.setTexture('title_04');
        this.time.delayedCall(500, this.spaceReady, [], this);
    }

    private spaceReady() {
        this.sound.play('titlemew');
        const kitty = this.add.image(0, 150, 'cat');
        this.tweens.add({
            targets: [kitty],
            duration: 2500,
            repeat: -1,
            x: 240,
            yoyo: true,
            flipX: true
        });
        this.tweens.add({
            targets: [kitty],
            duration: 150,
            repeat: -1,
            y: 145,
            yoyo: true
        });
        const pressspaceimage = this.add.image(120, 150, 'pressspace');
        this.tweens.add({
            targets: [pressspaceimage],
            duration: 700,
            repeat: -1,
            yoyo: true,
            alpha: 0
        })
        this.ready = true;
    }
}