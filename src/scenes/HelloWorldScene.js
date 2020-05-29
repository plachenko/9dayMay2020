import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene
{
	constructor()
	{
		super('hello-world')
	}

	preload()
    {
        this.load.setBaseURL('http://labs.phaser.io')

        this.load.image('sky', 'assets/skies/space3.png')
        this.load.image('logo', 'assets/sprites/phaser3-logo.png')
        this.load.image('red', 'assets/particles/red.png')
    }

    create()
    {
        this.add.image(400, 300, 'sky')
        // this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);
        this.matter.world.setBounds()

        const particles = this.add.particles('red')

        const emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        })

        /*
        this.tweens.add({
          targets: emitter,
          x: 100,
          // speed: 100,
          ease: 'Sine.easeInOut',
          duration: 1000,
          repeat: -1,
          yoyo: true
        });
        */

        this.matter.add.mouseSpring();

        const logo = this.matter.add.image(200, 10, 'logo');
        logo.setCircle()
        logo.setScale(.4);
        logo.setBounce(1);
        logo.setMass(900);

        emitter.startFollow(logo)
    }
}
