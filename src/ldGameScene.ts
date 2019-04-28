import 'phaser';
const cat: string = require('./images/cat.png');
const player: string = require('./images/player.png');
const background: string = require('./images/background.png');

export class LDGameScene extends Phaser.Scene {
    private cursors: Phaser.Input.Keyboard.CursorKeys;
    private playerSprite: Phaser.Physics.Arcade.Sprite;
    private playerFacingRight: boolean = true;
    private pickUppableKitty: Phaser.Physics.Arcade.Sprite = undefined;
    private pickedUpKitty: Phaser.Physics.Arcade.Sprite = undefined;
    private spaceWasDown: boolean = false;
    private shiftWasDown: boolean = false;

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
        this.cursors = this.input.keyboard.createCursorKeys();
        this.playerSprite = this.physics.add.sprite(120, 100, 'player');
        this.cameras.main.startFollow(this.playerSprite, false, 0.1, 0.1);
        let kittySprite = this.physics.add.sprite(140, 100, 'cat');
        kittySprite.setBounce(0.5);
        kittySprite.setDragX(24);
        this.cameras.main.fadeIn(1500, 0, 0, 0);
        this.cameras.main.setBounds(-360, -160, 960, 320);
        let platforms = this.physics.add.staticGroup();
        platforms.create(120, 150, 'background');
        this.physics.add.collider(this.playerSprite, platforms);
        this.physics.add.collider(kittySprite, platforms);
        this.physics.add.overlap(this.playerSprite, kittySprite, this.setPickUppableKitty, null, this);
    }

    update(): void {
        let isTouchingDown = this.playerSprite.body.touching.down;

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
                this.pickedUpKitty = this.pickUppableKitty;
                this.pickedUpKitty.setFlipY(true);
            }
            else if (this.pickedUpKitty !== undefined) {
                console.log('hurling kitty...');
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

        if (this.pickedUpKitty !== undefined) {
            this.pickedUpKitty.setX(this.playerSprite.x);
            this.pickedUpKitty.setY(this.playerSprite.y - 12);
            this.pickedUpKitty.setFlipX(!this.playerFacingRight);
        }

        this.pickUppableKitty = undefined;
    }

    private setPickUppableKitty(playerSprite: Phaser.Physics.Arcade.Sprite, kittySprite: Phaser.Physics.Arcade.Sprite) {
        if (kittySprite !== this.pickedUpKitty) {
            this.pickUppableKitty = kittySprite;
        }
    }
}