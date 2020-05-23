import MainGame from '~/scenes/MainGame';

export default class Paddle extends Phaser.GameObjects.Rectangle {
    body: Phaser.Physics.Arcade.StaticBody;
    private shootTo = {x: 0, y: 0};
    private itemsTouching: any = [];
    public shootAngle = 0;
    private gfx: any;
    private line = new Phaser.Geom.Line();

    constructor(scene: MainGame, idx = 0){
        super(scene, 0, 0, 100, 20, 0xFF0000);

        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        if(idx){
            scene.aGrid.placeAtIndex(idx, this);
        }
        this.catch(scene.player);

        this.body.updateFromGameObject();
        this.shootTo = new Phaser.Math.Vector2(this.x, this.y - 80);
        this.gfx = this.scene.add.graphics().setDefaultStyles({lineStyle: { width: 2, color: 0xffdd00, alpha: 0.5 }})
    }

    public setShootAngle(xAmt){

        this.scene.physics.world.timeScale = 20;

        this.shootTo.x += xAmt;
        this.shootAngle = Phaser.Math.Angle.BetweenPoints(this, this.shootTo);

        Phaser.Geom.Line.SetToAngle(this.line, this.x, this.y, this.shootAngle, 128);
        this.gfx.clear().strokeLineShape(this.line);
    }

    public shoot(){
        this.shootTo.x = this.x;

        if(this.itemsTouching.length){
            this.itemsTouching.forEach((item, idx) => {
                this.scene.physics.world.enableBody(item);
                item.body.setAngularVelocity((this.shootAngle * (180/Math.PI) + 90) * 200);
                this.scene.physics.velocityFromAngle(this.shootAngle * (180/Math.PI), 900, item.body.velocity);
                this.itemsTouching.splice(idx, 1);
            });
        }

        this.shootAngle = null;
    }

    public handleShoot(){
        this.scene.physics.world.timeScale = 1;
        if(this.itemsTouching.length){
            this.shoot();
        }
    }

    public handleBallHit(paddle, other){
        other.move(this.x);
        other.handlePaddleHit();

        console.log(other.body.enable);
        if( other.body.enable == false ){
            this.itemsTouching.push(other);
        }

        if(this.shootAngle){
            this.itemsTouching.push(other);
            this.shoot();
        }

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

        Phaser.Geom.Line.SetToAngle(this.line, this.x, this.y, this.shootAngle, 128);
        this.gfx.clear().strokeLineShape(this.line);

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
        this.shootTo.x = paddle.x;
    }

}