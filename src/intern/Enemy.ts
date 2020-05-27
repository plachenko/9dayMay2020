import MainGame from '~/scenes/MainGame';
import gsap from 'gsap';
import Bullet from '~/intern/Bullet';

export default class Enemy extends Phaser.GameObjects.Sprite {
    private particles;
    private fire;
    private sceneRef: MainGame;
    private health;
    private bIsAlive;
    private timer: Phaser.Time.TimerEvent;
    private aimAngle = 0;
    private gfx;
    private line = new Phaser.Geom.Line();

    constructor(scene: MainGame){
        super(scene, 0, 0, "enemy");

        const bSpawnLR = Phaser.Math.Between(0, 1);
        const randTime = Phaser.Math.Between(1, 3) * 1000;

        this.bIsAlive = true;

        this.sceneRef = scene;
        this.setScale(.3);

        this.particles = scene.add.particles('red');
        this.fire = this.particles.createEmitter({
            speed: 100,
            scale: { start: .2, end: 0 },
            blendMode: 'ADD'
        });
        this.fire.startFollow(this);
        this.fire.stop();

        this.x = bSpawnLR ? Phaser.Math.Between(-80, -20) : Phaser.Math.Between(800, 880);
        this.y = Phaser.Math.Between(-80, 400);
        this.health = 2;

        scene.add.existing(this);
        scene.physics.world.enableBody(this, Phaser.Physics.Arcade.STATIC_BODY);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCircle(80);
        body.updateFromGameObject();
        this.move();

        this.gfx = this.scene.add.graphics().setDefaultStyles({lineStyle: { width: 2, color: 0xffdd00, alpha: 0.5 }})

        this.timer = scene.time.addEvent({
            delay: randTime,
            callback: this.handleTimer,
            loop: true,
            callbackScope: this
        });
    } 
    
    private handleTimer(){
        const rand = Phaser.Math.Between(0, 1);
        this.move();
        if(rand){
            this.shoot();
        }
    }

    explode(){
        gsap.to(this, {duration: .2, tint: 0xFF0000, repeat: -1,  yoyo: true})
        this.setTint(0xFF0000);
        setTimeout(()=>{
            this.fire.start();
            this.fire.explode(100, this.x, this.y);
            this.alpha = 0;
            setTimeout(()=>{
                this.fire.remove();
                this.destroy();
            }, 800);
        }, 2000);
    }

    private move(_x = 0, _y = 0){
        const x = _x || Phaser.Math.Between(0, 400);
        const y = _y || Phaser.Math.Between(0, 400);

        const ts = this.sceneRef.physics.world.timeScale;

        if(ts == 1){
            gsap.to(this, 1, {x: x, y: y, onComplete:() => {
                this.body.updateFromGameObject();
            }, onUpdate: () => {
                if(this.bIsAlive){
                    this.aim();
                }else{
                    this.gfx.clear();
                }
            }});
        }
    }

    public update(){
        // this.aim();
    }
    
    private aim(){
        this.aimAngle = Phaser.Math.Angle.BetweenPoints(this, this.sceneRef.player);
        // this.drawLine();
    }

    private shoot(){
        const bullet = new Bullet(this.sceneRef, this.x, this.y, this.aimAngle);
    }

    private drawLine(){
        const length = 100;
        if(this.aimAngle){
            Phaser.Geom.Line.SetToAngle(this.line, this.x, this.y, this.aimAngle, length);
            this.gfx.clear().strokeLineShape(this.line);
        }else{
            this.gfx.clear();
        }
    }

    public handlePlayerHit(){
        gsap.to(this, {duration: .5, tint: 0xFF0000, repeat: 2,  yoyo: true});

        if(!this.health){
            this.bIsAlive = false;
        }

        setTimeout(() => {
            if(this.health){
                    this.health--;
            }else{
                this.kill();
            }
        }, 600)
    }

    private kill(){
        this.explode();
        // this.destroy();
    }
}