import gsap from 'gsap';
import MainGame from '~/scenes/MainGame';

export default class Cookie extends Phaser.Physics.Arcade.Sprite {

    body: Phaser.Physics.Arcade.StaticBody;
    rand = Math.random() * 900;
    fire: Phaser.GameObjects.Particles.ParticleEmitter;
    particle: Phaser.GameObjects.Particles.ParticleEmitterManager;
    smoke: Phaser.GameObjects.Particles.ParticleEmitterManager;
    list: Cookie[] = [];

    constructor(scene: MainGame, pos?: any) {
        super(scene, 0, 0, "cookie");

        this.list = scene.cookies;
        this.x = pos?.x || Math.random() * scene.dim.w;
        this.y = pos?.y || Math.random() * scene.dim.h;
        this.setScale(.1);

        gsap.from(this, {alpha: 0})

        this.particle = scene.add.particles('red');
        this.fire = this.particle.createEmitter({
            speed: 30,
            scale: { start: .2, end: 0 },
            blendMode: 'ADD'
        });
        this.fire.startFollow(this);

        scene.add.existing(this);
        scene.physics.world.enableBody(this, Phaser.Physics.Arcade.STATIC_BODY);
        scene.physics.add.overlap(scene.player, this, this.handleOverlap, undefined, this);

    }

    update(time){
        if(this){
            this.y = Math.sin((time+this.rand) / 350) / 1.4 + this.y;
            this.body.updateFromGameObject();
        }
    }

    handleOverlap(player, cookie){
        const idx = this.list.indexOf(cookie);
        this.list.splice(idx, 1);
        this.destroy();

        this.fire.setGravity(0, 300)
        this.fire.explode(0, cookie.x, cookie.y);
    }
}