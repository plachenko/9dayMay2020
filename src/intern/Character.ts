import MainGame from '~/scenes/MainGame';
import gsap from 'gsap';

export default class Character extends Phaser.GameObjects.Sprite {

    private particles;
    private fire;
    private sceneRef: MainGame;
    public fireOn = false;
    public cookiesCollected = 0;
    public energy = 0;
    private touching = false;

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

        body.setCircle(90);
        body.setCollideWorldBounds(true);

        this.setEnergy(0);

        scene.physics.add.overlap(this, scene.cookies, this.handleOverlap, undefined, this);
        scene.physics.add.overlap(this, scene.enemies, this.handleHit, undefined, this);

        body.onWorldBounds = true;
    }

    update()
    {
        this.move(this.scene.paddle.x);
    }

    handleHit(player, enemy)
    {
        player.body.setVelocity(200, 200);
        enemy.handlePlayerHit();
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

        /*
        if(this.touching){
            // this.scene.paddle.itemsTouching.push(this);
            console.log('touch')
            this.touching = false;
        }else{
            this.touching = true;
        }
        */
    }

    move(pos){
        const body = this.body as Phaser.Physics.Arcade.Body;
        const pVel = Math.abs(Math.floor(body.velocity.y) + (body.bounce.y * 10)) - 1;
        const yMax = this.sceneRef.dim.h - 145;
        // const gfx = this.scene.add.graphics().setDefaultStyles({lineStyle: { width: 2, color: 0xffdd00, alpha: 0.5 }})
        // const line = new Phaser.Geom.Line(0, yMax, this.scene.dim.w, yMax);
        // const line2 = new Phaser.Geom.Line(0, this.y, this.scene.dim.w, this.y);
        
        // gfx.clear().strokeLineShape(line);

        // console.log(this.scene.paddle.body);
        if(body.blocked.down && this.y > this.scene.paddle.y - 40){
            this.x = pos;
            body.setAngularDrag(500);
            // this.scene.physics.world.disableBody(body);
            // body.enable = false;
        }
        // console.log(this.body.enable);

        /*
       if(!this.body.enable){
       }
       */
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
                if(this.sceneRef.tries){
                    this.sceneRef.addChar();
                }
                this.fire.remove();
                this.kill();
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