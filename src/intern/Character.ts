import MainGame from '~/scenes/MainGame';
import gsap from 'gsap';

export default class Character extends Phaser.GameObjects.Sprite {

    private particles;
    private fire;
    private sceneRef: MainGame;
    public fireOn = false;
    public cookiesCollected = 0;
    public energy = 0;

    constructor(scene: MainGame, idx = 0){
        super(scene, 0, 0, "ninja");

        this.sceneRef = scene;

        this.setScale(.2);
        this.particles = scene.add.particles('red');
        this.fire = this.particles.createEmitter({
            speed: 100,
            scale: { start: .2, end: 0 },
            blendMode: 'ADD'
        });
        this.fire.startFollow(this);
        this.fire.stop();

        scene.add.existing(this);
        scene.physics.add.existing(this);
        const body = this.body as Phaser.Physics.Arcade.Body;

        if(idx){
            scene.aGrid.placeAtIndex(idx, this);
        }else{
            this.x = scene.paddle.x;
            this.y = scene.paddle.y - 30;
            body.setVelocity(0, -500);
        }

        body.setCircle(90)
        body.setAngularDrag(10);
        body.setCollideWorldBounds(true)

        this.setEnergy(0);

        scene.physics.add.overlap(this, scene.cookies, this.handleOverlap, undefined, this);

        body.onWorldBounds = true;
    }

    setEnergy(num){
        this.body.setBounce(.3, .3)
    }

    handleOverlap(player, cookie){
        this.sceneRef.handleCookieHit(cookie);
        cookie.handleTake();
        this.cookiesCollected++;
    }

    handlePaddleHit(){
        this.sceneRef.setScore(this.cookiesCollected);
        this.cookiesCollected = 0;
    }

    move(pos){
        const body = this.body as Phaser.Physics.Arcade.Body;
        const pVel = Math.abs(Math.floor(body.velocity.y) + (body.bounce.y * 10)) - 1;
        const yMax = this.sceneRef.dim.h - 140;

        if(pVel == 0 && this.y > yMax ){
            this.x = pos;
            this.scene.physics.world.disableBody(body);
        }
    }

    kill(){
        this.destroy();
    }

    explode(){
        this.body.enable = false;
        gsap.to(this, {duration: .2, tint: 0xFF0000, repeat: -1,  yoyo: true})
        this.setTint(0xFF0000);
        setTimeout(()=>{
            this.fire.start();
            this.fire.explode(100, this.x, this.y);
            this.alpha = 0;
            setTimeout(()=>{
                this.fire.remove();
            }, 800);
        }, 2000);
    }

    fireToggle(){
        if(this.fireOn){
            this.fire.start();
            this.fireOn = false;
        }else{
            this.fire.stop();
            this.fireOn = true;
        }
    }
}