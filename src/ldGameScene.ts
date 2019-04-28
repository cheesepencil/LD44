import 'phaser';
import { UIScene } from './uiScene';
const cat: string = require('./images/cat.png');
const player: string = require('./images/player.png');
const background: string = require('./images/background.png');
const trailerFront: string = require('./images/trailerfront.png');
const trailerBack: string = require('./images/trailerback.png');
const badguy: string = require('./images/badguy.png');
const ack01: string = require('./audio/ack01.wav');
const ack02: string = require('./audio/ack02.wav');
const ack03: string = require('./audio/ack03.wav');
const jump01: string = require('./audio/jump01.wav');
const jump02: string = require('./audio/jump02.wav');
const jump03: string = require('./audio/jump03.wav');
const jump04: string = require('./audio/jump04.wav');
const meow01: string = require('./audio/meow01.wav');
const meow02: string = require('./audio/meow02.wav');
const meow03: string = require('./audio/meow03.wav');
const meow04: string = require('./audio/meow04.wav');
const meow05: string = require('./audio/meow05.wav');
const meowhurl01: string = require('./audio/meowhurl01.wav');
const meowhurl02: string = require('./audio/meowhurl02.wav');
const meowhurl03: string = require('./audio/meowhurl03.wav');

export class LDGameScene extends Phaser.Scene {
    private cursors: Phaser.Input.Keyboard.CursorKeys;
    private playerSprite: Phaser.Physics.Arcade.Sprite;
    private trailerFrontImage: Phaser.GameObjects.Image;
    private playerFacingRight: boolean = true;
    private pickUppableKitty: Phaser.Physics.Arcade.Sprite = undefined;
    private pickedUpKitty: Phaser.Physics.Arcade.Sprite = undefined;
    private spaceWasDown: boolean = false;
    private shiftWasDown: boolean = false;
    private playerInTrailer: boolean = false;
    private trailerVisible: boolean = true;
    private trailerFadingIn: boolean = false;
    private trailerFadingOut: boolean = false;
    private lastKittyCount: number = 0;
    private kittyCount: number = 0;
    private ouchie: boolean = false;
    private timer: Phaser.Time.TimerEvent;
    private winner: boolean = false;

    constructor() {
        super({ key: 'LDGameScene' })
    }

    init(params: any): void {

    }

    preload(): void {
        this.load.image('cat', cat);
        this.load.image('player', player);
        this.load.image('background', background);
        this.load.image('trailerfront', trailerFront);
        this.load.image('trailerback', trailerBack);
        this.load.image('badguy', badguy);
        this.load.audio('ack01', ack01);
        this.load.audio('ack02', ack02);
        this.load.audio('ack03', ack03);
        this.load.audio('jump01', jump01);
        this.load.audio('jump02', jump02);
        this.load.audio('jump03', jump03);
        this.load.audio('jump04', jump04);
        this.load.audio('meow01', meow01);
        this.load.audio('meow02', meow02);
        this.load.audio('meow03', meow03);
        this.load.audio('meow04', meow04);
        this.load.audio('meow05', meow05);
        this.load.audio('meowhurl01', meowhurl01);
        this.load.audio('meowhurl02', meowhurl02);
        this.load.audio('meowhurl03', meowhurl03);
    }

    create(): void {
        this.winner = false;
        this.ouchie = false;
        this.kittyCount = 0;
        this.pickedUpKitty = undefined;
        this.pickUppableKitty = undefined;
        this.scene.launch('UIScene');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.add.image(0, 160 - 20, 'trailerback').setOrigin(0, 1);
        var kittyGroup = this.add.group();
        // catch 20 really nice cats
        for (let i = 0; i < 10; i++) {
            let kittySprite = this.physics.add.sprite(140 + (i * 45), 100, 'cat');
            kittySprite.setBounce(0.5);
            kittySprite.setDragX(24);
            kittyGroup.add(kittySprite);
            this.time.delayedCall(Phaser.Math.RND.integerInRange(1000, 5000), this.kittyJump, [kittySprite], this);
        }
        for (let i = 0; i < 10; i++) {
            let kittySprite = this.physics.add.sprite(-64 - (i * 32), 100, 'cat');
            kittySprite.setBounce(0.5);
            kittySprite.setDragX(24);
            kittyGroup.add(kittySprite);
            this.time.delayedCall(Phaser.Math.RND.integerInRange(1000, 5000), this.kittyJump, [kittySprite], this);
        }
        this.trailerFrontImage = this.add.image(0, 160 - 20, 'trailerfront').setOrigin(0, 1);
        let kittyWalls = this.physics.add.staticGroup();
        let leftWall = this.add.rectangle(0, 160 - 20, 3, 64 - 13, 0xff0000, 0).setOrigin(0, 1);
        let rightWall = this.add.rectangle(128, 160 - 20, 3, 64 - 13, 0xff0000, 0).setOrigin(1, 1);
        let floor = this.add.rectangle(3, 160 - 20, 122, 6, 0x00ff00, 0).setOrigin(0, 1);
        let leftWorldBound = this.add.rectangle(-364, 160, 8, 256, 0xff0000, 0).setOrigin(0, 1);
        let rightWorldBound = this.add.rectangle(600, 160, 8, 256, 0xff0000, 0).setOrigin(1, 1);
        let trailerRect = this.add.rectangle(0, 140, 128, 64, 0xff0000, 0).setOrigin(0, 1);
        let trailerHitBox = this.physics.add.staticGroup();
        trailerHitBox.add(trailerRect);
        kittyWalls.addMultiple([leftWall, rightWall, floor, leftWorldBound, rightWorldBound]);
        this.playerSprite = this.physics.add.sprite(160, 100, 'player');
        this.cameras.main.startFollow(this.playerSprite, false, 0.1, 0.1);
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.time.delayedCall(1000, this.startTimer, [], this);
        this.cameras.main.setBounds(-360, -160, 960, 320);
        let platforms = this.physics.add.staticGroup();
        platforms.create(120, 150, 'background');
        let badGuys = this.add.group();
        let badguySprite1 = this.physics.add.sprite(160, 20, 'badguy').setOrigin(1, 1);
        this.time.delayedCall(Phaser.Math.RND.integerInRange(1000, 5000), this.badguyJump, [badguySprite1], this);
        badGuys.add(badguySprite1);
        this.tweens.add({
            targets: badguySprite1,
            x: 600,
            duration: 4500,
            repeat: -1,
            yoyo: true,
            flipX: true
        });
        let badguySprite2 = this.physics.add.sprite(-32, 20, 'badguy').setOrigin(1, 1);
        this.time.delayedCall(Phaser.Math.RND.integerInRange(1000, 5000), this.badguyJump, [badguySprite1], this);
        badGuys.add(badguySprite2);
        this.tweens.add({
            targets: badguySprite2,
            x: -400,
            duration: 4500,
            repeat: -1,
            yoyo: true,
            flipX: true
        });
        this.physics.add.collider(badGuys, platforms);
        this.physics.add.collider(this.playerSprite, platforms);
        this.physics.add.collider(kittyGroup, platforms);
        this.physics.add.collider(kittyGroup, kittyWalls);
        this.physics.add.overlap(this.playerSprite, badGuys, this.dangit, null, this);
        this.physics.add.overlap(this.playerSprite, kittyGroup, this.setPickUppableKitty, null, this);
        this.physics.add.overlap(trailerHitBox, kittyGroup, this.countKitty, null, this);
        this.physics.add.overlap(this.playerSprite, trailerHitBox, this.playerInTrailerCallback, null, this);
    }

    update(): void {
        let isTouchingDown = this.playerSprite.body.touching.down;

        if (this.ouchie === false) {
            // directional movement
            if (this.cursors.left.isDown && isTouchingDown) {
                this.playerFacingRight = false;
                this.playerSprite.setVelocityX(-64);
                this.playerSprite.setFlipX(true);
            }
            else if (this.cursors.right.isDown && isTouchingDown) {
                this.playerFacingRight = true;
                this.playerSprite.setVelocityX(64);
                this.playerSprite.setFlipX(false);
            }
            else if (isTouchingDown) {
                this.playerSprite.setVelocityX(0);
            }

            // jump logic
            if (this.cursors.space.isDown && isTouchingDown && !this.spaceWasDown) {
                let j = Phaser.Math.RND.integerInRange(1, 4);
                this.sound.play(`jump0${j}`);
                this.playerSprite.setVelocityY(-96);
                this.spaceWasDown = true;
            }
            if (this.cursors.space.isDown == false && isTouchingDown) {
                this.spaceWasDown = false;
            }

            // cat grabbing logic
            if (this.cursors.shift.isDown && this.shiftWasDown === false) {
                this.shiftWasDown = true;
                if (this.pickedUpKitty === undefined && this.pickUppableKitty !== undefined) {
                    let j = Phaser.Math.RND.integerInRange(1, 5);
                    this.sound.play(`meow0${j}`);
                    this.pickedUpKitty = this.pickUppableKitty;
                    this.pickedUpKitty.setFlipY(true);
                }
                else if (this.pickedUpKitty !== undefined) {
                    let j = Phaser.Math.RND.integerInRange(1, 3);
                    this.sound.play(`meowhurl0${j}`);
                    this.pickedUpKitty.setVelocityY(-128);
                    this.pickedUpKitty.setVelocityX(this.playerFacingRight ?
                        96 :
                        -96);
                    this.pickedUpKitty.setFlipY(false);
                    this.tweens.add({
                        targets: this.pickedUpKitty,
                        angle: this.playerFacingRight ? 720 : -720,
                        duration: 700
                    });
                    this.pickedUpKitty = undefined;
                }
            }
            if (this.cursors.shift.isDown) {
                this.shiftWasDown = true;
            } else {
                this.shiftWasDown = false;
            }
        }

        if (this.pickedUpKitty !== undefined) {
            this.pickedUpKitty.setX(this.playerSprite.x);
            this.pickedUpKitty.setY(this.playerSprite.y - 12);
            this.pickedUpKitty.setFlipX(!this.playerFacingRight);
        }

        if (this.playerInTrailer === false
            && this.trailerFadingOut === false
            && this.trailerVisible === false
            && this.trailerFadingIn === false) {
            this.trailerFadingIn = true;
            this.tweens.add({
                targets: this.trailerFrontImage,
                alpha: 1,
                duration: 1000,
                onComplete: () => { this.trailerFadingIn = false; this.trailerVisible = true; }
            });
        }

        if (this.lastKittyCount === this.kittyCount) {
            (this.scene.get('UIScene') as UIScene).updateKittyCount(this.kittyCount);
            if (this.kittyCount >= 20 && this.winner === false) {
                this.winner = true;
                this.timer.remove();
                (this.scene.get('UIScene') as UIScene).scene.stop();
                this.cameras.main.fadeOut(2000, 255, 255, 255);
                this.time.delayedCall(2000, () => this.scene.start('WinScene'), [], this);
            }
        }
        if (this.timer !== undefined) {
            (this.scene.get('UIScene') as UIScene).updateTimer(this.timer.getElapsedSeconds());
        }
        this.lastKittyCount = this.kittyCount;
        this.kittyCount = 0;
        this.playerInTrailer = false;
        this.pickUppableKitty = undefined;
    }

    private setPickUppableKitty(playerSprite: Phaser.Physics.Arcade.Sprite, kittySprite: Phaser.Physics.Arcade.Sprite) {
        if (kittySprite !== this.pickedUpKitty) {
            this.pickUppableKitty = kittySprite;
        }
    }

    private dangit() {
        if (this.ouchie === false) {
            let i = Phaser.Math.RND.integerInRange(1, 3);
            this.sound.play(`ack0${i}`);
            this.ouchie = true;
            this.playerSprite.setVelocityX(0);
            this.playerSprite.setVelocityY(-64);
            this.tweens.add({
                targets: this.playerSprite,
                angle: 1440,
                duration: 1000,
                onComplete: () => this.ouchie = false
            })
            if (this.pickedUpKitty !== undefined) {
                let j = Phaser.Math.RND.integerInRange(1, 3);
                this.sound.play(`meowhurl0${j}`);
                this.pickedUpKitty.setVelocityY(-160);
                this.pickedUpKitty.setVelocityX(this.playerFacingRight ?
                    -200 :
                    200);
                this.pickedUpKitty.setFlipY(false);
                this.tweens.add({
                    targets: this.pickedUpKitty,
                    angle: this.playerFacingRight ? 1440 : -1440,
                    duration: 1000
                });
                this.pickedUpKitty = undefined;
            }
        }
    }

    private playerInTrailerCallback(): void {
        this.playerInTrailer = true;
        if (this.trailerVisible === true && this.trailerFadingOut === false) {
            this.trailerFadingOut = true;
            this.tweens.add({
                targets: this.trailerFrontImage,
                alpha: 0,
                duration: 1000,
                onComplete: () => { this.trailerVisible = false; this.trailerFadingOut = false; }
            });
        }
    }

    private kittyJump(kittySprite: Phaser.Physics.Arcade.Sprite) {
        if (kittySprite.body.touching.down) {
            kittySprite.setVelocityY(-96);
            let xVelocity = Phaser.Math.RND.integerInRange(16, 96) * Phaser.Math.RND.sign();
            kittySprite.setVelocityX(xVelocity);
            if (xVelocity > 0) {
                kittySprite.setFlipX(false);
            } else {
                kittySprite.setFlipX(true);
            }
        }
        this.time.delayedCall(Phaser.Math.RND.integerInRange(1000, 5000), this.kittyJump, [kittySprite], this);
    }

    private badguyJump(badguySprite: Phaser.Physics.Arcade.Sprite) {
        if (badguySprite.body.touching.down) {
            badguySprite.setVelocityY(-64);
        }
        this.time.delayedCall(Phaser.Math.RND.integerInRange(1000, 5000), this.kittyJump, [badguySprite], this);
    }

    private countKitty(playerSprite: Phaser.Physics.Arcade.Sprite, kittySprite: Phaser.Physics.Arcade.Sprite) {
        this.kittyCount++;
    }

    private startTimer() {
        this.timer = this.time.delayedCall(120000, this.timesUp, [], this);
        (this.scene.get('UIScene') as UIScene).updateTimer(this.timer.getElapsedSeconds());
    }

    private timesUp() {
        this.scene.get('UIScene').scene.stop();
        this.cameras.main.fadeOut(2000, 255, 0, 0);
        this.time.delayedCall(2000, () => this.scene.start('LoseScene'), [], this);
    }
}