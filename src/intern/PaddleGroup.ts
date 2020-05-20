import BaseScene from '~/BaseScene';

export default class PaddleGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene: BaseScene, idx = 0){
        super(scene.physics.world, scene);

        scene.add.existing(this);

        if(idx){
            scene.aGrid.placeAtIndex(idx, this);
        }
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