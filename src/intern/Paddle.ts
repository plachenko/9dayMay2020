import MainGame from '~/scenes/MainGame';

export default class Paddle extends Phaser.GameObjects.Rectangle {
    body: Phaser.Physics.Arcade.StaticBody;
    constructor(scene: MainGame, idx = 0){
        super(scene, 0, 0, 100, 20, 0xFF0000);

        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        if(idx){
            scene.aGrid.placeAtIndex(idx, this);
        }
        this.catch(scene.player);

        this.body.updateFromGameObject();
    }

    public handleBallHit(paddle, player){
        player.move(this.x);
        player.handlePaddleHit();
        // const body = ball.body as Phaser.Physics.Arcade.Body;
        // const vel = body.velocity;

        // this.hit = false;

        /*
        if(!this.shootAngle){
            // body.enable = false;
            this.paddleGroup.add(ball);
            this.hit = true;
        }else{
            // this.hit = false;
            this.shoot(this.shootAngle, );
        }
        */

        // this.UI.setScore(this.score);

        // vel.x = 400;
        // vel.y *= 1.1;

        // body.setVelocity(vel.x, vel.y);
        // player.kill();
    }

    public catch(target){
        this.scene.physics.add.collider(this, target, this.handleBallHit, undefined, this);
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