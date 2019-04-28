import 'phaser';
const cat: string = require('./images/cat.png');
const player: string = require('./images/player.png');
const background: string = require('./images/background.png');
const trailerFront: string = require('./images/trailerfront.png');
const trailerBack: string = require('./images/trailerback.png');

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
    private kittyCount: number = 0;
    private trailerHitBox: any;
    private kittyGroup: Phaser.GameObjects.Group;

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
    }

    create(): void {
        this.scene.launch('UIScene');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.add.image(0, 160 - 20, 'trailerback').setOrigin(0, 1);
        var kittyGroup = this.add.group();
        // catch 20 really nice cats
        for (let i = 0; i < 10; i++) {
            let kittySprite = this.physics.add.sprite(130 + (i * 64), 100, 'cat');
            kittySprite.setBounce(0.5);
            kittySprite.setDragX(24);
            kittySprite.setName(`rightKitty${i}`);
            kittyGroup.add(kittySprite);
            this.time.delayedCall(Phaser.Math.RND.integerInRange(1000, 5000), this.kittyJump, [kittySprite], this);
        }
        for (let i = 0; i < 10; i++) {
            let kittySprite = this.physics.add.sprite(-64 - (i * 64), 100, 'cat');
            kittySprite.setBounce(0.5);
            kittySprite.setDragX(24);
            kittySprite.setName(`leftKitty${i}`);
            kittyGroup.add(kittySprite);
            this.time.delayedCall(Phaser.Math.RND.integerInRange(1000, 5000), this.kittyJump, [kittySprite], this);
        }
        this.trailerFrontImage = this.add.image(0, 160 - 20, 'trailerfront').setOrigin(0, 1);
        let kittyWalls = this.physics.add.staticGroup();
        let leftWall = this.add.rectangle(0, 160 - 20, 3, 64 - 13, 0xff0000, 0).setOrigin(0, 1);
        let rightWall = this.add.rectangle(128, 160 - 20, 3, 64 - 13, 0xff0000, 0).setOrigin(1, 1);
        let floor = this.add.rectangle(3, 160 - 20, 122, 6, 0x00ff00, 0).setOrigin(0, 1);
        let leftWorldBound = this.add.rectangle(-364, 160, 8, 128, 0xff0000, 0).setOrigin(0, 1);
        let rightWorldBound = this.add.rectangle(600, 160, 8, 128, 0xff0000, 0).setOrigin(1, 1);
        let trailerRect = this.add.rectangle(0, 140, 128, 64, 0xff0000, 0).setOrigin(0, 1);
        let trailerHitBox = this.physics.add.staticGroup();
        trailerHitBox.add(trailerRect);
        kittyWalls.addMultiple([leftWall, rightWall, floor, leftWorldBound, rightWorldBound]);
        this.playerSprite = this.physics.add.sprite(160, 100, 'player');
        this.cameras.main.startFollow(this.playerSprite, false, 0.1, 0.1);

        this.cameras.main.fadeIn(1500, 0, 0, 0);
        this.cameras.main.setBounds(-360, -160, 960, 320);
        let platforms = this.physics.add.staticGroup();
        platforms.create(120, 150, 'background');
        this.physics.add.collider(this.playerSprite, platforms);
        this.physics.add.collider(kittyGroup, platforms);
        this.physics.add.collider(kittyGroup, kittyWalls);
        this.physics.add.overlap(this.playerSprite, kittyGroup, this.setPickUppableKitty, null, this);
        this.physics.add.overlap(trailerHitBox, kittyGroup, this.countKitty, null, this);
        this.physics.add.overlap(this.playerSprite, trailerHitBox, this.playerInTrailerCallback, null, this);

        this.kittyGroup = kittyGroup;
        this.trailerHitBox = trailerHitBox;
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

        console.log(`kittyCount: ${this.kittyCount}`);
        this.kittyCount = 0;
        this.playerInTrailer = false;
        this.pickUppableKitty = undefined;
    }

    private setPickUppableKitty(playerSprite: Phaser.Physics.Arcade.Sprite, kittySprite: Phaser.Physics.Arcade.Sprite) {
        if (kittySprite !== this.pickedUpKitty) {
            this.pickUppableKitty = kittySprite;
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

    private countKitty(playerSprite: Phaser.Physics.Arcade.Sprite, kittySprite: Phaser.Physics.Arcade.Sprite) {
        this.kittyCount++;
    }
}