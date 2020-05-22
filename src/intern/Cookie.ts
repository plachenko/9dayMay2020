import gsap from 'gsap';
import MainGame from '~/scenes/MainGame';

export default class Cookie extends Phaser.Physics.Arcade.Sprite {

    body: Phaser.Physics.Arcade.StaticBody;
    rand = Math.random() * 900;
    fire: Phaser.GameObjects.Particles.ParticleEmitter;
    particle: Phaser.GameObjects.Particles.ParticleEmitterManager;
    sceneRef: MainGame;

    constructor(scene: MainGame, pos?: any) {
        super(scene, 0, 0, "cookie");

        
        this.x = pos?.x || Phaser.Math.Between(10, scene.dim.w - 10);
        this.y = pos?.y || Phaser.Math.Between(10, scene.dim.h - 150) ;
        this.setScale(.1);


        this.particle = scene.add.particles('red');

        scene.add.existing(this);
        scene.physics.world.enableBody(this, Phaser.Physics.Arcade.STATIC_BODY);

        this.setFire();

        gsap.from(this, 1, {alpha: 0})
        // gsap.to(this.fire, 1, {alpha: 0})
    }

    setFire(){
        this.fire = this.particle.createEmitter({
            speed: 20,
            scale: { start: .2, end: 0 },
            blendMode: 'ADD'
        });
        this.fire.startFollow(this);
    }

    update(time){
        if(this){
            this.y = Math.sin((time+this.rand) / 350) / 1.4 + this.y;
            this.body.updateFromGameObject();
        }
    }

    handleTake(){
        this.fire?.explode(0, this.x, this.y);
        this.destroy();
        this.fire?.setGravity(0, 300)
    }
}