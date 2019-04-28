import 'phaser';
const cat: string = require('./images/cat.png');
const player: string = require('./images/player.png');
const background: string = require('./images/background.png');

export class LDGameScene extends Phaser.Scene {
    private cursors: Phaser.Input.Keyboard.CursorKeys;
    private playerSprite: Phaser.Physics.Arcade.Sprite;

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
        let kittySprite = this.physics.add.sprite(100, 0, 'cat');
        this.cameras.main.fadeIn(1500, 0, 0, 0);
        this.cameras.main.setBounds(-600, -160, 1200, 320);
        let platforms = this.physics.add.staticGroup();
        platforms.create(120, 150, 'background');
        this.playerSprite = this.physics.add.sprite(50, 0, 'player');
        this.cameras.main.startFollow(this.playerSprite, false, 0.1, 0.1);
        this.playerSprite.setBounce(0.2);
        this.physics.add.collider(this.playerSprite, platforms);
        this.physics.add.collider(kittySprite, platforms);
    }

    update(): void {
        let isTouchingDown = this.playerSprite.body.touching.down;

        if (this.cursors.left.isDown && isTouchingDown) {
            this.playerSprite.setVelocityX(-64);
        }
        else if (this.cursors.right.isDown && isTouchingDown) {
            this.playerSprite.setVelocityX(64);
        }
        else if (isTouchingDown) {
            this.playerSprite.setVelocityX(0);
        }

        if (this.cursors.space.isDown && isTouchingDown) {
            this.playerSprite.setVelocityY(-96);
        }
    }
}