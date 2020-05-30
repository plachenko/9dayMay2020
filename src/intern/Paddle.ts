import MainGame from '~/scenes/MainGame';
import gsap from 'gsap';
import ArcVisual from '~/scenes/ArcVisual';

export default class Paddle extends Phaser.GameObjects.Rectangle {
    body: Phaser.Physics.Arcade.StaticBody;
    public shootTo = {x: 0, y: 0};
    private itemsTouching: any = [];
    public shootAngle = 0;
    private gfx: any;
    private line = new Phaser.Geom.Line();
    private fire;
    private energy = 100;
    public strength = 20;
    private maxStrength = 100;
    public bAiming = false;
    private eBar;
    public bMoving = false;
    private sceneRef;

    constructor(scene: MainGame, idx = 0){
        super(scene, 0, 0, 100, 20, 0xFF0000);

        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        if(idx){
            scene.aGrid.placeAtIndex(idx, this);
        }
        this.catch(scene.player);

        this.eBar = scene.add.rectangle(this.x, this.y + 20, this.width, 10, 0x00FF00).setOrigin(.5);
        scene.add.existing(this.eBar);

        this.sceneRef = scene;

        this.body.updateFromGameObject();
        this.shootTo = new Phaser.Math.Vector2(this.x, this.y - 80);
        this.gfx = this.scene.add.graphics().setDefaultStyles({lineStyle: { width: 2, color: 0xffdd00, alpha: 0.5 }})

        scene.scene.launch('arc-viz');
        scene.scene.sleep('arc-viz');
    }

    public update()
    {
        if(this.bAiming){
            if(this.energy > 0){
                this.energy--;
                /*
                if(this.strength <= this.maxStrength){
                    this.strength+= 3;
                }
                */
                this.showArcScene();
            } else {
                this.scene.physics.world.timeScale = 1;
            }
        }else{
            if(this.energy < 100){
                if(!this.bMoving){
                    this.energy++;
                }else{
                    this.energy+=.7;
                }
            }
            this.move(this.scene.xMove, this.scene.dim);
            this.eBar.x = this.x;
        }
        this.drawLine();

        if(this.bMoving){
            setTimeout(() => {
                this.bMoving = false;
            }, 600)
        }
        this.drawEnergy();
    }

    public drawEnergy(){
        this.eBar.width = this.width * (this.energy / this.width);
    }

    public showArcScene(){
        this.sceneRef.scene.wake('arc-viz', {paddle: this});
    }

    public setShootAngle(xAmt){
        if(this.energy){
            this.scene.physics.world.timeScale = 20;

            // this.shootTo.x += xAmt;

        }
        this.shootAngle = Phaser.Math.Angle.BetweenPoints(this, this.shootTo);

    }

    private drawLine(){
        const length = 90 * (this.strength/ this.maxStrength);
        if(this.shootAngle){
            Phaser.Geom.Line.SetToAngle(this.line, this.x, this.y, this.shootAngle, length);
            this.gfx.clear().strokeLineShape(this.line);
        }else{
            this.gfx.clear();
        }
    }

    public shoot(){
        // this.shootTo.x = this.x;
        this.scene.physics.world.timeScale = 1;

        this.sceneRef.scene.sleep('arc-viz');

        if(this.itemsTouching.length){
            this.itemsTouching.forEach((item, idx) => {
                if(!this.bAiming){
                    // item.enable = true;
                }
                this.scene.physics.world.enableBody(item);
                item.body.setAngularVelocity((this.shootAngle * (180/Math.PI) + 90) * 200);
                this.scene.physics.velocityFromAngle(this.shootAngle * (180/Math.PI), this.strength* 10, item.body.velocity);
                this.itemsTouching.splice(idx, 1);
            });
            this.strength = 0;
            this.shootAngle = null;
        }
    }

    public handleBallHit(paddle, other){
        this.scene.physics.world.disableBody(other);
        other.handlePaddleHit();

        if( other.body.blocked.down ){
            if(!this.itemsTouching.includes(other)){
                this.itemsTouching.push(other);
                if( this.shootAngle ){
                    this.shoot();
                }
            }
        }
    }

    public catch(target){
        this.scene.physics.add.collider(this, target, this.handleBallHit, undefined, this);
    }

    public move(x = 0, dim){
        const paddle = this;
        const xOffset = paddle.width / 2;

        // this.drawLine();

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
        // this.shootTo.x = paddle.x;
    }

}