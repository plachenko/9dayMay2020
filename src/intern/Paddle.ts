import MainGame from '~/scenes/MainGame';
import gsap from 'gsap';
import ArcVisual from '~/scenes/ArcVisual';

export default class Paddle extends Phaser.GameObjects.Rectangle {
    body: Phaser.Physics.Arcade.StaticBody;
    private shootTo = {x: 0, y: 0};
    private itemsTouching: any = [];
    public shootAngle = 0;
    private gfx: any;
    private line = new Phaser.Geom.Line();
    private fire;
    private energy = 100;
    public strength = 0;
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
                if(this.strength <= this.maxStrength){
                    this.strength+= 3;
                }
                this.showArcScene();
            } else {
                this.scene.physics.world.timeScale = 1;
            }
        }else{
            if(this.energy < 100){
                if(!this.bMoving){
                    this.energy++;
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

            this.shootTo.x += xAmt;
            // this.drawLine();
            // this.drawArc();

        }
        this.shootAngle = Phaser.Math.Angle.BetweenPoints(this, this.shootTo);
        // this.sceneRef.scene.wake('ui');
        // this.av.setPos();
        // this.av.renderArc(this.shootAngle);

    }

    private drawArc(){
        this.scene.UI.children.list.forEach((child) => {
            if(child instanceof Phaser.GameObjects.Arc){
                gsap.to(child, .4, {alpha: 0});
                setTimeout(()=> {
                    child.destroy();
                    child = null;
                }, 1000);
            }
        });

        const bounce =this.scene.player.body.bounce; 
        const circ = this.scene.add.circle(this.x, this.y - 30, 10, 0x0FFFFFF);
        circ.setAlpha(.2);
        this.scene.UI.add.existing(circ);
        this.scene.UI.physics.add.existing(circ);
        const body = circ.body as Phaser.Physics.Arcade.Body;
        body.setCircle(10);
        body.setVelocity(0, -500)
        body.setCollideWorldBounds(true);

        body.collideWorldBounds = true;
        // this.scene.UI.physics.world.on('worldbounds', this.testBounds, this);
        // console.log(this.scene.UI.physics.world);

        body.setBounce(bounce.x, bounce.y);
        body.setAngularVelocity((this.shootAngle * (180/Math.PI) + 90) * 200);
        this.scene.UI.physics.velocityFromAngle((this.shootAngle * (180/Math.PI)), 900, body.velocity);

        /*
        for(let i = 0; i < 100; i++){
            this.scene.UI.update();
            // body.update();
        }
        */
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
        this.shootTo.x = this.x;
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
        this.shootTo.x = paddle.x;
    }

}