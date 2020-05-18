import BaseScene from '~/BaseScene';

export default class Paddle extends Phaser.GameObjects.Rectangle {
    body: Phaser.Physics.Arcade.StaticBody;
    constructor(scene: BaseScene, idx = 0){
        super(scene, 0, 0, 100, 20, 0xFF0000);

        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        if(idx){
            scene.aGrid.placeAtIndex(idx, this);
        }

        this.body.updateFromGameObject();
    }

    public move(x = 0, dim){
        const paddle = this;
        const xOffset = paddle.width / 2;

        if(paddle.x > xOffset){
            paddle.x += x;
        } else {
            paddle.x = xOffset;
        }

        if(paddle.x <= dim.w - xOffset){
            paddle.x += x;
        } else {
            paddle.x = dim.w - xOffset;
        }

        this.body.updateFromGameObject();
    }
}