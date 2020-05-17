export default class Character extends Phaser.GameObjects.Sprite {
    private lives = 3;

    constructor(scene: Phaser.Scene, x = 0, y = 0){
        super(scene, x, y, "ninja");

        this.setScale(.2);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCircle(20);
        body.setBounce(.9, .9);
        body.setCollideWorldBounds(true);
        body.onWorldBounds = true;

        body.angularDrag = 1;
        body.angularVelocity = 900;
    }
}