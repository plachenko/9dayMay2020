export default class Paddle extends Phaser.GameObjects.Rectangle {
    constructor(scene: Phaser.Scene, idx = 0){
        super(scene, 0, 0, 100, 20, 0xFF0000);

        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        const body = this.body as Phaser.Physics.Arcade.Body;
        if(idx){
            scene.aGrid.placeAtIndex(idx, this);
        }

        body.updateFromGameObject();
    }

    public move(x = 0, dim){
        const paddle = this;
        const w = paddle.width / 2;

        if(paddle.x > w){
            paddle.x += x;
        } else {
            paddle.x = w;
        }

        if(paddle.x <= dim.w - w){
            paddle.x += x;
        } else {
            paddle.x = dim.w - w;
        }

        this.body.updateFromGameObject();
    }
}